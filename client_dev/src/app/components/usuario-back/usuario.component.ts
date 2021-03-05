import { Component, OnInit, PipeTransform, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PersonaService } from '../../../services/persona.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
// import { RoleService } from '../../.././../services/roles.service';
import { Persona } from '../../../models/persona.model';
import { PasswordValidators, EmailValidators, CreditCardValidators, UniversalValidators } from 'ngx-validators';
// import { ProvinciaService } from 'src/services/provincia.service';
import { EmpresaService } from '../../../services/empresa.service';
import { BodegaService } from '../../../services/bodega.service';
import { Location } from '@angular/common';

import { DatePipe } from '@angular/common';
import { } from 'googlemaps';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PersonaService, UsuarioService, EmpresaService, BodegaService]

})
export class UsuarioComponent implements OnInit {
  public role: string;

  public currPosition;
  public viewedCurrPosition;

  public steps: any[];
  public accountForm: FormGroup;
  public personalForm: FormGroup;
  public paymentForm: FormGroup;
  public details: any = {};
  public showConfirm: boolean;
  public confirmed: boolean;

  public isPrev: boolean = false;

  public NewPersona;
  public Personas: any[];
  public BufferPersonas: any[];

  public Usuario: Usuario;
  public ViewedUsuario;
  public SelectedPersona;

  public Usuarios: any[];
  public BufferUsuarios: any[];

  public Password: string = '';
  public ConfirmPassword: string = '';

  public type: string = 'all';
  public searchTitle: string = 'Buscar Algo...';
  public searchText: string;

  public typePer: string = 'all';
  public searchTitlePer: string = 'Buscar Algo...';
  public searchTextPer: string;

  public Empresas: any[] = [];
  public BufferEmpresas: any[] = [];

  public currEmpresa;

  public Bodegas: any[] = [];
  public BufferBodegas: any[] = [];

  public currBodega;

