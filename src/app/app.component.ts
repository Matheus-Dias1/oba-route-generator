import { Component } from '@angular/core';
import routes from './models/routes';
import School from './models/school';
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
  date: string | null = null;
  selectedItems: string[] = [];
  numRoutes = 1;

  constructor() {}

  onSchoolsLoaded(files: School[][]) {
    this.files = files;
    this.schools = files
      .flat()
      .filter((s) => s.items.some((i) => i.amount > 0));
    this.routes = files.reduce((acc, curr, idx) => {
      const currRoute = curr[0]?.address.route;
      if (currRoute && !acc[currRoute]) {
        acc[currRoute] = { schools: curr };
      } else if (currRoute) {
        acc[currRoute].schools.push(...curr);
      }

      return acc;
    }, {} as routes);
    this.step += 4;
  }

  onMatchesDone(schools: School[]) {
    this.schools = schools;
    this.step += 1;
  }

  numRoutesPicked(num: number) {
    this.numRoutes = num;
    this.step += 2;
  }

  onRouteReviewDone(routes: routes) {
    this.routes = routes;
    this.step += 1;
  }

  onPickItems(selectedItems: string[], date: string | null) {
    this.selectedItems = selectedItems;
    this.date = date;
    this.step += 1;
  }

  onRestart() {
    this.step = 0;
  }
}
