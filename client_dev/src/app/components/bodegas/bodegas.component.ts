import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Bodega } from '../../../models/bodega.model';
import { BodegaService } from '../../../services/bodega.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { ProvinciaService } from 'src/services/provincia.service';
import { } from 'googlemaps';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.component.html',
  styleUrls: ['./bodegas.component.scss'],
  providers: [BodegaService, UsuarioService, ProvinciaService]
})
export class BodegasComponent implements OnInit {

  public currPosition;
  public viewedCurrPosition;

  public bodega: Bodega;
  public bodegas: any[];
  public bufferBodegas: any[];
  public viewedBodega;

  public type: string = 'all';
  public searchTitle: string = 'Buscar Algo...';
  public searchText: string;

  public Usuarios: any[];
  public bufferUsuarios: any[];
  public Usuario: any;
  public ph_correcta: boolean;
  public nbod_correcta: boolean;

  public typePerson: string = 'all';
  public searchTitlePersona: string = 'Buscar Algo...';
  public searchTextPersona: string;

  // public Provincia;
  // public Canton;
  // public Provincias: any[];
  // public Cantones: any[] = [];
  // public Parroquias: any[] = [];
  // public BufferCantones: any[];
  // public BufferParroquias: any[];
  
  public paginationDataBodegas = {
    id: 'bodegas_tbl',
    itemsPerPage: 10,
    currentPage: 1
  }