  constructor(
    private formBuilder: FormBuilder,
    private _usuarioService: UsuarioService,
    private _personaService: PersonaService,
    // private _ProvinciaService: ProvinciaService,
    private _empresaService: EmpresaService,
    private _bodegaService: BodegaService,
    private location: Location,
    private datePipe: DatePipe
  ) {
    const usuario = JSON.parse(localStorage.getItem('Identity'));
    if (usuario && usuario.Role) this.role = usuario.Role;
    if (this.role == 'Encargado de Bodega' || this.role == 'Encargado de Repartidores' || this.role == 'Motorizado' || this.role == 'Secretario') {
      this.location.back();
    }
    this.loadUsuarios();
    this.initSteps();
    this.initUser();
    // this.LoadLocations();
    this.initNewPersona();
    this.loadEmpresas();
    this.LoadBodegas();
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
    if (this.ViewedUsuario.Created.By) {
      CreatedBy = 
      "<hr><p><i class='fa fa-save'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Ingresado por: </b> " + this.ViewedUsuario.Created.By.Persona.FirstName + " " + this.ViewedUsuario.Created.By.Persona.LastName + " - (" + this.ViewedUsuario.Created.By.Email + ") <p>"+
      "<p><i class='fa fa-save'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Ingresado El: </b> "+ this.datePipe.transform((parseInt(this.ViewedUsuario.Created.At) * 1000), 'medium') +" <p>";
    } else if (this.ViewedUsuario.Created.At && !this.ViewedUsuario.Created.By) {
      CreatedBy = 
      "<hr><p><i class='fa fa-save'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Ingresado por: </b> Creado por el Sistema (Administrador de Sistemas) <p>"+
      "<p><i class='fa fa-save'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Ingresado El: </b> "+ this.datePipe.transform((parseInt(this.ViewedUsuario.Created.At) * 1000), 'medium') +" <p>";
    }
    if (this.ViewedUsuario.Updated.By) {
      UpdatedBy = 
      "<hr><p><i class='fa fa-edit'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Actualizado por: </b> " + this.ViewedUsuario.Updated.By.Persona.FirstName + " " + this.ViewedUsuario.Updated.By.Persona.LastName + " - (" + this.ViewedUsuario.Updated.By.Email + ") <p>"+
      "<p><i class='fa fa-edit'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Actualizado El: </b> "+ this.datePipe.transform((parseInt(this.ViewedUsuario.Updated.At) * 1000), 'medium') +" <p>";
    }
    const contentString = 
    '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h4 id="firstHeading" class="firstHeading"> <i class="fa fa-user-id"></i>&nbsp;'+this.ViewedUsuario.Persona.FirstName + ' ' + this.ViewedUsuario.Persona.LastName+'</h4>' +
      '<div id="bodyContent" class="p-1">' +
        "<hr><p><i class='fa fa-id-badge'></i>&nbsp;<b> Cédula: </b>" + this.ViewedUsuario.Persona.Ci + '.'+
        "<p><i class='fa fa-envelope'></i>&nbsp;<b> Correo Electrónico: </b>" + this.ViewedUsuario.Email + '.'+
        "<p><i class='fa fa-phone'></i>&nbsp;<b> Teléfono: </b>" + this.ViewedUsuario.Persona.Phone + '.'+
        "<hr><p><i class='fas fa-location-arrow'></i>&nbsp;<b> Dirección: </b>" + this.viewedCurrPosition.formatted_address + '.'+
        "<p><i class='fas fa-map-marked-alt'></i>&nbsp;<b> GPS: </b>" + JSON.stringify(this.viewedCurrPosition.geometry.location) + '.'+
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
        this.NewPersona.GPS = JSON.stringify(this.currPosition);
        this.NewPersona.Address = this.currPosition.formatted_address;
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
  LoadBodegas() {
    this._bodegaService.Read().subscribe(
      response => {
        this.BufferBodegas = response.Bodegas;
        this.Bodegas = response.Bodegas;
      }
    )
  }
  public bodegaFilter: string = 'canton';
  loadBodegasPerFilter() {
    this.Bodegas = [];
    if (this.bodegaFilter == 'todo') {
      this.Bodegas = this.BufferBodegas;
    } else {
      for (const bodega of this.BufferBodegas) {
        switch (this.bodegaFilter) {
          case 'parroquia':
            if (bodega.City._id == this.SelectedPersona.City._id) this.Bodegas.push(bodega)
            break;
          case 'canton':
            if (bodega.City.Canton._id == this.SelectedPersona.City.Canton._id) this.Bodegas.push(bodega)
            break;
          case 'provincia':
            if (bodega.City.Canton.Provincia._id == this.SelectedPersona.City.Canton.Provincia._id) this.Bodegas.push(bodega)
            break;
        }
      }
    }
  }
  loadEmpresas() {
    this._empresaService.Read().subscribe(
      response => {
        this.Empresas = response.Empresas;
        this.BufferEmpresas = response.Empresas;
      }
    )
  }
  loadPersonas() {
    this._personaService.Read().subscribe(
      response => {
        this.Personas = [];
        let temp = response.Personas;
        for (const persona of temp) {
          if (!persona.HasAccount) {
            this.Personas.push(persona);
          }
        }
        this.BufferPersonas = this.Personas;
      }
    )
  }
  selectPersona(persona) {
    this.SelectedPersona = persona;
    this.SelectedPersona.HasAccount = true;
    this.Usuario.Persona = persona._id;
    // console.log(persona.HasAccount)
  }
  cleanSelectedPersona() {
    if (this.isPrev) this.SelectedPersona = undefined;
  }
  loadUsuarios() {
    this._usuarioService.Read().subscribe(
      response => {
        // console.log(response);
        this.Usuarios = response.Usuarios;
        this.BufferUsuarios = this.Usuarios;
        this.loadPersonas();
      }
    )
  }
  disableUsuario(usuario) {
    (usuario.Active) ? usuario.Active = false : usuario.Active = true;
    this._usuarioService.Update(usuario).subscribe(
      response => {
        // console.log(response);
        this.loadUsuarios();
      }
    )
  }
  initUser() {
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
  initSteps() {
    this.steps = [
      { name: 'Detalles', icon: 'fa-user', active: true, valid: false, hasError: false },
      { name: 'Cuenta', icon: 'fa-id-badge', active: false, valid: false, hasError: false },
    ]
  }
  public next() {

    if (this.steps[this.steps.length - 1].active)
      return false;

    this.steps.some(function (step, index, steps) {
      if (index < steps.length - 1) {
        if (step.active) {
          if (step.name == 'Cuenta') {
            // console.log('on next');
            // if (accountForm.valid) {
            step.active = false;
            step.valid = true;
            steps[index + 1].active = true;
            return true;
            // }
            // else {
            // step.hasError = true;
            // }
          }
          if (step.name == 'Detalles') {
            // if (personalForm.valid) {
            step.active = false;
            step.valid = true;
            steps[index + 1].active = true;
            return true;
            // }
            // else {
            // step.hasError = true;
            // }
          }
        }
      }
    });
  }

  public prev() {
    if (this.steps[0].active)
      return false;
    this.steps.some(function (step, index, steps) {
      if (index != 0) {
        if (step.active) {
          step.active = false;
          steps[index - 1].active = true;
          return true;
        }
      }
    });
  }

  public confirm() {
    this.steps.forEach(step => step.valid = true);
    this.confirmed = true;
  }


  checkRole() {
    (this.Usuario.Role == 'Motorizado') ? this.Usuario.Repartidor = true : this.Usuario.Repartidor = false;
  }


  /**
   * Busqueda de Persona
   */

  defineUser() {
    this.Usuarios = [];
    // console.log(this.BufferUsuarios);

    if (this.searchText !== '' && this.searchText != undefined) {
      for (const item of this.BufferUsuarios) {
        const nombre = item.Persona.FirstName.toLowerCase().replace(/[^\w]/gi, '');
        const apellido = item.Persona.LastName.toLowerCase().replace(/[^\w]/gi, '');
        const telefono = item.Persona.Phone.replace(/[^\w]/gi, '');
        const cedula = item.Persona.Ci.replace(/[^\w]/gi, '');

        const rol = item.Role.toLowerCase().replace(/[^\w]/gi, '');
        const mail = item.Email.toLowerCase().replace(/[^\w]/gi, '');
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
          case 'mail':
            this.searchTitle = 'Buscar Correo Electrónico...';
            termino = mail;
            break;
          case 'role':
            this.searchTitle = 'Buscar Rol de Usuario...';
            termino = rol;
            break;
          default:
            this.searchTitle = 'Buscar Algo...';
            termino = nombre + apellido + telefono + direccion + cedula + mail + rol;
            break;
        }
        if (termino.indexOf(this.searchText.toLowerCase().replace(/' '/g, '')) > -1) {
          this.Usuarios.push(item);
        }
      }
    } else {
      this.Usuarios = this.BufferUsuarios;
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
        case 'city':
          this.searchTitle = 'Buscar Ciudad...';
          break;
        case 'address':
          this.searchTitle = 'Buscar Dirección...';
          break;
        case 'mail':
          this.searchTitle = 'Buscar Correo Electrónico...';
          break;
        case 'role':
          this.searchTitle = 'Buscar Rol de Usuario...';
          break;
        default:
          this.searchTitle = 'Buscar Algo...';
          break;
      }
    }

  }
  JSONParse(str): any {
    const Object = JSON.parse(str);
    return Object
  }
  definePer() {
    this.Personas = [];
    // console.log(this.BufferPersonas);

    if (this.searchTextPer !== '' && this.searchTextPer != undefined) {
      for (const item of this.BufferPersonas) {
        const nombre = item.FirstName.toLowerCase().replace(/[^\w]/gi, '');
        const apellido = item.LastName.toLowerCase().replace(/[^\w]/gi, '');
        const telefono = item.Phone.replace(/[^\w]/gi, '');
        const cedula = item.Ci.replace(/[^\w]/gi, '');
        let ciudad = item.City.Name.toLowerCase().replace(/[^\w]/gi, '');
        let direccion = item.Address.toLowerCase().replace(/[^\w]/gi, '');
        direccion = direccion + item.City.Name.toLowerCase().replace(/[^\w]/gi, '');
        direccion = direccion + item.City.Canton.Name.toLowerCase().replace(/[^\w]/gi, '');
        direccion = direccion + item.City.Canton.Provincia.Name.toLowerCase().replace(/[^\w]/gi, '');
        let termino = '';
        switch (this.typePer) {
          case 'name':
            this.searchTitlePer = 'Buscar Nombres...';
            termino = nombre;
            break;
          case 'ci':
            this.searchTitlePer = 'Buscar Cédula...';
            termino = cedula;
            break;
          case 'lastname':
            this.searchTitlePer = 'Buscar Apellidos...';
            termino = apellido;
            break;
          case 'phone':
            this.searchTitlePer = 'Buscar Teléfono...';
            termino = telefono;
            break;
          case 'city':
            this.searchTitlePer = 'Buscar Ciudad...';
            termino = ciudad;
            break;
          case 'address':
            this.searchTitlePer = 'Buscar Dirección...';
            termino = direccion;
            break;
          default:
            this.searchTitlePer = 'Buscar Algo...';
            termino = nombre + apellido + telefono + direccion + cedula;
            break;
        }
        if (termino.indexOf(this.searchTextPer.toLowerCase().replace(/' '/g, '')) > -1) {
          this.Personas.push(item);
        }
      }
    } else {
      this.Personas = this.BufferPersonas;
      switch (this.typePer) {
        case 'name':
          this.searchTitlePer = 'Buscar Nombres...';
          break;
        case 'lastname':
          this.searchTitlePer = 'Buscar Apellidos...';
          break;
        case 'ci':
          this.searchTitlePer = 'Buscar Cédula...';
          break;
        case 'phone':
          this.searchTitlePer = 'Buscar Teléfono...';
          break;
        case 'city':
          this.searchTitlePer = 'Buscar Ciudad...';
          break;
        case 'address':
          this.searchTitlePer = 'Buscar Dirección...';
          break;
        default:
          this.searchTitlePer = 'Buscar Algo...';
          break;
      }
    }

  }


