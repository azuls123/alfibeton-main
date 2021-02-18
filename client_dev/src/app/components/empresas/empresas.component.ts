import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/models/persona.model';
import { PersonaService } from 'src/services/persona.service';
import { ProvinciaService } from 'src/services/provincia.service';
import { EmpresaService } from 'src/services/empresa.service';
import { Empresa } from 'src/models/empresa.model';
import { UsuarioService } from 'src/services/usuario.service';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { } from 'googlemaps';
@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss'],
  providers: [ProvinciaService, PersonaService, EmpresaService, UsuarioService]
})
export class EmpresasComponent implements OnInit {
  public role: string;


  public currPosition;
  public viewedCurrPosition;

  public steps: any[];
  public showConfirm: boolean;
  public confirmed: boolean;

  // public Provincias: any[];
  // public Cantones: any[] = [];
  // public Parroquias: any[] = [];
  // public ProvinciasNewDueno: any[];
  // public CantonesNewDueno: any[] = [];
  // public ParroquiasNewDueno: any[] = [];
  // public BufferCantones: any[];
  // public BufferParroquias: any[];

  // public Provincia: string = '';
  // public Canton: string = '';
  // public ProvinciaDueno: string = '';
  // public CantonDueno: string = '';

  public currEmpresa;
  public empresa: Empresa;
  public Empresas: any[] = [];
  public BufferEmpresas: any[] = [];

  public newDueno;
  public currDueno;
  public currAdmin;
  public ci_correcta: boolean;
  public ph_correcta: boolean;
  public nemp_correcta: boolean;
  public no: boolean;
  public ci_unica: boolean;
  public cedulas: any[];

  public Personas: any[] = [];
  public BufferPersonas: any[] = [];
  public searchTitlePer: string = 'Buscar Algo...';
  public searchTextPer: string;
  public typePer: string = 'all';

  public isPrev: boolean = true;

  public Usuarios: any[] = [];
  public BufferUsuarios: any[] = [];

  
  public paginationDataEmpresas = {
    id: 'empresas_tbl',
    itemsPerPage: 10,
    currentPage: 1
  }

