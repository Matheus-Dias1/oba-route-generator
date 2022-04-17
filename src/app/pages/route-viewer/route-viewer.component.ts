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

  // Aux
  routeKeys: string[] = [];

  constructor(private mapsService: MapsService) {}

  ngOnInit(): void {
    this.clusterize();
    this.nextRoute();
  }

  async nextRoute() {
    this.loading = true;
    this.changeRoute('NEXT');
    const key = this.routeKeys[this.currRoute - 1];
    if (key.includes('OBA-')) {
      this.markers = this.routes[key].schools;
      this.routes[key].optimalRoute = [];
      this.markers.forEach((_, i) => {
        this.routes[key].optimalRoute!.push(i);
      });
      await delay(1000);
      this.loading = false;
      return;
    }
    const distances = await this.mapsService.getDistances(
      this.routes[key].schools
    );
    await delay(1000);
    const optimal = new OptimalRoute(distances);
    [this.routes[key].optimalRoute, this.routeLength] =
      await optimal.getRoute();

    this.markers = this.routes[key].optimalRoute!.map(
      (i) => this.routes[key].schools[i]
    );
    this.loading = false;
  }

  async getDistanceMatrix(key: string) {}

  clusterize() {
    const noRouteAssigned = this.schools.filter(
      (school) => school.address.route === undefined
    );
    geoCluster(noRouteAssigned, this.numRoutes);

    for (let school of this.schools) {
      const route = school.address.route!;
      if (this.routes[route]) this.routes[route].schools.push(school);
      else this.routes[route] = { schools: [school] };
    }

    this.routeKeys = Object.keys(this.routes);
  }

  changeRoute(op: string) {
    if (op === 'NEXT')
      this.currRoute = Math.min(this.currRoute + 1, this.routeKeys.length);
    else if (op === 'PREV') this.currRoute = Math.max(this.currRoute - 1, 1);
  }

  getRouteLength() {
    if (this.routeKeys[this.currRoute - 1].includes('OBA-')) return '';
    const inKm = this.routeLength / 1000;
    return inKm.toFixed(1) + 'km';
  }

  onNextRoute() {
    if (this.currRoute === this.routeKeys.length) {
      for (let key in this.routes) {
        this.routes[key].schools = this.routes[key].optimalRoute!.map(
          (i) => this.routes[key].schools[i]
        );
      }
      this.onFinish.emit(this.routes);
    } else this.nextRoute();
  }
}