  // public MyAddressMarker: google.maps.Marker;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _BodegaService: BodegaService,
    private _UsuarioService: UsuarioService,
    // private _ProvinciaService: ProvinciaService,
    private datePipe: DatePipe
  ) {
    this.Read();
    this.readUsuarios();
    this.initBodega();
    this.initUsuario();
    // this.LoadLocations();
  }
  ngOnInit() {
    // this.initMap();
  }

  initInfoMap() {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    // const infowindow = new google.maps.InfoWindow();
    const map = new google.maps.Map(
      document.getElementById("MyGoogleMapInfo") as HTMLDivElement,
      {
        zoom: 8,
        center: { lat: -1.482292789730304, lng: -77.99914699292728 },
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
    map.setZoom(15);
    // console.log('çargando marker', (this.viewedCurrPosition));
    directionsRenderer.setMap(map);
    let markers: google.maps.Marker[] = [];
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    let CreatedBy = '';
    let UpdatedBy = '';
    if (this.viewedBodega.Created.By) {
      CreatedBy = 
      "<hr><p><i class='fa fa-save'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Ingresado por: </b> " + this.viewedBodega.Created.By.Persona.FirstName + " " + this.viewedBodega.Created.By.Persona.LastName + " - (" + this.viewedBodega.Created.By.Email + ") <p>"+
      "<p><i class='fa fa-save'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Ingresado El: </b> "+ this.datePipe.transform((parseInt(this.viewedBodega.Created.At) * 1000), 'medium') +" <p>";
    }
    if (this.viewedBodega.Updated.By) {
      UpdatedBy = 
      "<hr><p><i class='fa fa-edit'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Actualizado por: </b> " + this.viewedBodega.Updated.By.Persona.FirstName + " " + this.viewedBodega.Updated.By.Persona.LastName + " - (" + this.viewedBodega.Updated.By.Email + ") <p>"+
      "<p><i class='fa fa-edit'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Actualizado El: </b> "+ this.datePipe.transform((parseInt(this.viewedBodega.Updated.At) * 1000), 'medium') +" <p>";
    }
    const contentString = 
    '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h4 id="firstHeading" class="firstHeading"> <i class="fa fa-industry"></i>&nbsp;'+this.viewedBodega.Name+'</h4>' +
      '<div id="bodyContent" class="p-1">' +
        "<hr><p><i class='fas fa-location-arrow'></i>&nbsp;<b> Dirección: </b>" + this.viewedCurrPosition.formatted_address + '.'+
        "<p><i class='fas fa-map-marked-alt'></i>&nbsp;<b> GPS: </b>" + JSON.stringify(this.viewedCurrPosition.geometry.location) + '.'+
        "<p><i class='fa fa-phone'></i>&nbsp;<b> Teléfono: </b>" + this.viewedBodega.Phone + '.'+
        CreatedBy + 
        UpdatedBy + 
      "</div>" +
    "</div>";
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });
    const marker = new google.maps.Marker({
      map: map,
      position: this.viewedCurrPosition.geometry.location,
    });
    infowindow.open(map, marker);
    marker.addListener("click", () => {
      infowindow.close();
      infowindow.open(map, marker);
    })
    map.setCenter(marker.getPosition() as google.maps.LatLng);
    markers.push(marker);

  }
  initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();

    const map = new google.maps.Map(
      document.getElementById("MyGoogleMap") as HTMLDivElement,
      {
        zoom: 8,
        center: { lat: -1.482292789730304, lng: -77.99914699292728 },
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
    // (document.getElementById("GetRoute") as HTMLElement).addEventListener(
    //   "click",
    //   () => {
    //     this.calculateAndDisplayRoute(directionsService, directionsRenderer);
    //   }
    // );
    // llamado a buscar direccion
    (document.getElementById("GetAddress") as HTMLElement).addEventListener(
      "click",
      () => {
        this.geocodeAddress(geocoder, map, infowindow);
      }
    );
    (document.getElementById("clearInfowidow") as HTMLElement).addEventListener(
      "click",
      () => {
        infowindow.close();
      }
    );
    let markers: google.maps.Marker[] = [];
    if (this.currPosition) {
      map.setZoom(15);

      const marker = new google.maps.Marker({
        map: map,
        position: this.currPosition.geometry.location,
      });
      map.setCenter(marker.getPosition() as google.maps.LatLng);
      markers.push(marker)
    }
    (document.getElementById("toEdit") as HTMLElement).addEventListener(
      "click",
      () => {
        map.setZoom(8);

        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        if (this.currPosition) {
          map.setZoom(15);

          const marker = new google.maps.Marker({
            map: map,
            position: this.currPosition.geometry.location,
          });
          map.setCenter(marker.getPosition() as google.maps.LatLng);
          markers.push(marker)
        }
      }
    );
    (document.getElementById("setCurrentPosition") as HTMLElement).addEventListener(
      "click",
      () => {
        // this.MyAddressMarker.setMap = null;
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        const marker = new google.maps.Marker({
          map: map,
          position: this.currPosition.geometry.location,
        });
        map.setCenter(marker.getPosition() as google.maps.LatLng);
        markers.push(marker)
        this.bodega.GPS = JSON.stringify(this.currPosition);
        this.bodega.Address = this.currPosition.formatted_address;
      }
    )
    // click en el mapa
    map.addListener("click", (e) => {
      // this.placeMarkerAndPanTo(e.latLng, map, infowindow);
      // console.log(e);

      this.geocodeLatLng(e.latLng, geocoder, map, infowindow);
    })
  }
  JSONParse(str): any {
    const Object = JSON.parse(str);
    // console.log(Object);
    
    return Object
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
        // console.log(results);
        this.currPosition = results[0];
        map.setCenter(results[0].geometry.location);
        infowindow.setPosition(results[0].geometry.location);
        infowindow.setContent(results[0].formatted_address + ' - ' + JSON.stringify(results[0].geometry.location));
        // console.log(results);
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
            infowindow.setContent(results[0].formatted_address + ' - ' + JSON.stringify(input));
            // console.log(results);
            this.currPosition = results[0];
            this.currPosition.geometry.location = input;
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
  // LoadLocations() {
  //   this._ProvinciaService.ReadOnlyProv().subscribe(
  //     response => {
  //       this.Provincias = response.Provincias;
  //       this.BufferCantones = response.Cantones;
  //       this.BufferParroquias = response.Parroquias;
  //     }
  //   )
  // }
  // LoadCantones() {
  //   this.Cantones = [];
  //   this.Parroquias = [];
  //   this.bodega.City = '';
  //   for (const canton of this.BufferCantones) {
  //     if (canton.Provincia == this.Provincia) this.Cantones.push(canton);
  //   }
  //   this.Canton = '';
  //   if (this.Cantones.length == 1) {
  //     this.Canton = this.Cantones[0]._id;
  //     this.LoadParroquias();

  //   }
  // }
  // LoadParroquias() {
  //   this.Parroquias = [];
  //   for (const parroquia of this.BufferParroquias) {
  //     if (parroquia.Canton == this.Canton) this.Parroquias.push(parroquia);
  //   }
  //   if (this.Parroquias.length == 1) this.bodega.City = this.Parroquias[0]._id;
  // }
  initUsuario() {
    // console.log('deleting Usuario');
    this.Usuario = new Usuario(
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      false,
      {
        Placa: '',
        Tipo: ''
      },
      true,
      {
        By: null,
        At: null
      },
      {
        By: null,
        At: null
      }
    )
  }
  readUsuarios() {
    this._UsuarioService.Read().subscribe(
      response => {
        this.Usuarios = response.Usuarios;
        // console.log(this.Usuarios);
        this.bufferUsuarios = this.Usuarios;
      }, error => {
        console.error(error as any);
      }
    )
  }
  setUsuario(Usuario) {
    this.Usuario = Usuario;
    this.bodega.By = Usuario._id;
  }
  infoBodega(bodega) {
    this.viewedBodega = bodega;
    this.viewedCurrPosition = JSON.parse(bodega.GPS);
    setTimeout(() => {
      this.initInfoMap();
    }, 500);
  }
  define() {
    this.bodegas = [];
    if (this.searchText !== '' && this.searchText != undefined) {
      // console.error('dentro de busqueda');

      for (const item of this.bufferBodegas) {
        const nombre = item.Name.toLowerCase().replace(/[^\w]/gi, '');
        let direccion = item.Address.toLowerCase().replace(/[^\w]/gi, '');
        let myAddress = this.JSONParse(item.GPS);

        if (myAddress && myAddress.address_components.length >=1 ) {
          direccion = direccion + myAddress.address_components[0].long_name;
          direccion = direccion + myAddress.address_components[1].long_name;
          direccion = direccion + myAddress.address_components[2].long_name;
          direccion = direccion + myAddress.address_components[3].long_name;
          if (myAddress.address_components[4]) direccion = direccion + myAddress.address_components[4].long_name;
          if (myAddress.address_components[5]) direccion = direccion + myAddress.address_components[5].long_name;
          if (myAddress.address_components[6]) direccion = direccion + myAddress.address_components[6].long_name;
        }
        let Usuario = 'sinUsuarioacargo';
        if (item.By) Usuario = item.By.Account.toLowerCase().replace(/[^\w]/gi, '') + item.By.Email.toLowerCase().replace(/[^\w]/gi, '');
        const telefono = item.Phone.replace(/[^\w]/gi, '');
        // const ciudad = item.City.toLowerCase().replace(/[^\w]/gi, '');
        let termino = '';
        switch (this.type) {
          case 'name':
            this.searchTitle = 'Buscar Nombres...';
            termino = nombre;
            break;
          case 'address':
            this.searchTitle = 'Buscar Apellidos...';
            termino = direccion;
            break;
          case 'phone':
            this.searchTitle = 'Buscar Teléfono...';
            termino = telefono;
            break;
          case 'charge':
            this.searchTitle = 'Buscar por Usuario a Cargo...';
            termino = Usuario;
            break;
          default:
            this.searchTitle = 'Buscar Algo...';
            termino = nombre + direccion + telefono + Usuario;
            break;
        }
        if (termino.indexOf(this.searchText.toLowerCase().replace(/' '/g, '')) > -1) {
          this.bodegas.push(item);
        }
      }
    } else {
      this.bodegas = this.bufferBodegas;
      switch (this.type) {
        case 'name':
          this.searchTitle = 'Buscar Nombres...';
          break;
        case 'lastname':
          this.searchTitle = 'Buscar Apellidos...';
          break;
        case 'phone':
          this.searchTitle = 'Buscar Teléfono...';
          break;
        case 'address':
          this.searchTitle = 'Buscar Dirección...';
          break;
        case 'charge':
          this.searchTitle = 'Buscar por Usuario a Cargo...';
          break;
        default:
          this.searchTitle = 'Buscar Algo...';
          break;
      }
    }
  }
  defineUsuario() {
    this.Usuarios = [];
    if (this.searchText !== '' && this.searchText != undefined) {
      // console.error('dentro de busqueda');

      for (const item of this.bufferUsuarios) {
        const correo = item.Email.toLowerCase().replace(/[^\w]/gi, '');
        const nombre = item.Persona.FirstName.toLowerCase().replace(/[^\w]/gi, '');
        const apellido = item.Persona.LastName.toLowerCase().replace(/[^\w]/gi, '');
        const cedula = item.Persona.Ci.toLowerCase().replace(/[^\w]/gi, '');
        const telefono = item.Persona.Phone.replace(/[^\w]/gi, '');
        let termino = '';
        switch (this.type) {
          case 'name':
            this.searchTitle = 'Buscar Nombres...';
            termino = nombre;
            break;
          case 'lastname':
            this.searchTitle = 'Buscar Apellidos...';
            termino = apellido;
            break;
          case 'phone':
            this.searchTitle = 'Buscar Teléfono...';
            termino = telefono;
            break;
          case 'mail':
            this.searchTitle = 'Buscar Correo Electrónico...';
            termino = correo;
            break;
          case 'ci':
            this.searchTitle = 'Buscar Cedula...';
            termino = cedula;
            break;
          default:
            this.searchTitle = 'Buscar Algo...';
            termino = nombre + correo + telefono + apellido + cedula;
            break;
        }
        if (termino.indexOf(this.searchText.toLowerCase().replace(/' '/g, '')) > -1) {
          this.Usuarios.push(item);
        }
      }
    } else {
      this.Usuarios = this.bufferUsuarios;
      switch (this.type) {
        case 'name':
          this.searchTitle = 'Buscar Nombres...';
          break;
        case 'lastname':
          this.searchTitle = 'Buscar Apellidos...';
          break;
        case 'phone':
          this.searchTitle = 'Buscar Teléfono...';
          break;
        case 'mail':
          this.searchTitle = 'Buscar Correo Electrónico...';
          break;
        case 'city':
          this.searchTitle = 'Buscar Ciudad...';
          break;
        case 'address':
          this.searchTitle = 'Buscar Dirección...';
          break;
        default:
          this.searchTitle = 'Buscar Algo...';
          break;
      }
    }
  }

  initBodega() {
    this.bodega = new Bodega(
      '',
      '',
      '',
      '',
      '',
      // '',
      '',
      '',
      true);
    this.initUsuario();
    // this.Canton = '';
    // this.Provincia = '';
    // this.LoadLocations();
    this.Read();
  }

  onSubmit() {
    (this.bodega._id != null && this.bodega._id !== '') ? this.Update() : this.Create();

  }
  Create() {
    // console.log('on subimt');
    this._BodegaService.Create(this.bodega).subscribe(
      response => {
        // console.warn( response as any );
        if (response.Bodega && response.Bodega) {
          // console.warn( response as any );

          // this.Usuario.Bodega = response.Bodega._id;
          // this._UsuarioService.Update(this.Usuario).subscribe(
          //   response => {
          //     this.initBodega();
          //     this.Read();
          //   }
          // )
          this.initBodega();
          this.Read();
        }
      },
      error => {
        console.warn(error as any);
      }
    );
  }

  Read() {
    this._BodegaService.Read().subscribe(
      response => {
        // console.log( response as any );
        const temp = JSON.stringify(response.Bodegas);
        this.bodegas = JSON.parse(temp);
        this.bufferBodegas = this.bodegas;
      },
      error => {
        console.error(error as any);
      }
    );
  }

  Update() {
    this._BodegaService.Update(this.bodega).subscribe(
      response => {
        // console.log( response as any );
        // this.Usuario.Bodega = response.Bodega._id;
        // this._UsuarioService.Update(this.Usuario).subscribe(
        //   response => {
        //     this.initBodega();
        //     this.Read();
        //   }
        // )
        this.initBodega();
        this.Read();
      },
      error => {
        console.error(error as any);
      }
    );
  }

  Delete(object) {
    // console.log(object);
    this._BodegaService.Delete(object).subscribe(
      response => {
        this.Read();
        // this.initBodega();
        // console.log( response as any );
      },
      error => {
        console.error(error as any);
      }
    );
  }
  telfUnica(Phone) {
    this.ph_correcta = true;
    if (this.bodega._id == '') {
      for (const bodegas of this.bodegas) {
        const phoneBD = bodegas.Phone;
        // console.log(phoneBD);
        if (phoneBD == Phone) {
          this.ph_correcta = false;
        }
      }
    }
  }
  bodUnica(Name) {
    this.nbod_correcta = true;
    if (this.bodega._id == '') {
      for (const bodegas of this.bodegas) {
        const bodBD = bodegas.Name;
        // console.log(phoneBD);
        if (bodBD == Name) {
          this.nbod_correcta = false;
        }
      }
    }
  }

  toUpdate(bodega) {
    const temp = JSON.stringify(bodega)
    this.bodega = JSON.parse(temp);
    this.currPosition = JSON.parse(this.bodega.GPS)
    // this.initMap();
    // console.log(bodega);
    if (bodega.By) {
      this.Usuario = bodega.By;
      this.bodega.By = bodega.By._id;
      // this.Provincia = bodega.City.Canton.Provincia._id;
      // this.LoadCantones();
      // this.Canton = bodega.City.Canton._id;
      // this.LoadParroquias();
      // this.bodega.City = bodega.City._id;
    } else {
      this.initUsuario();
      this.bodega.By = '';
    }
  }

  Validating() {
    let check: boolean;
    (this.bodega.Name === '' || this.bodega.By === ''  || this.bodega.Address === '' || this.bodega.Phone === '') ? check = true : check = false;
    return check;
  }
}
