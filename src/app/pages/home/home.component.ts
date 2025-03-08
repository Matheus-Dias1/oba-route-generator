import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import School, { Items } from 'src/app/models/school';
import { MapsService } from 'src/app/services/maps.service';
import * as ExcelJS from 'exceljs';

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
    window.location.href = '../../../assets/template.xlsx';
  }

  async onFileSelect(event: Event): Promise<void> {
    const element = event.target as HTMLInputElement;
    const files = element.files;

    if (!files || files.length === 0) {
      return;
    }

    const schools: School[][] = [];
    try {
      this.loading = true;
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      workbook.eachSheet((worksheet, sheetId) => {
        let name = '';
        let route = '';
        const items: string[] = [];
        const units: string[] = [];
        const routeSchools: School[] = [];

        worksheet.eachRow((row, rowNumber) => {
          const rowValues = row.values as (string | number)[];
          switch (rowNumber) {
            case 2: {
              route = rowValues[2] as string;
              rowValues.splice(0, 3);
              items.push(...rowValues.map((val) => val as string));
              break;
            }
            case 3: {
              rowValues.splice(0, 3);
              units.push(...rowValues.map((val) => val as string));
              break;
            }
            default: {
              const evenRow = rowNumber % 2 === 0;
              if (evenRow) {
                name = rowValues[2] as string;
              } else {
                if (name !== undefined) {
                  const [, , address] = rowValues.splice(0, 3);
                  const newSchool = new School(
                    name,
                    address as string,
                    rowValues
                      .map((val, idx) => ({
                        description: items[idx] as string,
                        amount: val as number,
                        unit: units[idx] as string,
                      }))
                      .filter((i) => i.amount !== null),
                    route
                  );
                  if (newSchool.items.some((i) => i.amount > 0)) {
                    routeSchools.push(newSchool);
                  }
                }
              }
            }
          }
        });

        schools.push(routeSchools);
      });

      this.files = schools;
      this.schoolsLoaded.emit(this.files);
    } catch (error) {
      console.error('Error processing Excel files:', error);
    } finally {
      this.loading = false;
    }
  }

  async setCoordinates() {
    // TODO: prompt city somehow
    // const city = window.prompt('Qual a cidade?');
    const city = 'Uberlândia';
    this.files.forEach((file) => {
      file.forEach(async (school) => {
        if (school.address.route) return;
        await this.mapsService.getCoordinates(school, city ? city : '');
      });
    });
  }
}
