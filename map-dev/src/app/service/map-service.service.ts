import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { from } from 'rxjs/internal/observable/from';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  constructor(private _ngZone: NgZone, readonly http: HttpClient) { }

  search(map: google.maps.Map, lat: number, lng: number){
    return new Observable<any>(observer => {
        let restoList: google.maps.places.PlaceResult[] = [];
        //let page = 0;
        let timeOutId!:any;
     
        const callbackFunction = (results: google.maps.places.PlaceResult[] | null, 
          status: google.maps.places.PlacesServiceStatus, 
          pagination: google.maps.places.PlaceSearchPagination | null) => {
            console.log("coordinates:"+lat+", "+lng)
            console.log("status", status)
            this._ngZone.run(() => {
              if (status == google.maps.places.PlacesServiceStatus.OK) {          
                    //console.log("results");
                    if(results != null){
                      restoList.push(...results);
                    }
                    console.log(restoList);
                    // page++;
                    // console.log("page")
                    // console.log(page)
                    if (pagination && pagination.hasNextPage) {
                      timeOutId = setTimeout(()=>{
                        pagination.nextPage();
                      }, 5000);
                    }else{
                      clearTimeout(timeOutId);
                      observer.next(restoList);
                      observer.complete();
                    }
                
              }else if(status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT){
                  clearTimeout(timeOutId);
                  observer.next(restoList);
                  observer.complete();
              }
            });
        }

        const service = new google.maps.places.PlacesService(map);
        const cebuCenter = new google.maps.LatLng(lat,lng);
        
        const request: google.maps.places.TextSearchRequest = {
          location: cebuCenter,
          radius: 10000,
          query: 'restaurant'
        };

        service.textSearch(request, callbackFunction)

    })
  }

  // getData(): Observable<any>{
  //   const data = this.loadData();
  //   return from(data);
  // }

  getData(start: number, end:number): Observable<any>{
    let dataList = this.loadData().slice(start, end);
    console.log("data from service")
    console.log(dataList)
    return from(dataList);
  }

  getDataLen(){
    return this.loadData().length;
  }

  private loadData(){
    return [
      {"lat": 10.849821, "lng": 123.997192},
      {"lat": 10.607035, "lng": 123.984661},
      {"lat": 10.683026, "lng": 123.989850},
      {"lat": 10.469916, "lng": 123.973715},
      {"lat": 10.408502, "lng": 123.946080},
      {"lat": 11.223334, "lng": 124.021979},
      {"lat": 10.414361, "lng": 123.981142},
      {"lat": 11.143636, "lng": 123.982097},
      {"lat": 11.048239, "lng": 123.939827},
      {"lat": 10.941066, "lng": 123.936393},

      {"lat": 10.935845, "lng": 124.002320},
      {"lat": 10.852351, "lng": 123.912219},
      {"lat": 10.722157, "lng": 123.860033},
      {"lat": 10.730321, "lng": 123.941597},
      {"lat": 10.779397, "lng": 123.970952},
      {"lat": 9.962010, "lng": 123.444055},
      {"lat": 9.718356, "lng": 123.467616},
      {"lat": 9.755747, "lng": 123.385259},
      {"lat": 10.198270, "lng": 123.568464},
      {"lat": 9.922800, "lng": 123.552780},

      {"lat": 10.591627, "lng": 123.833554},
      {"lat": 9.844168, "lng": 123.419445},
      {"lat": 10.480958, "lng": 123.781197},
      {"lat": 10.115223, "lng": 123.529586},
      {"lat": 9.642000, "lng": 123.443820},
      {"lat": 9.800353, "lng": 123.495680},
      {"lat": 10.045848, "lng": 123.475170},
      {"lat": 9.597823, "lng": 123.369144},
      {"lat": 9.575142, "lng": 123.336957},
      {"lat": 9.663237, "lng": 123.369512},

      {"lat": 10.275852, "lng": 123.781448},
      {"lat": 9.940882, "lng": 123.409091},
      {"lat": 9.912982, "lng": 123.454924},
      {"lat": 9.538791, "lng": 123.400869},
      {"lat": 10.272601, "lng": 123.613651},
      {"lat": 9.997376, "lng": 123.456802},
      {"lat": 9.512678, "lng": 123.327101},
      {"lat": 10.179940, "lng": 123.685712},
      {"lat": 10.211534, "lng": 123.658761},
      {"lat": 9.463526, "lng": 123.343874},

      {"lat": 9.436012,  "lng": 123.323844},
      {"lat": 10.012121, "lng": 123.575334},
      {"lat": 10.052352, "lng": 123.589925},
      {"lat": 11.217719, "lng": 123.721945},
      {"lat": 11.184828, "lng": 123.743353},
      {"lat": 11.272939, "lng": 123.732135},
      {"lat": 11.164236, "lng": 123.786047},
      {"lat": 10.261134, "lng": 123.951272},
      {"lat": 10.305690, "lng": 124.007139},
      {"lat": 10.286022, "lng": 123.979592},

      {"lat": 10.296656, "lng": 123.947837},
      {"lat": 10.311525, "lng": 123.977010},
      {"lat": 10.295038, "lng": 123.856900},
      {"lat": 10.304596, "lng": 123.886692},
      {"lat": 10.327153, "lng": 123.904697},
      {"lat": 10.364867, "lng": 123.904861},
      {"lat": 10.406053, "lng": 123.910370},
      {"lat": 10.445840, "lng": 123.914306},
      {"lat": 10.463488, "lng": 123.879202},
      {"lat": 10.436861, "lng": 123.847719},

      {"lat": 10.398157, "lng": 123.863461},
      {"lat": 10.398466, "lng": 123.799236},
      {"lat": 10.357434, "lng": 123.803171},
      {"lat": 10.322695, "lng": 123.839485},
      {"lat": 10.497635, "lng": 124.010024},
      {"lat": 10.520227, "lng": 124.013865},
      {"lat": 10.544867, "lng": 124.012148},
      {"lat": 10.561743, "lng": 123.988631},
      {"lat": 10.575243, "lng": 123.964255},
      {"lat": 10.581149, "lng": 123.932841},

      {"lat": 10.559887, "lng": 123.925803},
      {"lat": 10.537104, "lng": 123.920309},
      {"lat": 10.517020, "lng": 123.905203},
      {"lat": 10.514140, "lng": 123.947063},
      {"lat": 10.510946, "lng": 123.987180},
      {"lat": 10.322080, "lng": 123.927845},
      {"lat": 10.329511, "lng": 123.939518},
      {"lat": 10.331706, "lng": 123.951191},
      {"lat": 10.338715, "lng": 123.962864},
      {"lat": 10.348847, "lng": 123.956598},

      {"lat": 10.355771, "lng": 123.946985},
      {"lat": 10.361596, "lng": 123.939003},
      {"lat": 10.371137, "lng": 123.933595},
      {"lat": 10.359486, "lng": 123.928960},
      {"lat": 10.353153, "lng": 123.924068},
      {"lat": 10.341332, "lng": 123.923553},
      {"lat": 10.341586, "lng": 123.936256},
      {"lat": 10.251037, "lng": 123.829459},
      {"lat": 10.253484, "lng": 123.844284},
      {"lat": 10.260355, "lng": 123.856049},

      {"lat": 10.268920, "lng": 123.841224},
      {"lat": 10.285766, "lng": 123.826972},
      {"lat": 10.299882, "lng": 123.815303},
      {"lat": 10.315316, "lng": 123.814059},
      {"lat": 10.329478, "lng": 123.803299},
      {"lat": 10.325808, "lng": 123.788569},
      {"lat": 10.312916, "lng": 123.790865},
      {"lat": 10.305670, "lng": 123.796604},
      {"lat": 10.297247, "lng": 123.801864},
      {"lat": 10.288589, "lng": 123.810568},

      {"lat": 10.281531, "lng": 123.817503},
      {"lat": 10.273108, "lng": 123.820181},
      {"lat": 10.265249, "lng": 123.824963}

    ];
  }
}
