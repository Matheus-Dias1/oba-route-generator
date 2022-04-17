import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DIRECTIONS_API_KEY } from 'src/environments/keys';
import { ICoordinate } from '@whins/geo-cluster';

import mapStyles from './mapStyles';

import School from 'src/app/models/school';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  @Input() markers: School[] = [];

  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral = {
    lat: -18.91763284756446,
    lng: -48.271442430747506,
  };

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    styles: mapStyles,
  };

  schools: google.maps.LatLngLiteral[] = [];
  constructor(httpClient: HttpClient) {
    this.apiLoaded = httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${DIRECTIONS_API_KEY}`,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  ngOnInit(): void {
    this.schools = this.markers.map((school) => ({
      lat: school.address.lat!,
      lng: school.address.long!,
    }));
  }

  getMarkerOptions(route: number) {
    const op: google.maps.MarkerOptions = {
      icon: `https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${
        route + 1
      }|00729c|FFF`,
    };

    return op;
  }
}
