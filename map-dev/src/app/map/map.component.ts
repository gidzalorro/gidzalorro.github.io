import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MapServiceService } from '../service/map-service.service';
import { Observable, filter, map, takeWhile } from 'rxjs';
import { from } from 'rxjs/internal/observable/from';
import { GeoPoint } from '@ng-maps/core';

interface RestoMarker{
  name: string;
  address: string;
  lat: number;
  lng: number;
  iconMarker: string;
  placeId: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, DoCheck{

  defaultLat = 10.356653195077541;
  defaultLng = 123.76655771616127;
  defaultZoom = 9;

  userlat = 10.31672;
  userlng = 123.89071;
  timeOutId!: any;
  isAlive: boolean = true;
  
  userMarker = '../../assets/img/user-64.png';
  activeRestoMarker = '../../assets/img/resto-active-32.png';
  inactiveRestoMarker = '../../assets/img/resto-inactive-32.png';

  mapInstance!:google.maps.Map;
  restoList: google.maps.places.PlaceResult[] = [];
  restoMarkers: RestoMarker[] = []
  restoMarkersTemp: RestoMarker[] = []
  observedLimit:number[] = []
  observedCount:number[] = []
  loadedData:any[] = [];

  startNum: number = 0;
  endNum: number = 10;
  totalData: number = this.mapService.getDataLen();
  dataSize = 10;
  stopRecursive = false;
  loadMarkers = false;
  mapClicked = false;
  userOutSideCebu = false;
  showLoader = true;
  countedMarkersWithinRadius: number = 0;
  showLoaderPage = false;

  cebuPolygon!:google.maps.Polygon;
  cebuProviceCoords: google.maps.LatLng[] = [];

  createDirection: boolean = true;
  directionsService!:google.maps.DirectionsService;
  directionsRenderer!:google.maps.DirectionsRenderer;
  
  dataLoaded:any = 0;

  @ViewChild('poly', { static: false })
  polygon!: any;

  constructor(private mapService: MapServiceService, private changeRef: ChangeDetectorRef){}

  ngOnInit(){
    // this.cebuProviceCoords = [
    //   new google.maps.LatLng(11.351996346853518, 124.07417490366127),
    //   new google.maps.LatLng(11.284667194246785, 123.65944101694252),
    //   new google.maps.LatLng(10.767059601643384, 123.70063974741127),
    //   new google.maps.LatLng(9.767110147263232, 123.23921396616127),
    //   new google.maps.LatLng(9.379819616468186, 123.30238535288002),
    //   new google.maps.LatLng(9.434012558406371,  123.46718027475502),
    //   new google.maps.LatLng(10.453904087978662, 124.18129160288002),
    //   new google.maps.LatLng(11.279280178669888, 124.159318946630027)
    // ];

    
    // this.cebuProviceCoords = [
    //   {lat:11.351996346853518, lng:124.07417490366127},
    //   {lat:11.284667194246785, lng:123.65944101694252},
    //   {lat:10.767059601643384, lng:123.70063974741127},
    //   {lat:9.767110147263232, lng:123.23921396616127},
    //   {lat:9.379819616468186, lng:123.30238535288002},
    //   {lat:9.434012558406371, lng:123.46718027475502},
    //   {lat:10.453904087978662, lng:124.18129160288002},
    //   {lat:11.279280178669888, lng:124.159318946630027},
    // ];

    // console.log("polygon") 
    // console.log(this.polygon) 
  
    // this.cebuPolygon = new google.maps.Polygon({ paths: this.cebuProviceCoords });


  }

  clickPoly(event:any){
    console.log(event);
  }

  ngDoCheck(){
    if(this.loadMarkers){
      for(let marker of this.restoMarkersTemp){
          let markerLatLng = new google.maps.LatLng(marker.lat, marker.lng);
          let userLatLng = new google.maps.LatLng(this.userlat, this.userlng);
          if(google.maps.geometry.poly.containsLocation(
            markerLatLng,
            this.cebuPolygon)){ 
              console.log("marker pushed")

              // let disMeters = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, markerLatLng);
              // //check within 2km
              // if(disMeters < 2000){
              //   this.countedMarkersWithinRadius = this.countedMarkersWithinRadius + 1;
              //   marker.iconMarker = this.activeRestoMarker;
              // }
              this.restoMarkers.push(marker);
              this.changeRef.detectChanges();
          }
      }
      this.loadMarkers = false;
      this.showLoader = false;
      //this.defaultZoom = 12;
      this.changeRef.detectChanges();
    }
  }

  initializeGoogle(){
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.cebuProviceCoords = [
        new google.maps.LatLng(11.351996346853518, 124.07417490366127),
        new google.maps.LatLng(11.284667194246785, 123.65944101694252),
        new google.maps.LatLng(10.767059601643384, 123.70063974741127),
        new google.maps.LatLng(9.767110147263232, 123.23921396616127),
        new google.maps.LatLng(9.379819616468186, 123.30238535288002),
        new google.maps.LatLng(9.434012558406371,  123.46718027475502),
        new google.maps.LatLng(10.453904087978662, 124.18129160288002),
        new google.maps.LatLng(11.279280178669888, 124.159318946630027)
      ];
    this.cebuPolygon = new google.maps.Polygon({ paths: this.cebuProviceCoords });
  }

  getMapInstance(event:google.maps.Map){
    this.mapInstance = event;
    this.initializeGoogle()
    this.loadData(this.mapService.getData(this.startNum, this.endNum));
  }

  getUserCoordinates(event: any){
    this.userlat = event.coords.lat 
    this.userlng = event.coords.lng
    this.countedMarkersWithinRadius = 0;
    this.mapClicked = true;
    this.restoMarkers = [];
    let userLatLng = new google.maps.LatLng(this.userlat, this.userlng);
    console.log("len", this.restoMarkersTemp.length);
    this.showLoaderPage = true;
    if(google.maps.geometry.poly.containsLocation(userLatLng,this.cebuPolygon)){
      for(let marker of this.restoMarkersTemp){
        let markerLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        
        if(google.maps.geometry.poly.containsLocation(markerLatLng,this.cebuPolygon)){
            console.log("marker pushed")
  
            let disMeters = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, markerLatLng);
            //check within 2km
            if(disMeters < 2000){
              this.countedMarkersWithinRadius = this.countedMarkersWithinRadius + 1;
              marker.iconMarker = this.activeRestoMarker;
              this.restoMarkers.push(marker);
            }          
            this.changeRef.detectChanges();
        }
      }
    }else{
      this.mapClicked = false;
      this.userOutSideCebu = true;
      this.changeRef.detectChanges();
    }

    this.showLoaderPage = false;
    this.changeRef.detectChanges();
  }

