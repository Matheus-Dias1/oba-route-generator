import { Component } from '@angular/core';
import geoCluster from './helpers/geoKMEANS';
import MOCK_SCHOOLS from './mock/schools';
import routes from './models/routes';
import School from './models/school';
import { MapsService } from './services/maps.service';
import { workflow } from './workflow';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // View controls
  workflow = workflow;
  step = 0;

  // Data
  routes: routes = {};
  files: School[][] = [];
  schools: School[] = [];
  selectedItems: string[] = [];
  numRoutes = 1;

  constructor() {}

  onSchoolsLoaded(files: School[][]) {
    this.files = files;
    if (files.length === 1) {
      this.schools = files[0];
      this.step += 2;
    } else this.step += 1;
  }

  onMatchesDone(schools: School[]) {
    this.schools = schools;
    this.step += 1;
  }

  numRoutesPicked(num: number) {
    this.numRoutes = num;
    this.step += 1;
  }

  onRouteReviewDone(routes: routes) {
    this.routes = routes;
    this.step += 1;
  }

  onPickItems(selectedItems: string[]) {
    this.selectedItems = selectedItems;
    this.step += 1;
  }

  onRestart() {
    this.step = 0;
  }

  // async setDistances() {
  //   for (let i = 0; i < this.schools.length; i++) {
  //     await this.mapsService.getCoordinates(this.schools[i]);
  //   }

  //   geoCluster(this.schools, 3);
  //   this.schools.forEach((school) => console.log(school.address));
  //   //this.distances = await this.mapsService.getDistances(this.schools);
  //   // this.distances.forEach((line) => {
  //   //   line.forEach((dist) => console.log(`${dist}\t`));
  //   //   console.log('\n');
  //   // });
  // }
}
