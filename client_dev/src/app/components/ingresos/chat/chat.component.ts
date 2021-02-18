import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../../services/message.service';
import { Message } from '../../../../models/message.model'
import { UsuarioService } from '../../../../services/usuario.service';
// import { google } from '@agm/core/services/google-maps-types';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [MessageService, UsuarioService]
})
export class ChatComponent implements OnInit {

  @ViewChild('map', { static: true }) mapElement: any;
  map: google.maps.Map;
  lat: number;
  lng: number;
  zoom: number;
  mapTypeId: string;
  origin = { lat: 29.8174782, lng: -95.6814757 };
  destination = { lat: 40.6976637, lng: -74.119764 };
  waypoints = [
     {location: { lat: 39.0921167, lng: -94.8559005 }},
     {location: { lat: 41.8339037, lng: -87.8720468 }}
  ];
  directionsService ;
  directionsRenderer;
  constructor(
    private activated: ActivatedRoute,
    private _MessageService: MessageService,
    private _UsuarioService: UsuarioService,
    private mapsAPILoader: MapsAPILoader
  ) {
    // this.mapsAPILoader.load().then(()=>{      
    //   // this.directionsService  = new google.maps.DirectionsService();
    //   // this.directionsRenderer = new google.maps.DirectionsRenderer();
    //   this.initMap();
    // }).catch((error)=>{
    //   console.error(error as any);
      
    // })
    this.lat = 40;
    this.lng = -3;
    this.zoom = 6;
    this.mapTypeId = 'hybrid';
    this.GetCountries();
  }
  JSONStringify(object): string {
    let str = JSON.stringify(object);
    str.replace(/'["]'/g, '\"');
    return str
  }
  initMap() {
    const directionsService  = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();

    const map = new google.maps.Map(
      document.getElementById("MyGoogleMap") as HTMLDivElement,
      {
        zoom: 6,
        center: {lat: -1.482292789730304, lng: -77.99914699292728},
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ]
      }
    )
    directionsRenderer.setMap(map);
    // llamado a rutas
    (document.getElementById("GetRoute") as HTMLElement).addEventListener(
      "click",
      () => {
        this.calculateAndDisplayRoute(directionsService, directionsRenderer);
      }
    );
    // llamado a buscar direccion
    (document.getElementById("GetAddress") as HTMLElement).addEventListener(
      "click",
      () => {
        this.geocodeAddress(geocoder, map, infowindow);
      }
    );
    // click en el mapa
    map.addListener("click", (e)=> {
      // this.placeMarkerAndPanTo(e.latLng, map, infowindow);
      console.log(e);
      
      this.geocodeLatLng(e.latLng, geocoder, map, infowindow);
    })
  }
  public currPosition;
  // visualizar coordenadas
  geocodeLatLng(
    latLng,
    geocoder: google.maps.Geocoder,
    map: google.maps.Map,
    infowindow: google.maps.InfoWindow
  ) {
    const input = latLng;
    // const latlngStr = input.split(",", 2);
    // const latlng = {
    //   lat: parseFloat(latlngStr[0]),
    //   lng: parseFloat(latlngStr[1]),
    // };
    const latlng = input
    geocoder.geocode(
      { location: latlng },
      (
        results: google.maps.GeocoderResult[],
        status: google.maps.GeocoderStatus
      ) => {
        if (status === "OK") {
          if (results[0]) {
            // map.setZoom(11);
            infowindow.close();
            // const marker = new google.maps.Marker({
            //   position: latlng,
            //   map: map,
            // });
            infowindow.setPosition(latlng);
            infowindow.setContent(results[0].formatted_address);
            console.log(results);
            this.currPosition = results[0]
            infowindow.open(map);
            // infowindow.open(map, marker);
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }

  // marcador y centrado de pantalla
  placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map, infowindow: google.maps.InfoWindow) {
    new google.maps.Marker({
      position: latLng,
      map: map,
    });
    // pan to es para centrar la vista del mapa
    map.panTo(latLng);
  }

  // rutas con puntos intermedios
  calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {
    const waypts: google.maps.DirectionsWaypoint[] = [];
    const checkboxArray = document.getElementById(
      "waypoints"
    ) as HTMLSelectElement;
  
    for (let i = 0; i < checkboxArray.length; i++) {
      if (checkboxArray.options[i].selected) {
        waypts.push({
          location: (checkboxArray[i] as HTMLOptionElement).value,
          stopover: true,
        });
      }
    }
  
    directionsService.route(
      {
        origin: (document.getElementById("start") as HTMLInputElement).value,
        destination: (document.getElementById("end") as HTMLInputElement).value,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        console.log(response);
        
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          const route = response.routes[0];
          const summaryPanel = document.getElementById(
            "directions-panel"
          ) as HTMLElement;
          summaryPanel.innerHTML = "";
  
          // For each route, display summary information.
          for (let i = 0; i < route.legs.length; i++) {
            const routeSegment = i + 1;
            summaryPanel.innerHTML +=
              "<b>Route Segment: " + routeSegment + "</b><br>";
            summaryPanel.innerHTML += route.legs[i].start_address + " to ";
            summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
            summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
          }
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
  // buscar direccion
  geocodeAddress(
    geocoder: google.maps.Geocoder,
    map: google.maps.Map,
    infowindow: google.maps.InfoWindow
  ) {
    const address = (document.getElementById("address") as HTMLInputElement)
      .value;
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        infowindow.close();
        console.log(results);
        this.currPosition = results[0];
        map.setCenter(results[0].geometry.location);
        infowindow.setPosition(results[0].geometry.location);
        infowindow.setContent(results[0].formatted_address);
        console.log(results);
        this.currPosition = results[0]
        infowindow.open(map);
        // new google.maps.Marker({
        //   map: resultsMap,
        //   position: results[0].geometry.location,
        // });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
  public paises: any[] = [];
  GetCountries() {
    this._MessageService.getAll().subscribe(
      response => {
        // console.log(response);
        this.paises = response;
      }
    )
  }
  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.zoom = 10;
    })
  }
  getMapClick(e) {
    console.log(e.coords.lat, e.coords.lng);
  }
  ngOnInit() {
    this.initMap();
  }

}
