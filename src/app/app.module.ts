import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { HomeComponent } from './pages/home/home.component';
import { CardComponent } from './components/card/card.component';
import { MatcherComponent } from './pages/matcher/matcher.component';
import { RouteSelectorComponent } from './pages/route-selector/route-selector.component';
import { RouteViewerComponent } from './pages/route-viewer/route-viewer.component';
import { ItemPickerComponent } from './pages/item-picker/item-picker.component';
import { FinishComponent } from './pages/finish/finish.component';
import { ButtonComponent } from './components/button/button.component';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HomeComponent,
    CardComponent,
    MatcherComponent,
    RouteSelectorComponent,
    RouteViewerComponent,
    ItemPickerComponent,
    FinishComponent,
    ButtonComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GoogleMapsModule,
    HttpClientJsonpModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