  closePopUpNotif(){
    this.userOutSideCebu = false;
  }

  // loadResturants(lat: number, lng: number){
  //   const service = new google.maps.places.PlacesService(this.mapInstance);
  //   const cebuCenter = new google.maps.LatLng(lat,lng);
    
  //   const request: google.maps.places.TextSearchRequest = {
  //     location: cebuCenter,
  //     radius: 10000,
  //     query: 'restaurant'
  //   };

  //   let page = 0;
  //   service.textSearch(request, (results, status, pagination) => {
  //     if (status == google.maps.places.PlacesServiceStatus.OK) {
  //       console.log("coordinates:"+lat+", "+lng)
  //       console.log("results");
  //       if(results != null){
  //         this.restoList.push(...results);
  //       }
  //       console.log(this.restoList);
  //       page++;
  //       console.log("page")
  //       console.log(page)
  //       if (pagination && pagination.hasNextPage) {
  //         this.timeOutId = setTimeout(()=>{
  //           pagination.nextPage();
  //         }, 2000);
  //       }else{
  //         clearTimeout(this.timeOutId);
  //         this.loadRestoMarkers();
  //       }

  //     }
  //   });
  // }

  // loadRestoMarkers(){
  //   for(let el of this.restoList){
  //     let restoMarker: RestoMarker = {
  //       name: el.name ? el.name: '',
  //       address: el.formatted_address ? el.formatted_address: '',
  //       lat: el.geometry && el.geometry.location ? el.geometry.location?.lat() : 0,
  //       lng: el.geometry && el.geometry.location ? el.geometry.location?.lng() : 0,
  //       iconMarker: this.inactiveRestoMarker,
  //       placeId: el.place_id ? el.place_id: ''
  //     }

  //     if(restoMarker.lat !== 0 && restoMarker.lng !== 0){
  //       this.restoMarkers.push(restoMarker);
  //     }
      