  /**
   * Ingreso de Persona
   */

  public ci_unica: boolean;
  public ci_correcta: boolean;
  public ph_correcta: boolean;
  public no: boolean;

  // public Provincias: any[];
  // public Cantones: any[] = [];
  // public Parroquias: any[] = [];
  // public BufferCantones: any[];
  // public BufferParroquias: any[];

  // public Provincia: string;
  // public Canton: string;

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
  //   this.NewPersona.City = undefined;
  //   for (const canton of this.BufferCantones) {
  //     if (canton.Provincia == this.Provincia) this.Cantones.push(canton);
  //   }
  //   this.Canton = undefined;
  // }
  // LoadParroquias() {
  //   this.Parroquias = [];
  //   for (const parroquia of this.BufferParroquias) {
  //     if (parroquia.Canton == this.Canton) this.Parroquias.push(parroquia);
  //   }
  // }
  initNewPersona() {
    this.NewPersona = new Persona(
      '',
      '',
      '',
      '',
      // '',
      '',
      '',
      '',
      true,
      false,
      false,
      null,
      null);
  }

  onSubmitPersona() {
    (this.NewPersona._id != null && this.NewPersona._id !== '') ? this.UpdatePer() : this.CreatePer();
  }
  CreatePer() {
    this._personaService.Create(this.NewPersona).subscribe(
      response => {
        if (response) {
          this.SelectedPersona = response.Persona;
          this.Usuario.Persona = response.Persona._id;
          this.loadPersonas();
          this.initNewPersona();
        }
      },
      error => {
        console.warn(error as any);
      }
    );
  }
  UpdatePer() {
    this._personaService.Update(this.NewPersona).subscribe(
      response => {
        this.SelectedPersona = response.Persona;
        this.Usuario.Persona = response.Persona._id;
        this.loadPersonas();
        this.initNewPersona();
      },
      error => {
        console.error(error as any);
      }
    );
  }

