import { Component, OnInit } from '@angular/core';
import { Persona } from '../../../models/persona.model';
import { Usuario } from '../../../models/usuario.model';
import { PersonaService } from '../../../services/persona.service';
import { } from 'googlemaps';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MapStyles } from '../../../assets/map/mapStyle.service';
import { DatePipe } from '@angular/common';
import { EmpresaService } from '../../../services/empresa.service';
import { BodegaService } from '../../../services/bodega.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [PersonaService, MapStyles, EmpresaService, BodegaService, UsuarioService]
})
export class UsuarioComponent implements OnInit {

  public ci_correcta: boolean;
  public ph_correcta: boolean;
  public no: boolean;
  public ci_unica: boolean;
  public mail_unico: boolean;

  public Filters = {
    type: 'all',
    searchText: '',
    raw: false
  }
  public PaginationData = {
    Page: 1,
    ItemsPerPage: 5,
    Pages: 1
  } 
  public searchTitle: string = 'Todo';

  public newUsuario: Usuario;
  public newPersona: Persona;
  public SelectedPersona;
  public isNew: boolean = true;
  public ViewedUsuario;

  public router: Router;
  public form: FormGroup;
  public Personas: any[] = [];

  public currPosition;
  public viewedCurrPosition;

  public Empresas: any[] = [];
  public EmpresaInput: string = '';

  public Bodegas: any[] = [];
  public BodegaInput: string = '';

  public Usuarios: any[] = [];
  public BufferUsuarios: any[] = [];
  constructor(
    router: Router,
    fb: FormBuilder,
    private _PersonaService: PersonaService,
    private MapStyles: MapStyles,
    private datePipe: DatePipe,
    private _EmpresaService: EmpresaService,
    private _BodegaService: BodegaService,
    private _UsuarioService: UsuarioService
  ) {
    this.loadPersonas();
    this.initNewPersona();
    this.initNewUsuario();
    this.loadEmpresas();
    this.loadBodegas();
    this.Read();
  }	

  Read(raw = false) {
    switch (this.Filters.type) {
      case 'name':
        this.searchTitle = 'Nombres';
        break;
      case 'ci':
        this.searchTitle = 'Cédula';
        break;
      case 'lastname':
        this.searchTitle = 'Apellidos';
        break;
      case 'phone':
        this.searchTitle = 'Teléfono';
        break;
      case 'address':
        this.searchTitle = 'Dirección';
        break;
      case 'mail':
        this.searchTitle = 'Correo Electrónico';
        break;
      case 'role':
        this.searchTitle = 'Rol de Usuario';
        break;
      default:
        this.searchTitle = 'Todo';
        break;
    }
    this.Filters.raw = raw;
    let admin = null;
    this._UsuarioService.ComplexRead({
      Filters: this.Filters,
      PaginationData: this.PaginationData
    }, admin).subscribe(
      response => {
        this.PaginationData.Pages = response.Usuarios.Pages;
        this.Usuarios = response.Usuarios.List;
        this.Filters.raw = false;
        this.BufferUsuarios = response.Raw;
      }
    );
  }

  disableUsuario(usuario) {
    (usuario.Active) ? usuario.Active = false : usuario.Active = true;
    this._UsuarioService.Update(usuario).subscribe(
      response => {
        // console.log(response);
        this.Read();
      }
    )
  }
  loadEmpresas() {
    this._EmpresaService.Read().subscribe(
      response => {
        this.Empresas = response.Empresas;
      }
    )
  }

