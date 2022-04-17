import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { getReceipt, getRoutesList } from 'src/app/helpers/pdf/generatePDFs';
import School, { Items } from 'src/app/models/school';
import { MapsService } from 'src/app/services/maps.service';
const csv2json = require('../../helpers/csvToJson.js');

const propMap = {
  address: 'END',
  name: 'ESCOLA',
  route: 'ROTA',
};

const expectedKeys = [propMap.address, propMap.name, propMap.route];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Output() schoolsLoaded = new EventEmitter<School[][]>();
  files: School[][] = [];
  loading = false;

  constructor(private mapsService: MapsService) {}

  ngOnInit(): void {}

  onDownloadTemplate() {
    window.location.href = '../../../assets/template.csv';
  }

  async onFileSelect(e: Event) {
    const csvFiles: any[] = [];
    if (e.target) {
      const files = (e.target as HTMLInputElement).files || [];
      if (!files.length) return;
      for (let i = 0; i < files.length; i++) {
        const data = await files[i].text();
        csvFiles.push(csv2json(data));
      }

      const schools: School[][] = [];
      csvFiles.forEach((file, i) => {
        schools.push([]);
        for (let record of file) {
          const info = {
            name: record[propMap.name],
            address: record[propMap.address],
            route:
              record[propMap.route] === '' ? undefined : record[propMap.route],
          };
          const items: Items = [];
          for (let key in record) {
            if (!expectedKeys.includes(key)) {
              const item = key.split(':')[0].trim();
              const unit = key.split(':')[1].trim();
              items.push({
                description: item,
                amount: record[key],
                unit,
              });
            }
          }
          const school = new School(
            info.name,
            info.address,
            items,
            info.route ? `OBA-${info.route}` : undefined
          );
          schools[i].push(school);
        }
      });

      this.files = schools;
      // TODO: Loading animation
      this.loading = true;
      await this.setCoordinates();
      setTimeout(() => {
        this.loading = false;
        this.schoolsLoaded.emit(this.files);
      }, 3000);
    }
  }

  async setCoordinates() {
    // TODO: prompt city somehow
    // const city = window.prompt('Qual a cidade?');
    const city = 'Uberlândia';
    this.files.forEach((file) => {
      file.forEach(async (school) => {
        await this.mapsService.getCoordinates(school, city ? city : '');
      });
    });
  }
}
