import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { GOOGLE_MAPS_API_CONFIG, NgMapsGoogleModule } from '@ng-maps/google';
import { NgMapsCoreModule } from '@ng-maps/core';
import { MapServiceService } from './service/map-service.service';
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    NgMapsCoreModule,
    NgMapsGoogleModule,
    HttpClientModule 
  ],
  providers: [
    MapServiceService,
    {
    provide: GOOGLE_MAPS_API_CONFIG,
    useValue: {
      apiKey: 'AIzaSyA35zgkXOWf2awKu7U9vs5mMwxez8pxG8U',
      libraries: ["places", "geometry" ]
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
