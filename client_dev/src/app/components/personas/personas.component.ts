import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from '../../../models/persona.model';
import { PersonaService } from '../../../services/persona.service';
import { ProvinciaService } from '../../../services/provincia.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import {Location} from '@angular/common';
import { DatePipe } from '@angular/common';
import { } from 'googlemaps';
import { Form } from '@angular/forms';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PersonaService, ProvinciaService]
})
export class PersonasComponent implements OnInit {
  public currPosition;
  public viewedCurrPosition;

  public role: string;
  public cliente: Persona;
  public clientes: any[];
  public viewedCliente: any;
  public bufferCliente: any[];
  public ci_correcta: boolean;
  public ph_correcta: boolean;
  public no: boolean;
  public ci_unica: boolean;
  public cedulas: any[];

  // public Provincias: any[];
  // public Cantones: any[] = [];
  // public Parroquias: any[] = [];
  // public BufferCantones: any[];
  // public BufferParroquias: any[];

  // public Provincia: string = '';
  // public Canton: string = '';

  public type: string = 'all';
  public searchTitle: string = 'Buscar Algo...';
  public searchText: string;

  public options: GlobalConfig;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _PersonaService: PersonaService,
    public _ToasterService: ToastrService,
    // private _ProvinciaService: ProvinciaService,
    private location: Location,
    private datePipe: DatePipe
  ) {
    const usuario = JSON.parse(localStorage.getItem('Identity'));
    if (usuario && usuario.Role) this.role = usuario.Role;
    if (this.role == 'Encargado de Bodega' || this.role == 'Encargado de Repartidores' || this.role == 'Motorizado') {
      this.location.back();
    }
    // this.options = this._ToasterService.toastrConfig;
    this.Read();
    this.initCliente();
    // this.LoadLocations();
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
    if (this.viewedCliente.Created.By) {
      CreatedBy = 
      "<hr><p><i class='fa fa-save'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Ingresado por: </b> " + this.viewedCliente.Created.By.Persona.FirstName + " " + this.viewedCliente.Created.By.Persona.LastName + " - (" + this.viewedCliente.Created.By.Email + ") <p>"+
      "<p><i class='fa fa-save'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Ingresado El: </b> "+ this.datePipe.transform((parseInt(this.viewedCliente.Created.At) * 1000), 'medium') +" <p>";
    }
    if (this.viewedCliente.Updated.By) {
      UpdatedBy = 
      "<hr><p><i class='fa fa-edit'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Actualizado por: </b> " + this.viewedCliente.Updated.By.Persona.FirstName + " " + this.viewedCliente.Updated.By.Persona.LastName + " - (" + this.viewedCliente.Updated.By.Email + ") <p>"+
      "<p><i class='fa fa-edit'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Actualizado El: </b> "+ this.datePipe.transform((parseInt(this.viewedCliente.Updated.At) * 1000), 'medium') +" <p>";
    }
    const contentString = 
    '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h4 id="firstHeading" class="firstHeading"> <i class="fa fa-user-id"></i>&nbsp;'+this.viewedCliente.FirstName + ' ' + this.viewedCliente.LastName+'</h4>' +
      '<div id="bodyContent"class="p-1">' +
        "<hr><p><i class='fa fa-id-badge'></i>&nbsp;<b> Cédula: </b>" + this.viewedCliente.Ci + '.'+
        "<p><i class='fa fa-phone'></i>&nbsp;<b> Teléfono: </b>" + this.viewedCliente.Phone + '.'+
        "<hr><p><i class='fas fa-location-arrow'></i>&nbsp;<b> Dirección: </b>" + this.viewedCurrPosition.formatted_address + '.'+
        "<p><i class='fas fa-map-marked-alt'></i>&nbsp;<b> GPS: </b>" + JSON.stringify(this.viewedCurrPosition.geometry.location) + '.'+
        // "<p><i class='fa fa-envelope'></i>&nbsp;<b> Correo Electronico: </b>" + this.viewedCliente.Email + '.'+
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
//  console.log('cargando mapa');
 
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
        this.cliente.GPS = JSON.stringify(this.currPosition);
        this.cliente.Address = this.currPosition.formatted_address;
      }
    )
    // click en el mapa
    map.addListener("click", (e) => {
      // this.placeMarkerAndPanTo(e.latLng, map, infowindow);
      console.log(e);

      this.geocodeLatLng(e.latLng, geocoder, map, infowindow);
    })
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
        infowindow.setContent(results[0].formatted_address + ' - ' + JSON.stringify(results[0].geometry.location));
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
            console.log(results);
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
  JSONParse(str): any {
    const Object = JSON.parse(str);
    return Object
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
  //   // this.cliente.City = '';
  //   for (const canton of this.BufferCantones) {
  //     if (canton.Provincia == this.Provincia) this.Cantones.push(canton);
  //   }
  //   this.Canton = '';
  //   if (this.Cantones.length == 1){
  //     this.Canton = this.Cantones[0]._id;
  //     this.LoadParroquias();

  //   }
  // }
  // LoadParroquias() {
  //   this.Parroquias = [];
  //   for (const parroquia of this.BufferParroquias) {
  //     if (parroquia.Canton == this.Canton) this.Parroquias.push(parroquia);
  //   }
  //   if (this.Parroquias.length == 1) this.cliente.City = this.Parroquias[0]._id;
  // }
  define() {
    this.clientes = [];
    // console.log(this.searchText);

    if (this.searchText !== '' && this.searchText != undefined) {
      for (const item of this.bufferCliente) {
        const nombre = item.FirstName.toLowerCase().replace(/'[ ]'/g, '');
        const apellido = item.LastName.toLowerCase().replace(/'[ ]'/g, '');
        const telefono = item.Phone.replace(/'[ ]'/g, '');
        const cedula = item.Ci.replace(/'[ ]'/g, '');
        // let ciudad = item.City.Name.toLowerCase().replace(/'[ ]'/g, '');
        let direccion = item.Address.toLowerCase().replace(/'[ ]'/g, '');
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

        let termino = '';
        switch (this.type) {
          case 'name':
            this.searchTitle = 'Buscar Nombres...';
            termino = nombre;
            break;
          case 'ci':
            this.searchTitle = 'Buscar Cédula...';
            termino = cedula;
            break;
          case 'lastname':
            this.searchTitle = 'Buscar Apellidos...';
            termino = apellido;
            break;
          case 'phone':
            this.searchTitle = 'Buscar Teléfono...';
            termino = telefono;
            break;
          case 'address':
            this.searchTitle = 'Buscar Dirección...';
            termino = direccion;
            break;
          default:
            this.searchTitle = 'Buscar Algo...';
            termino = nombre + apellido + telefono + direccion + cedula;
            break;
        }
        if (termino.indexOf(this.searchText.toLowerCase().replace(/' '/g, '')) > -1) {
          this.clientes.push(item);
        }
      }
    } else {
      this.clientes = this.bufferCliente;
      switch (this.type) {
        case 'name':
          this.searchTitle = 'Buscar Nombres...';
          break;
        case 'lastname':
          this.searchTitle = 'Buscar Apellidos...';
          break;
        case 'ci':
          this.searchTitle = 'Buscar Cédula...';
          break;
        case 'phone':
          this.searchTitle = 'Buscar Teléfono...';
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
  infoCliente(cliente) {
    this.viewedCliente = cliente;
    this.viewedCurrPosition = JSON.parse(cliente.GPS);
    setTimeout(() => {
      this.initInfoMap();
      // console.log('launching info map');
      
    }, 500);
  }
  initCliente() {
    this.cliente = new Persona(
      '',
      '',
      '',
      '',
      '',
      '',
      // '',
      '',
      true,
      false,
      false,
      null,
      null);
    this.Read();
  }
  
  reset(): void {
    this.reset();
  }
  Read() {
    this._PersonaService.Read().subscribe(
      response => {
        const temp = JSON.stringify(response.Personas);
        this.clientes = JSON.parse(temp);
        this.bufferCliente = this.clientes;
        // console.log(this.clientes);

      },
      error => {
        console.error(error as any);
      }
    );
  }


  onSubmit() {
    console.log(this.cliente);
    
    (this.cliente._id != null && this.cliente._id !== '') ? this.Update() : this.Create();

  }
  Create() {
    this._PersonaService.Create(this.cliente).subscribe(
      response => {
        if (response) {
          this.Read();
          this.initCliente();
        }
      },
      error => {
        console.warn(error as any);
      }
    );
  }
  Update() {
    this._PersonaService.Update(this.cliente).subscribe(
      response => {
        this.Read();
        this.initCliente();
      },
      error => {
        console.error(error as any);
      }
    );
  }

  Delete(persona) {
    this._PersonaService.Delete(persona).subscribe(
      response => {
        this.Read();
      },
      error => {
        console.error(error as any);
      }
    );
  }
  cedulaUnica(Ci) {
    this.ci_unica = true;
    if (Ci.length >= 1) {
      if (this.cliente._id == '') {
        for (const clientes of this.clientes) {
          const cedulaBD = clientes.Ci;
          if (cedulaBD == Ci) {
            this.ci_unica = false;
          }
        }
      }
    }
  }
  telfUnica(Phone) {
    this.ph_correcta = true;
    if (this.cliente._id == '') {
      for (const clientes of this.clientes) {
        const phoneBD = clientes.Phone;
        // console.log(phoneBD);
        if (phoneBD == Phone) {
          this.ph_correcta = false;
        }
      }
    }
  }
  comprobar_ci(Ci) {
    if (Ci.length >= 1) {
      this.ci_correcta = false;
      this.no = true;
      if (Ci.length === 10) {
        let cedulaCache: any[];
        let sumaPares = 0;
        let sumaImpares = 0;
        let sumaTotal: number;
        let verificador: number;
        let comparador = 10;
        cedulaCache = Ci.split('');
        // console.log(cedulaCache);
        for (let i = 0; i < 9; i = i + 2) {
          let impar = cedulaCache[i];
          impar = impar * 2;
          if (impar >= 10) {
            impar = impar - 9;
          }
          sumaImpares = sumaImpares + impar;
        }
        for (let i = 1; i < 8; i = i + 2) {
          const par = cedulaCache[i];
          sumaPares = sumaPares + parseInt(par, 0);
        }
        // console.log(sumaPares);
        sumaTotal = sumaPares + sumaImpares;
        while (comparador < sumaTotal) {
          comparador = comparador + 10;
        }
        if (comparador - sumaTotal <= 9) {
          verificador = comparador - sumaTotal;
          // console.log(verificador, ' = ', cedulaCache[9]);
          if (verificador == cedulaCache[9]) {
            this.ci_correcta = true;
          } else {
            this.ci_correcta = false;
          }
        }
      }
    } else {
      this.no = false;
      this.ci_correcta = false;
    }
  }
  toUpdate(cliente) {
    const temp = JSON.stringify(cliente);
    this.cliente = JSON.parse(temp);
    this.currPosition = JSON.parse(this.cliente.GPS)
    // this.Provincia = JSON.parse(temp).City.Canton.Provincia._id;
    // this.LoadCantones();
    // this.Canton = JSON.parse(temp).City.Canton._id;
    // this.LoadParroquias();
    // this.cliente.City = JSON.parse(temp).City._id;
    // this.infoCliente();
  }
  public telefonoRepetido: boolean;
  uniqueValues(): boolean {
    let check = true;
    let count = 0;
    for (const client of this.clientes) {
      if (this.cliente.Phone == client.Phone) {
        // console.log(count, 'phones: ', this.cliente.Phone, '==', client.Phone);
        count++;
      }
      if (this.cliente.Ci != '' && this.cliente.Ci == client.Ci) count++;
    }
    (count >= 1) ? check = false : check = true;
    return check;
  }
  Validating() {
    let check: boolean;
    const checkFirstName = this.checkLenght(this.cliente.FirstName, 3, 25, true, 'names');
    const checkLastName = this.checkLenght(this.cliente.LastName, 3, 25, false, 'names');
    const checkCi = this.checkLenght(this.cliente.Ci, 10, 13, false, 'number');
    const checkPhone = this.checkLenght(this.cliente.Phone, 9, 13, true, 'number');
    // const checkCity = this.checkLenght(this.cliente.City, 3, 25, true, 'all');
    const checkAddress = this.checkLenght(this.cliente.Address, 3, 45, false, 'all');
    (checkFirstName && checkLastName && checkCi && checkPhone && checkAddress) ? check = false : check = true;

    return check;
  }
  checkLenght(value: string, min: number, max: number, required: boolean, type: string): boolean {
    let check = true;

    if (required == true || value != '') {
      if (value.length >= min && value.length <= max) {

      } else {
        check = false;
      }
    }
    return check;
  }
  ngOnInit() {
    // this.initMap();
  }

}