  //   }
  // }


  getDirection(lat:any, lng:any, cancel:boolean = false){
    this.directionsRenderer.setOptions({suppressMarkers: true})
    const destination = {lat: lat, lng: lng}
    const origin = {lat: this.userlat, lng: this.userlng}

    if(!cancel){
      this.createDirection = false;
      this.directionsRenderer.setMap(this.mapInstance);
      this.directionsService.route({
        origin: {
          query: `${origin.lat},${origin.lng}`,
        },
        destination: {
          query:  `${destination.lat},${destination.lng}`,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response:any) => {
        this.directionsRenderer.setDirections(response);
      });
    }else{
      this.directionsRenderer.setMap(null);
      this.createDirection = true;
    }
  }

  loadData(loadedData: Observable<any>){
    console.log("execute :"+this.startNum+ ", "+this.endNum);
    console.log("total:", this.totalData)
    // let intervalID!:any;

    // intervalID = setInterval(()=>{
    //   this.isAlive = this.isAlive ? !this.isAlive : this.isAlive;
    // }, 6000)

    //this.loadedData = this.mapService.getData().slice(0, 10);

    const dataObserver = {
      next: (data: any) => {
        console.log("data")
        console.log(data)        
        this.excecute(data);

        // this.observed.push(1);
        // console.log("observed: ", this.observed.length)
        // if(this.observed.length === 10){
        //   this.observed = [];
        //   this.startNum = this.startNum + 10;
        //   this.endNum = this.endNum + 10;
        //   console.log("new start and end :"+this.startNum+ ", "+this.endNum);
        //   if(this.totalData < this.endNum){
        //     console.log("endNum is greater than total len")
        //     this.endNum = this.totalData;
        //     this.stopRecursive = true;
        //   }
        //   this.timeOutId = setTimeout(() => {
        //     console.log("execute again: "+this.startNum+ ", "+this.endNum);
        //     this.loadData(this.mapService.getData(this.startNum, this.endNum))
        //     if(this.stopRecursive){
        //       clearTimeout(this.timeOutId);
        //     }
        //   }, 10000);
        // }
       
      },
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };

    // const newObservable = new Observable((subscriber:any) => {
    //   subscriber.next(loadedData);
    //   subscriber.complete();
    // })

    loadedData.subscribe(dataObserver);

    // const newObservable = from(loadedData);
    // newObservable.subscribe(dataObserver);

    //this.mapService.getData().pipe(takeWhile(_ => this.isAlive)).subscribe(dataObserver);

  }

  excecute(data:any){
      this.mapService.search(this.mapInstance, data.lat, data.lng).pipe(
        map(data => {
          return data.map((element: any) => {
            return {
              name: element.name ? element.name: '',
              address: element.formatted_address ? element.formatted_address: '',
              lat: element.geometry && element.geometry.location ? element.geometry.location?.lat() : 0,
              lng: element.geometry && element.geometry.location ? element.geometry.location?.lng() : 0,
              iconMarker: this.inactiveRestoMarker,
              placeId: element.place_id ? element.place_id: ''
            }
          });    
        }),
        filter(data => data.lat !== 0 && data.lng !== 0)
      ).subscribe(res => {
        console.log("results");
        console.log(res);
        if(res.length > 0){
          console.log("push result")
          this.restoMarkersTemp.push(...res);
        }       
        this.observedLimit.push(1);
        this.observedCount.push(1);
        this.dataLoaded = Math.ceil((this.observedCount.length/this.totalData)*100);
        console.log("observed len:", this.observedLimit.length);
        this.changeRef.detectChanges();
        if(this.observedLimit.length === 10){
          console.log("observed is 10")

          this.observedLimit = [];
          this.startNum = this.startNum + 10;
          this.endNum = this.endNum + 10;
          if(this.totalData < this.endNum){
            console.log("endNum is greater than total len")
            this.endNum = this.totalData;
            this.stopRecursive = true;
          }

          this.timeOutId = setTimeout(() => {
            console.log("execute again: "+this.startNum+ ", "+this.endNum);
            this.loadData(this.mapService.getData(this.startNum, this.endNum))           
          }, 5000);
          
        }

        if(this.stopRecursive){
          this.loadMarkers = true;
          clearTimeout(this.timeOutId);
        }

      });
  }

}
