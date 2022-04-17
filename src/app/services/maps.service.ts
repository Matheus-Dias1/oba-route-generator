import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DIRECTIONS_API_KEY, GEOCODING_API_KEY } from 'src/environments/keys';
import SquareMatrixDivider from '../helpers/submatrix';
import School from '../models/school';
import { DistanceMatrixApiResponse, GeocodingResponse } from './http/types';

const DISTANCE_MATRIX_SIZE = 10;
const GEOCODE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const DIRECTIONS_API_URL =
  'https://maps.googleapis.com/maps/api/distancematrix/json';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  constructor(private http: HttpClient) {}

  async getCoordinates(school: School, city: string) {
    const res$ = this.http.get<GeocodingResponse>(GEOCODE_API_URL, {
      params: {
        address: `${school.address.rawAddr} - ${city}`,
        key: GEOCODING_API_KEY,
      },
    });

    const res = await firstValueFrom(res$);

    if (!res.results.length)
      throw new Error(
        `Não foi possível encontrar as coordenadas da escola ${school.address.rawAddr}`
      );

    const schoolAddr = res.results[0];

    const addr = schoolAddr.formatted_address;
    const lat = schoolAddr.geometry.location.lat;
    const long = schoolAddr.geometry.location.lng;
    const boundingbox = [
      schoolAddr.geometry.viewport.northeast.lat,
      schoolAddr.geometry.viewport.northeast.lng,
      schoolAddr.geometry.viewport.southwest.lat,
      schoolAddr.geometry.viewport.southwest.lng,
    ];

    school.setCoordinates(addr, lat, long, boundingbox);
  }

  async getDistances(schools: School[]): Promise<number[][]> {
    const matrix: number[][] = [];
    schools.forEach((_, i) => {
      matrix.push([]);
      schools.forEach(() => matrix[i].push(Number.MAX_SAFE_INTEGER));
    });

    const smd = new SquareMatrixDivider(matrix);
    const bounds = smd.getBounds(DISTANCE_MATRIX_SIZE);

    bounds.forEach(async (bounds) => {
      const origins = schools.slice(bounds.start.x, bounds.end.x + 1);
      const destinations = schools.slice(bounds.start.y, bounds.end.y + 1);

      const originsStr = origins
        .map((school) => `${school.address.lat},${school.address.long}`)
        .join('|');

      const destinationsStr = destinations
        .map((school) => `${school.address.lat},${school.address.long}`)
        .join('|');

      const res$ = this.http.get<DistanceMatrixApiResponse>(
        DIRECTIONS_API_URL,
        {
          params: {
            key: DIRECTIONS_API_KEY,
            destinations: destinationsStr,
            origins: originsStr,
            units: 'metric',
            region: 'br',
          },
        }
      );

      const res = await firstValueFrom(res$);

      if (res.status !== 'OK')
        throw new Error(
          'Unable to get distance matrix for the given addresses'
        );
      res.rows.forEach((row, i) => {
        const x = i + bounds.start.x;
        row.elements.forEach((elem, j) => {
          const y = j + bounds.start.y;
          matrix[x][y] = elem.distance.value;
        });
      });
    });

    return matrix;
  }
}
