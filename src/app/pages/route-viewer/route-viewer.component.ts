import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import delay from 'src/app/helpers/delay';
import geoCluster from 'src/app/helpers/geoKMEANS';
import OptimalRoute from 'src/app/helpers/optimalRoute';
import routes from 'src/app/models/routes';
import School from 'src/app/models/school';
import { MapsService } from 'src/app/services/maps.service';

@Component({
  selector: 'app-route-viewer',
  templateUrl: './route-viewer.component.html',
  styleUrls: ['./route-viewer.component.css'],
})
export class RouteViewerComponent implements OnInit {
  @Input() schools: School[] = [];
  @Input() numRoutes = 0;
  @Output() onFinish = new EventEmitter<routes>();

  // View
  loading = true;
  currRoute = 0;
  markers: School[] = [];

  // Data
  routes: routes = {};
  routeLength = 0;
  currDistances: number[][] = [];

  // Aux
  routeKeys: string[] = [];

  constructor(private mapsService: MapsService) {}

  ngOnInit(): void {
    this.clusterize();
    this.onNextRoute();
  }
  async nextRoute() {
    this.changeRoute('NEXT');
    this.loading = true;
    const key = this.routeKeys[this.currRoute - 1];
    if (key.includes('OBA-')) {
      this.onNextRoute();
      return;
    }
    this.currDistances = await this.mapsService.getDistances(
      this.routes[key].schools
    );
    await delay(1000);
    const optimal = new OptimalRoute(this.currDistances);
    [this.routes[key].optimalRoute, this.routeLength] =
      await optimal.getRoute();

    this.markers = this.routes[key].optimalRoute!.map(
      (i) => this.routes[key].schools[i]
    );
    this.loading = false;
  }

  async retryRoute() {
    this.loading = true;
    const key = this.routeKeys[this.currRoute - 1];
    await delay(1000);
    const optimal = new OptimalRoute(this.currDistances);
    [this.routes[key].optimalRoute, this.routeLength] =
      await optimal.getRoute();

    this.markers = this.routes[key].optimalRoute!.map(
      (i) => this.routes[key].schools[i]
    );
    this.loading = false;
  }

  clusterize() {
    const noRouteAssigned = this.schools.filter(
      (school) => school.address.route === undefined
    );
    if (noRouteAssigned.length) geoCluster(noRouteAssigned, this.numRoutes);

    for (let school of this.schools) {
      const route = school.address.route!;
      if (this.routes[route]) this.routes[route].schools.push(school);
      else this.routes[route] = { schools: [school] };
    }

    this.routeKeys = Object.keys(this.routes);
  }

  changeRoute(op: string) {
    if (op === 'NEXT') {
      this.currRoute = Math.min(this.currRoute + 1, this.routeKeys.length);
    } else if (op === 'PREV') this.currRoute = Math.max(this.currRoute - 1, 1);
  }

  getRouteLength() {
    if (this.routeKeys[this.currRoute - 1].includes('OBA-')) return '';
    const inKm = this.routeLength / 1000;
    return inKm.toFixed(1) + 'km';
  }

  async onNextRoute() {
    if (this.currRoute === this.routeKeys.length) {
      for (let key in this.routes) {
        if (this.routes[key].optimalRoute) {
          this.routes[key].schools = this.routes[key].optimalRoute!.map(
            (i) => this.routes[key].schools[i]
          );
        }
      }
      await delay(100);
      this.onFinish.emit(this.routes);
    } else this.nextRoute();
  }
}