  cedulaUnica(Ci) {
    this.ci_unica = true;
    if (Ci.length >= 1) {
      if (this.NewPersona._id == '') {
        for (const clientes of this.Personas) {
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
    if (this.NewPersona._id == '') {
      for (const clientes of this.Personas) {
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
  /**
   * Fin Ingreso de Persona
   */
  public SelectedEmpresa;
  SetEmpresaData() {
    this.currEmpresa = {};
    for (const emp of this.Empresas) {
      if (this.Usuario.Empresa && this.Usuario.Empresa == emp._id) this.currEmpresa = emp;
    }
  }
  SetPersonaData() {
    for (const persona of this.Personas) {
      if (this.Usuario.Persona == persona._id) this.SelectedPersona = persona;
    }
  }
  SetBodegaData() {
    for (const bodega of this.BufferBodegas) {
      if (bodega._id == this.Usuario.Bodega) this.currBodega = bodega;
    }
  }
  setDatas() {
    this.SetEmpresaData();
    this.SetPersonaData();
    this.SetBodegaData();
  }
  onSubmitUser() {
    if (this.Usuario.Role == 'Motorizado') this.Usuario.Repartidor = true;
    (this.Usuario._id != '') ? this.updateUser() : this.createUser();

  }
  cleanData() {
    // this.Canton = '';
    // this.Provincia = '';
    this.currEmpresa = null;
    this.currBodega = null;
    this.SelectedPersona = null;
    this.initNewPersona();
    this.initUser();
  }
  updateUser() {
    this._usuarioService.Update(this.Usuario).subscribe(
      response => {
        this.loadUsuarios();
        switch (response.Usuario.Role) {
          case "Encargado de Bodega":
            this.updateBodega(response.Usuario);
            break;
          case "Encargado de Repartidores":
            this.updateEmpresa(response.Usuario);
            break;
          case "Motorizado":
            break;
        }
      }
    )
  }
  createUser() {
    this._usuarioService.Create(this.Usuario).subscribe(
      response => {
        this.loadUsuarios();
        switch (response.Usuario.Role) {
          case "Encargado de Bodega":
            this.updateBodega(response.Usuario);
            break;
          case "Encargado de Repartidores":
            this.updateEmpresa(response.Usuario);
            break;
          case "Motorizado":
            break;
        }
      }
    )
  }

  updateEmpresaRepartidor(usuario) {
    this.cleanData();
  }

  updateEmpresa(usuario) {
    this.currEmpresa.Admin = usuario._id;
    this._empresaService.Update(this.currEmpresa).subscribe(
      response => {
        this.cleanData();
      }
    )
  }

  updateBodega(usuario) {
    this.currBodega.By = usuario._id;
    this._bodegaService.Update(this.currBodega).subscribe(
      response => {
        this.cleanData();
      }
    )
  }

  checkUserData(): boolean {
    let check = true;
    if (this.Password == this.ConfirmPassword) this.Usuario.Password = this.Password;
    const usuario = this.Usuario;
    if (!usuario.Email) check = false;
    if (!usuario.Password) check = false;
    if (!usuario.Persona) check = false;
    if (!usuario.Role) check = false;
    if (usuario.Role) {
      if ((usuario.Role == 'Motorizado' || usuario.Role == 'Encargado de Repartidores') && !usuario.Empresa) check = false;
      if (usuario.Role == 'Motorizado' && !usuario.RepData.Placa) check = false;
      if (usuario.Role == 'Motorizado' && !usuario.RepData.Tipo) check = false;
    }
    // if (!usuario.Persona) check = false; 

    return check;
  }

  toUpdateUser(usuario) {
    const tempString = JSON.stringify(usuario);
    const temp = JSON.parse(tempString);
    this.SelectedPersona = temp.Persona;
    this.bodegaFilter = 'todo';
    this.Usuario = temp;
    if (temp.Empresa) {
      this.currEmpresa = temp.Empresa;
      this.Usuario.Empresa = temp.Empresa._id;
    }
    if (temp.Bodega) {
      this.currBodega = temp.Bodega;
      this.Usuario.Bodega = temp.Bodega._id;
    }
  }
  infoUsuario(usuario) {
    this.ViewedUsuario = usuario;
    this.viewedCurrPosition = JSON.parse(usuario.Persona.GPS);    
    setTimeout(() => {
      this.initInfoMap();
      // console.log('launching info map');
      
    }, 500);
  }
}