  public Admin: any;
  constructor(
    // private _ProvinciaService: ProvinciaService,
    private _PersonaService: PersonaService,
    private _empresaService: EmpresaService,
    private _usuarioService: UsuarioService,
    private location: Location,
    private datePipe: DatePipe
    ) {
    const usuario = JSON.parse(localStorage.getItem('Identity'));
    if (usuario && usuario.Role) this.role = usuario.Role;
    if (this.role != 'Admin' && this.role != 'Administrador' ) {
      this.location.back();
    }
    this.initEmpresa();
    this.LoadEmpresas();
    this.initSteps();
    this.initDueno();
    // this.LoadLocations();
    this.loadPersonas();
    this.loadUsers();
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
    let CreatedBy = '', UpdatedBy = '', representante = '', admin='', ruc = '';
    if (this.currEmpresa.Created && this.currEmpresa.Created.By) {
      CreatedBy = 
      "<hr><p><i class='fa fa-save'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Ingresado por: </b> " + this.currEmpresa.Created.By.Persona.FirstName + " " + this.currEmpresa.Created.By.Persona.LastName + " - (" + this.currEmpresa.Created.By.Email + ") <p>"+
      "<p><i class='fa fa-save'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Ingresado El: </b> "+ this.datePipe.transform((parseInt(this.currEmpresa.Created.At) * 1000), 'medium') +" <p>";
    }
    if (this.currEmpresa.Updated && this.currEmpresa.Updated.By) {
      UpdatedBy = 
      "<hr><p><i class='fa fa-edit'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Actualizado por: </b> " + this.currEmpresa.Updated.By.Persona.FirstName + " " + this.currEmpresa.Updated.By.Persona.LastName + " - (" + this.currEmpresa.Updated.By.Email + ") <p>"+
      "<p><i class='fa fa-edit'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Actualizado El: </b> "+ this.datePipe.transform((parseInt(this.currEmpresa.Updated.At) * 1000), 'medium') +" <p>";
    }
    if (this.currEmpresa.Representante) {
      ruc = this.currEmpresa.Representante.Ci +'-'+this.currEmpresa.RUC
      representante = 
      "<hr><p><i class='fa fa-user'></i>&nbsp; <b>Representante: </b> " + this.currEmpresa.Representante.FirstName + " " + this.currEmpresa.Representante.LastName + "<p>"+
      "<p><i class='fa fa-id-badge'></i>&nbsp;  <b>Cédula: </b> "+ this.currEmpresa.Representante.Ci  +" <p>";
    }
    if (this.currEmpresa.Admin) {
      admin = 
      "<hr><p><i class='fa fa-user'></i>&nbsp; <b>Administrador: </b> " + this.currEmpresa.Admin.Persona.FirstName + " " + this.currEmpresa.Admin.Persona.LastName + " - (" + this.currEmpresa.Admin.Email + ") <p>"+
      "<p><i class='fa fa-id-badge'></i>&nbsp;  <b>Cédula: </b> "+ this.currEmpresa.Admin.Persona.Ci  +" <p>";
    }
    const contentString = 
    '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h4 id="firstHeading" class="firstHeading"> <i class="fa fa-building"></i>&nbsp;'+this.currEmpresa.Name+' - ' + ruc + '</h4>' +
      '<div id="bodyContent" class="p-1">' +
        "<hr><p><i class='fas fa-location-arrow'></i>&nbsp;<b> Dirección: </b>" + this.viewedCurrPosition.formatted_address + '.'+
        "<p><i class='fas fa-map-marked-alt'></i>&nbsp;<b> GPS: </b>" + JSON.stringify(this.viewedCurrPosition.geometry.location) + '.'+
        // "<p><i class='fa fa-phone'></i>&nbsp;<b> Teléfono: </b>" + this.currEmpresa.Phone + '.'+
        representante +
        admin +
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
        this.empresa.GPS = JSON.stringify(this.currPosition);
        this.empresa.Address = this.currPosition.formatted_address;
      }
    )
    // click en el mapa
    map.addListener("click", (e) => {
      // this.placeMarkerAndPanTo(e.latLng, map, infowindow);
      console.log(e);

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
  cleanData() {
    this.initEmpresa();
    this.initSteps();
    this.initDueno();
    // this.Provincia = '';
    // this.Canton = '';
  }
  LoadEmpresas() {
    this._empresaService.Read().subscribe(
      response => {
        // console.log(response);
        this.Empresas = response.Empresas;
        this.BufferEmpresas = response.Empresas;
      }
    )
  }
  
  public UsuariosEmpresa;
  public BufferUsuariosEmpresa;
  loadMotorizados(empresa) {
    this._usuarioService.ReadMotorizados(empresa).subscribe(
      response => {
        console.log(response);
        this.UsuariosEmpresa = response.Usuarios;
        this.BufferUsuariosEmpresa = response.Usuarios;
      }
    )
  }
  initEmpresa() {
    this.empresa = new Empresa(
      '',
      '',
      '',
      '',
      '',
      // '',
      '',
      '',
      true
    );
  }
  // getParroquia(id): any {
  //   let SetParroquia: any;
  //   for (const parroquia of this.BufferParroquias) {
  //     if (id == parroquia._id) SetParroquia = parroquia;
  //   }
  //   return SetParroquia;
  // }
  // getCanton(id): any {
  //   let SetCanton: any;
  //   for (const Canton of this.BufferCantones) {
  //     if (id == Canton._id) SetCanton = Canton;
  //   }
  //   return SetCanton;
  // }
  // getProvincia(id): any {
  //   let SetProvincia: any;
  //   for (const provincia of this.Provincias) {
  //     if (id == provincia._id) SetProvincia = provincia;
  //   }
  //   return SetProvincia;
  // }
  checkDetalles(): boolean {
    let check = false;
    // console.log(this.Canton , this.Provincia , this.empresa.Name , this.empresa.City ,this.empresa.Address);
    if (this.empresa.Name && this.empresa.GPS && this.empresa.Address)
      check = true;
    return check;
  }
  loadPersonas() {
    this._PersonaService.Read().subscribe(
      response => {
        // const temp = JSON.stringify(response.Personas);
        // this.Personas = JSON.parse(temp);
        this.Personas = [];
        for (const persona of response.Personas) {
          if (!persona.isDueno && persona.Ci && !persona.HasAccount) this.Personas.push(persona);
        }
        this.BufferPersonas = this.Personas;
        // console.log(this.Personas);

      },
      error => {
        console.error(error as any);
      }
    );
  }
  initDueno() {
    this.newDueno = new Persona(
      '',
      '',
      '',
      '',
      '',
      // '',
      '',
      '',
      false,
      false,
      false,
      null,
      null
    )
  }
  ngOnInit() {
  }
  initSteps() {
    this.steps = [
      { name: 'Detalles', icon: 'fa-building', active: true, valid: false, hasError: false },
      { name: 'Representante Legal', icon: 'fa-user', active: false, valid: false, hasError: false },
      { name: 'Administrador', icon: 'fa-id-badge', active: false, valid: false, hasError: false }
    ]
  }
  public next() {

    if (this.steps[this.steps.length - 1].active)
      return false;

    this.steps.some(function (step, index, steps) {
      if (index < steps.length - 1) {
        if (step.active) {
          if (step.name == 'Detalles') {
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
          if (step.name == 'Representante Legal') {
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
  //   this.empresa.City = '';
  //   for (const canton of this.BufferCantones) {
  //     if (canton.Provincia == this.Provincia) this.Cantones.push(canton);
  //   }
  //   this.Canton = '';
  // }
  // LoadParroquias() {
  //   this.Parroquias = [];
  //   for (const parroquia of this.BufferParroquias) {
  //     if (parroquia.Canton == this.Canton) this.Parroquias.push(parroquia);
  //   }
  // }
  // LoadCantonesNewDueno() {
  //   this.CantonesNewDueno = [];
  //   this.ParroquiasNewDueno = [];
  //   this.newDueno.City = '';
  //   for (const canton of this.BufferCantones) {
  //     if (canton.Provincia == this.ProvinciaDueno) this.CantonesNewDueno.push(canton);
  //   }
  //   this.CantonDueno = '';
  // }
  // LoadParroquiasNewDueno() {
  //   this.ParroquiasNewDueno = [];
  //   for (const parroquia of this.BufferParroquias) {
  //     if (parroquia.Canton == this.CantonDueno) this.ParroquiasNewDueno.push(parroquia);
  //   }
  // }
  definePer() {
    this.Personas = [];
    // console.log(this.searchText);

    if (this.searchTextPer !== '' && this.searchTextPer != '') {
      for (const item of this.BufferPersonas) {
        const nombre = item.FirstName.toLowerCase().replace(/'[ ]'/g, '');
        const apellido = item.LastName.toLowerCase().replace(/'[ ]'/g, '');
        const telefono = item.Phone.replace(/'[ ]'/g, '');
        const cedula = item.Ci.replace(/'[ ]'/g, '');
        let ciudad = item.City.Name.toLowerCase().replace(/'[ ]'/g, '');
        let direccion = item.Address.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.City.Name.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.City.Canton.Name.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.City.Canton.Provincia.Name.toLowerCase().replace(/'[ ]'/g, '');
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


  checkData(): boolean {
    let check = false;

    if (this.empresa.Address && this.empresa.Name && this.empresa.Representante && this.currDueno && this.currDueno._id) {
      check = true
    }

    return check
  }


  onSubmitNewDueno() {
    // console.log(this.newDueno);
    this.CreateDueno();
  }
  CreateDueno() {
    this._PersonaService.Create(this.newDueno).subscribe(
      response => {
        if (response) {
          this.currDueno = response.Persona;
          this.loadPersonas();
        }
      },
      error => {
        console.warn(error as any);
      }
    );
  }
  cedulaUnica(Ci) {
    this.ci_unica = true;
    if (Ci.length >= 1) {
      if (this.newDueno._id == '') {
        for (const clientes of this.Personas) {
          const cedulaBD = clientes.Ci;
          if (cedulaBD == Ci) {
            this.ci_unica = false;
          }
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
    }
  }
  telfUnica(Phone) {
    this.ph_correcta = true;
    if (this.newDueno._id == '') {
      for (const clientes of this.Personas) {
        const phoneBD = clientes.Phone;
        // console.log(phoneBD);
        if (phoneBD == Phone) {
          this.ph_correcta = false;
        }
      }
    }
  }
  empUnica(EmpName) {
    this.nemp_correcta = true;
    if (this.empresa._id == '') {
      for (const Empresas of this.Empresas) {
        const empBD = Empresas.Name;
        // console.log(phoneBD);
        if (empBD == EmpName) {
          this.nemp_correcta = false;
        }
      }
    }
  }
  checkRuc() {
    let check = false;
    // console.log(this.empresa.RUC.length);

    if (this.empresa.RUC && this.empresa.RUC.length == 3) check = true;
    return check
  }
  onSubmit() {
    (this.empresa._id != '') ? this.updateEmpresa() : this.saveEmpresa();
  }
  saveEmpresa() {
    this._empresaService.Create(this.empresa).subscribe(
      response => {
        console.log(response);
        this.initDueno();
        this.LoadEmpresas();
        this.currDueno = undefined;
      }
    )
  }
  updateEmpresa() {
    this._empresaService.Update(this.empresa).subscribe(
      response => {
        console.log(response);
        this.initDueno();
        this.LoadEmpresas();
        this.currDueno = undefined;
      }
    )
  }
  public typeEmp: string = 'all';
  public searchTitleEmp: string = 'Buscar Algo...';
  public searchTextEmp: string = '';
  defineEmp() {
    this.Empresas = [];
    // console.log(this.searchText);

    if (this.searchTextEmp !== '' && this.searchTextEmp != '') {
      for (const item of this.BufferEmpresas) {
        const nombre = item.Name.toLowerCase().replace(/'[ ]'/g, '');
        let nombreRep = item.Representante.FirstName.toLowerCase().replace(/'[ ]'/g, '');
        nombreRep = nombreRep + item.Representante.LastName.toLowerCase().replace(/'[ ]'/g, '');
        const telefono = item.Phone.replace(/'[ ]'/g, '');
        let cedula = item.Representante.Ci.replace(/'[ ]'/g, '');
        cedula = cedula + item.RUC.replace(/'[ ]'/g, '');
        let ciudad = item.City.Name.toLowerCase().replace(/'[ ]'/g, '');
        let direccion = item.Address.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.City.Name.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.City.Canton.Name.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.City.Canton.Provincia.Name.toLowerCase().replace(/'[ ]'/g, '');
        let termino = '';
        switch (this.typeEmp) {
          case 'name':
            this.searchTitleEmp = 'Buscar Nombre de Empresa...';
            termino = nombre;
            break;
          case 'nameRep':
            this.searchTitleEmp = 'Buscar Nombre del Representante...';
            termino = nombreRep;
            break;
          case 'ci':
            this.searchTitleEmp = 'Buscar RUC de la Empresa...';
            termino = cedula;
            break;
          case 'address':
            this.searchTitleEmp = 'Buscar Dirección de la Empresa...';
            termino = direccion;
            break;
          default:
            this.searchTitleEmp = 'Buscar Algo...';
            termino = nombre + nombreRep + direccion + cedula;
            break;
        }
        if (termino.indexOf(this.searchTextPer.toLowerCase().replace(/' '/g, '')) > -1) {
          this.Empresas.push(item);
        }
      }
    } else {
      this.Empresas = this.BufferEmpresas;
      switch (this.typeEmp) {
        case 'name':
          this.searchTitleEmp = 'Buscar Nombre de Empresa...';
          break;
        case 'ci':
          this.searchTitleEmp = 'Buscar RUC de la Empresa...';
          break;
        case 'address':
          this.searchTitleEmp = 'Buscar Dirección de la Empresa...';
          break;
        default:
          this.searchTitleEmp = 'Buscar Algo...';
          break;
      }
    }
  }

  Delete(empresa) {
    empresa.Active = !empresa.Active;

    this._empresaService.Update(empresa).subscribe(
      response => {
        this.LoadEmpresas();
      }
    )
  }
  toUpdate(item) {
    const temp = JSON.stringify(item);
    const empresa = JSON.parse(temp);
    // const canton = empresa.City.Canton._id;
    // const provincia = empresa.City.Canton.Provincia._id;
    const dueno = empresa.Representante;
    // this.Provincia = provincia;
    this.currPosition = JSON.parse(empresa.GPS);
    // this.LoadCantones();
    // this.Canton = canton;
    this.empresa = empresa;
    if (empresa.Admin) {
      this.currAdmin = empresa.Admin
      console.log(empresa.Admin);

      this.empresa.Admin = empresa.Admin._id
    }
    this.empresa.Representante = empresa.Representante._id;
    this.currDueno = dueno;
    // this.empresa.City = empresa.City._id;
    // this.LoadParroquias();
  }
  public typeUsers: string = 'all';
  public searchTitleUsers: string = 'Buscar Algo...';
  public searchTextUsers: string = '';
  defineUsers() {
    this.Usuarios = [];
    // console.log(this.searchText);

    if (this.searchTextUsers !== '' && this.searchTextUsers != '') {
      for (const item of this.BufferUsuarios) {
        const mail = item.Email.toLowerCase().replace(/'[ ]'/g, '')
        const nombre = item.Persona.FirstName.toLowerCase().replace(/'[ ]'/g, '');
        // let nombreRep = item.Persona.FirstName.toLowerCase().replace(/'[ ]'/g, '');
        const apellido = item.Persona.LastName.toLowerCase().replace(/'[ ]'/g, '');
        const telefono = item.Persona.Phone.replace(/'[ ]'/g, '');
        let cedula = item.Persona.Ci.replace(/'[ ]'/g, '');
        // cedula = cedula + item.Persona.Ci.replace(/'[ ]'/g, '');
        let ciudad = item.Persona.City.Name.toLowerCase().replace(/'[ ]'/g, '');
        let direccion = item.Persona.Address.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.Persona.City.Name.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.Persona.City.Canton.Name.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.Persona.City.Canton.Provincia.Name.toLowerCase().replace(/'[ ]'/g, '');
        let termino = '';
        switch (this.typeUsers) {
          case 'name':
            this.searchTitleUsers = 'Buscar Nombre...';
            termino = nombre;
            break;
          case 'lastname':
            this.searchTitleUsers = 'Buscar Apellido...';
            termino = apellido;
            break;
          case 'phone':
            this.searchTitleUsers = 'Buscar Teléfono...';
            termino = telefono;
            break;
          case 'ci':
            this.searchTitleUsers = 'Buscar Cédula...';
            termino = cedula;
            break;
          case 'address':
            this.searchTitleUsers = 'Buscar Dirección...';
            termino = direccion;
            break;
          case 'mail':
            this.searchTitleUsers = 'Buscar Correo Electrónico...';
            termino = mail;
            break;
          default:
            this.searchTitleUsers = 'Buscar Algo...';
            termino = nombre + apellido + telefono + direccion + cedula + mail;
            break;
        }
        if (termino.indexOf(this.searchTextUsers.toLowerCase().replace(/' '/g, '')) > -1) {
          this.Usuarios.push(item);
        }
      }
    } else {
      this.Usuarios = this.BufferUsuarios;
      switch (this.typeUsers) {
        case 'name':
          this.searchTitleUsers = 'Buscar Nombre...';
          break;
        case 'lastname':
          this.searchTitleUsers = 'Buscar Apellido...';
          break;
        case 'phone':
          this.searchTitleUsers = 'Buscar Teléfono...';
          break;
        case 'ci':
          this.searchTitleUsers = 'Buscar Cédula...';
          break;
        case 'address':
          this.searchTitleUsers = 'Buscar Dirección...';
          break;
        case 'mail':
          this.searchTitleUsers = 'Buscar Correo Electrónico...';
          break;
      }
    }
  }
  loadUsers() {
    this._usuarioService.Read().subscribe(
      response => {
        this.Usuarios = response.Usuarios;
        this.BufferUsuarios = response.Usuarios;
      }
    )
  }
  infoEmpresa(empresa) {
    this.currEmpresa = empresa;
    this.viewedCurrPosition = JSON.parse(empresa.GPS);
    this.loadMotorizados(empresa._id);
    setTimeout(() => {
      this.initInfoMap();
    }, 500);
  }
}