  infoUsuario(usuario) {
    this.ViewedUsuario = usuario;
    this.viewedCurrPosition = JSON.parse(usuario.Persona.GPS);    
    setTimeout(() => {
      this.initInfoMap();
      // console.log('launching info map');
      
    }, 250);
  }
  public SelectedEmpresa;
  toUpdateUser(usuario) {
    const tempString = JSON.stringify(usuario);
    const temp = JSON.parse(tempString);
    this.SelectedPersona = temp.Persona;
    this.newUsuario = temp;
    this.PhonePer = this.SelectedPersona.Phone;
    console.log(this.newUsuario);
    this.isNew = false;
    if (temp.Empresa) {
      this.SelectedEmpresa = temp.Empresa;
      this.newUsuario.Empresa = temp.Empresa._id;
      this.EmpresaInput = temp.Empresa.Name;
    }
    if (temp.Bodega) {
      console.log('Bodeguero', temp.Bodega);
      this.SelectedBodega = temp.Bodega;
      this.BodegaInput = temp.Bodega.Name;
      this.newUsuario.Bodega = temp.Bodega._id;
      
    }
  }
  setEmpresa(Name) {
    this.newUsuario.Empresa = undefined;
    this.SelectedEmpresa    = this.Empresas.find(empresa => empresa.Name == Name);
    this.newUsuario.Empresa =  this.Empresas.find(empresa => empresa.Name == Name);
  }
  public PhonePer = '';
  setPersona(Phone): any {
    this.SelectedPersona = undefined;
    this.SelectedPersona = this.Personas.find( persona => persona.Phone == Phone);
  }
  public SelectedBodega;
  setBodega(Name) {
    this.newUsuario.Bodega = undefined;
    this.SelectedBodega    = this.Bodegas.find(bodega => bodega.Name == Name);
    this.newUsuario.Bodega = this.Bodegas.find(bodega => bodega.Name == Name);
  }
  loadBodegas() {
    this._BodegaService.Read().subscribe(
      response => {
        this.Bodegas = response.Bodegas;
      }
    )
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
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
   loadPersonas() {
    this._PersonaService.ReadActive().subscribe(
      response => {
        this.Personas = response.Personas
      }
    )
   }

   initInfoMap() {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    // const infowindow = new google.maps.InfoWindow();
    const map = new google.maps.Map(
      document.getElementById("MyGoogleMapInfo") as HTMLDivElement,
      {
        zoom: 8,
        center: { lat: -1.482292789730304, lng: -77.99914699292728 },
        styles: this.MapStyles.Dark()
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
      console.log(this.ViewedUsuario);
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
 
    const map = new google.maps.Map(
      document.getElementById("MyGoogleMap") as HTMLDivElement,
      {
        zoom: 8,
        center: { lat: -1.482292789730304, lng: -77.99914699292728 },
        styles: this.MapStyles.Dark()
      }
    )
    directionsRenderer.setMap(map);
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
        this.newPersona.GPS = JSON.stringify(this.currPosition);
        this.newPersona.Address = this.currPosition.formatted_address;
      }
    )
    // click en el mapa
    map.addListener("click", (e) => {
      // this.placeMarkerAndPanTo(e.latLng, map, infowindow);
      console.log(e);

      this.geocodeLatLng(e.latLng, geocoder, map, infowindow);
    })
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
  initNewPersona() {
    this.newPersona = {
      _id: '',
      Active: false,
      Address: '',
      Ci: '',
      Created: {
        At: '',
        By: ''
      },
      Updated: {
        At: '',
        By: ''
      },
      FirstName: '',
      GPS: '',
      HasAccount: true,
      LastName: '',
      Phone: '',
      isDueno: false
    }
  }

  JSONParse(str): any {
    const Object = JSON.parse(str);
    return Object
  }

  initNewUsuario() {
    this.newUsuario = {
      _id: '',
      Active: true,
      Bodega: null,
      Created: {
        At: '',
        By: ''
      },
      Email: '',
      Empresa: null,
      Password: '',
      Persona: '',
      RepData: {
        Placa: '',
        Tipo: ''
      },
      Repartidor: false,
      Role: '',
      Updated: {
        At: '',
        By: ''
      }
    }
  }

  ngOnInit() {
  }


  cedulaUnica(Ci) {
    this.ci_unica = true;
    if (Ci.length >= 1) {
      if (this.newPersona._id == '') {
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
    if (this.newPersona._id == '') {
      for (const clientes of this.Personas) {
        const phoneBD = clientes.Phone;
        if (phoneBD == Phone) {
          this.ph_correcta = false;
        }
      }
    }
  }
  mailUnico(mail) {
    this.mail_unico = true;
    if (this.newPersona._id == '') {
      for (const clientes of this.Personas) {
        const mailBD = clientes.Email;
        if (mailBD == mail) this.mail_unico = false;
      }
    }
  }
  checkRole() {
    (this.newUsuario.Role == 'Motorizado') ? this.newUsuario.Repartidor = true : this.newUsuario.Repartidor = false;
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
  onPersonaReady() {
    (this.newUsuario._id && this.newUsuario._id != '') ? this.onUpdate() : this.onCreate() ; 
  }
  onSubmit() {
    
    if (this.SelectedPersona && this.SelectedPersona._id && this.SelectedPersona != '') {
      this.SelectedPersona.HasAccount = true;
      this._PersonaService.Update(this.SelectedPersona).subscribe(
        response => {
          // console.log(response);
          this.newUsuario.Persona = response.Persona._id;
          this.newUsuario.Password = response.Persona.Ci;
          this.onPersonaReady();
        }
      )
    } else {
      console.log('Guardar la Nueva Persona', this.newPersona);
      this.newPersona.HasAccount = true;
      this._PersonaService.Create(this.newPersona).subscribe(
        response => {
          this.newUsuario.Persona = response.Persona._id;
          this.newUsuario.Password = response.Persona.Ci;
          this.newPersona = response.Persona;
          this.onPersonaReady();
        }
      )
    }
  }
  onCreate() {
    console.log('Creando: ', this.newUsuario);
    this.newUsuario.Password;
    this._UsuarioService.Create(this.newUsuario).subscribe(
      response => {
        this.checkChildrens(response.Usuario.Role, response.Usuario._id, response.Usuario.Persona);
      }
    )
  }
  onUpdate()  {
    console.log('editando: ', this.newUsuario);
    this._UsuarioService.Update(this.newUsuario).subscribe(
      response => {
        this.checkChildrens(response.Usuario.Role, response.Usuario._id, response.Usuario.Persona);
      }
    )
  }
  checkChildrens(Role, user, persona) {
    let per = {
      _id: persona,
      isDueno: false,
      HasAccount: true,
      Updated: {
        By: '',
        At: ''
      }
    }
    switch (Role) {
      case 'Administrador' || 'Admin' || 'Secretario':
        this.UpdatePersona(per);
        break;
      case 'Encargado de Bodega':
        this.UpdatePersona(per);
        this.SelectedBodega.By = user;
        this.UpdateBodega(this.SelectedBodega);
        break;
      case 'Encargado de Repartidores':
        per.isDueno = true;
        this.UpdatePersona(per);
        this.SelectedEmpresa.Admin = user;
        this.UpdateEmpresa(this.SelectedEmpresa);
        break;
      case 'Motorizado':
        this.UpdatePersona(per);
        break;
    }
    this.cleanData();
  }
  UpdateEmpresa(Empresa) {
    this._EmpresaService.Update(Empresa).subscribe(
      response => {
        console.log(response);
      }
    )
  }
  UpdateBodega(Bodega) {
    this._BodegaService.Update(Bodega).subscribe(
      response => {
        console.log(response);
      }
    )
  }
  UpdatePersona(Persona) {
    this._PersonaService.Update(Persona).subscribe(
      response => {
        console.log(response);
      }
    )
  }
  getPersona(): string {
    if (this.SelectedPersona && this.SelectedPersona._id && this.SelectedPersona != '') {
      this.SelectedPersona.HasAccount = true;
      this._PersonaService.Update(this.SelectedPersona).subscribe(
        response => {
          console.log(response);
        }
      )
      return this.SelectedPersona._id;
    } else {
      console.log('Guardar la Nueva Persona', this.newPersona);
      this.newPersona.HasAccount = true;
      this._PersonaService.Create(this.newPersona).subscribe(
        response => {
          this.newPersona = response.Persona;
          return response.Persona._id;
        }
      )
    }
  }

  cleanData() {
    this.initNewUsuario();
    this.isNew = true;
    setTimeout(() => {
      this.initNewPersona();
      this.loadPersonas();
      this.loadBodegas();
      this.loadEmpresas();
      this.SelectedPersona = null;
      this.SelectedBodega = null;
      this.SelectedEmpresa = null;
    }, 350);
  }
}
