import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { } from 'googlemaps';
import { BodegaService } from "../../../services/bodega.service";
import { EmpresaService } from "../../../services/empresa.service";
import { PersonaService } from "../../../services/persona.service";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-locaciones',
    templateUrl: './locaciones.component.html',
    styleUrls: ['./locaciones.component.scss'],
    providers: [BodegaService, EmpresaService, PersonaService]
})

export class LocacionesComponent implements OnInit {
    public role: string;

    public DirectionService: google.maps.DirectionsService;
    public DirectionsRenderer: google.maps.DirectionsRenderer;

    public Geocoder: google.maps.Geocoder;

    public InfoWindow: google.maps.InfoWindow;
    public Markers: google.maps.Marker[] = [];
    public Marker: google.maps.Marker;
    public Map: google.maps.Map;

    public Bodegas;
    public Empresas;

    public FilterModel: any[];
    public FilterOptions: IMultiSelectOption[] = [
        { id: 'persona', name: 'Clientes' },
        { id: 'bodega', name: 'Bodegas' },
        { id: 'empresa', name: 'Empresas' }
    ];

    public myTexts: IMultiSelectTexts = {
        checkAll: 'Ver Todos los Marcadores',
        uncheckAll: 'Ocultar Todos los Marcadores',
        checked: 'Marcador seleccionado',
        checkedPlural: 'Marcadores Seleccionados',
        searchPlaceholder: 'Buscar',
        searchEmptyResult: 'Sin Resultados...',
        searchNoRenderText: 'Type in search box to see results...',
        defaultTitle: 'Elegir Marcadores...............',
        allSelected: 'Todo Seleccionado',
    };
    public mySettings: IMultiSelectSettings = {
        enableSearch: true,
        checkedStyle: 'fontawesome',
        buttonClasses: 'form-control',
        dynamicTitleMaxItems: 4,
        displayAllSelectedText: true,
        showCheckAll: true,
        showUncheckAll: true,
    };
    constructor(
        private _bodegaService: BodegaService,
        private _empresaService: EmpresaService,
        private _personaService: PersonaService,
        private location: Location,
        private datePipe: DatePipe
    ) {
        this.DirectionService = new google.maps.DirectionsService();
        this.DirectionsRenderer = new google.maps.DirectionsRenderer();
        this.Geocoder = new google.maps.Geocoder();
        this.InfoWindow = new google.maps.InfoWindow();

        const usuario = JSON.parse(localStorage.getItem('Identity'));
        if (usuario && usuario.Role) this.role = usuario.Role;
        if (this.role == 'Encargado de Bodega' || this.role == 'Encargado de Repartidores' || this.role == 'Motorizado') {
            this.location.back();
        }
    }

    initMap() {
        this.Map = new google.maps.Map(
            document.getElementById("locationMap") as HTMLDivElement,
            {
                zoom: 6,
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
        );
        this.loadBodegas();
        this.loadEmpresas();
        this.loadPersonas();
    }

    public Personas = [];
    loadPersonas() {
        this._personaService.Read().subscribe(
            response => {
                this.Personas = response.Personas;
                const customIcon = {
                    path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
                    fillColor: "yellow",
                    fillOpacity: 0.8,
                    scale: 0.6,
                    strokeColor: "gold",
                    strokeWeight: 14,
                }
                for (const item of this.Personas) {
                    const GPS = JSON.parse(item.GPS);
                    const marker = new google.maps.Marker({
                        position: GPS.geometry.location,
                        map: this.Map,
                        title: 'persona',
                        // icon: customIcon
                        icon: {
                            url: 'assets/markers/user.png',
                            fillColor: '#00CCBB',
                            // size: new google.maps.Size(202, 322),
                        }
                    })
                    let CreatedBy = '';
                    let UpdatedBy = '';
                    if (item.Created.By) {
                        CreatedBy =
                            "<hr><p><i class='fa fa-save'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Ingresado por: </b> " + item.Created.By.Persona.FirstName + " " + item.Created.By.Persona.LastName + " - (" + item.Created.By.Email + ") <p>" +
                            "<p><i class='fa fa-save'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Ingresado El: </b> " + this.datePipe.transform((parseInt(item.Created.At) * 1000), 'medium') + " <p>";
                    }
                    if (item.Updated.By) {
                        UpdatedBy =
                            "<hr><p><i class='fa fa-edit'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Actualizado por: </b> " + item.Updated.By.Persona.FirstName + " " + item.Updated.By.Persona.LastName + " - (" + item.Updated.By.Email + ") <p>" +
                            "<p><i class='fa fa-edit'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Actualizado El: </b> " + this.datePipe.transform((parseInt(item.Updated.At) * 1000), 'medium') + " <p>";
                    }
                    const contentString =
                        '<div id="content">' +
                        '<div id="siteNotice">' +
                        "</div>" +
                        '<h4 id="firstHeading" class="firstHeading"> <i class="fa fa-user-id"></i>&nbsp;' + item.FirstName + ' ' + item.LastName + '</h4>' +
                        '<div id="bodyContent"class="p-1">' +
                        "<hr><p><i class='fa fa-id-badge'></i>&nbsp;<b> Cédula: </b>" + item.Ci + '.' +
                        "<p><i class='fa fa-phone'></i>&nbsp;<b> Teléfono: </b>" + item.Phone + '.' +
                        "<hr><p><i class='fas fa-location-arrow'></i>&nbsp;<b> Dirección: </b>" + JSON.parse(item.GPS).formatted_address + '.' +
                        "<p><i class='fas fa-map-marked-alt'></i>&nbsp;<b> GPS: </b>" + JSON.stringify(JSON.parse(item.GPS).geometry.location) + '.' +
                        // "<p><i class='fa fa-envelope'></i>&nbsp;<b> Correo Electronico: </b>" + item.Email + '.'+
                        CreatedBy +
                        UpdatedBy +
                        "</div>" +
                        "</div>";
                    const infowindow = new google.maps.InfoWindow({
                        content: contentString,
                    });
                    marker.addListener("click", () => {
                        infowindow.close();
                        infowindow.open(this.Map, marker);
                    })
                    // console.log('addin marker');
                    this.Markers.push(marker);
                }
            }
        )
    }

    loadBodegas() {
        this._bodegaService.Read().subscribe(
            response => {
                this.Bodegas = response.Bodegas;
                for (const item of this.Bodegas) {
                    const GPS = JSON.parse(item.GPS);
                    const marker = new google.maps.Marker({
                        position: GPS.geometry.location,
                        map: this.Map,
                        title: 'bodega',
                        icon: {
                            url: 'assets/markers/industry.png',
                            fillColor: '#00CCBB',
                            // size: new google.maps.Size(202, 322),
                        }
                    })
                    let CreatedBy = '';
                    let UpdatedBy = '';
                    if (item.Created.By) {
                      CreatedBy = 
                      "<hr><p><i class='fa fa-save'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Ingresado por: </b> " + item.Created.By.Persona.FirstName + " " + item.Created.By.Persona.LastName + " - (" + item.Created.By.Email + ") <p>"+
                      "<p><i class='fa fa-save'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Ingresado El: </b> "+ this.datePipe.transform((parseInt(item.Created.At) * 1000), 'medium') +" <p>";
                    }
                    if (item.Updated.By) {
                      UpdatedBy = 
                      "<hr><p><i class='fa fa-edit'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Actualizado por: </b> " + item.Updated.By.Persona.FirstName + " " + item.Updated.By.Persona.LastName + " - (" + item.Updated.By.Email + ") <p>"+
                      "<p><i class='fa fa-edit'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Actualizado El: </b> "+ this.datePipe.transform((parseInt(item.Updated.At) * 1000), 'medium') +" <p>";
                    }
                    const contentString =
                        '<div id="content">' +
                        '<div id="siteNotice">' +
                        "</div>" +
                        '<h4 id="firstHeading" class="firstHeading"> <i class="fa fa-industry"></i>&nbsp;' + item.Name + '</h4>' +
                        '<div id="bodyContent" class="p-1">' +
                        "<hr><p><i class='fas fa-location-arrow'></i>&nbsp;<b> Dirección: </b>" + JSON.parse(item.GPS).formatted_address + '.' +
                        "<p><i class='fas fa-map-marked-alt'></i>&nbsp;<b> GPS: </b>" + JSON.stringify(JSON.parse(item.GPS).geometry.location) + '.' +
                        "<p><i class='fa fa-phone'></i>&nbsp;<b> Teléfono: </b>" + item.Phone + '.' +
                        CreatedBy +
                        UpdatedBy +
                        "</div>" +
                        "</div>";
                    const infowindow = new google.maps.InfoWindow({
                        content: contentString,
                    });
                    marker.addListener("click", () => {
                      infowindow.close();
                      infowindow.open(this.Map, marker);
                    })
                    // console.log('addin marker');
                    this.Markers.push(marker);
                }
            }
        )
    }

    setMarkersOnMap(map: google.maps.Map | null) {
        for (let i = 0; i < this.Markers.length; i++) {
            this.Markers[i].setMap(map);
        }
    }

    loadEmpresas() {
        this._empresaService.Read().subscribe(
            response => {
                this.Empresas = response.Empresas;
                for (const item of this.Empresas) {
                    const GPS = JSON.parse(item.GPS);
                    const marker = new google.maps.Marker({
                        position: GPS.geometry.location,
                        map: this.Map,
                        title: 'empresa',
                        icon: {
                            url: 'assets/markers/building.png',
                            fillColor: '#00CCBB',
                            // size: new google.maps.Size(202, 322),
                        }
                    });
                    let CreatedBy = '', UpdatedBy = '', representante = '', admin='', ruc = '';
                    if (item.Created.By) {
                      CreatedBy = 
                      "<hr><p><i class='fa fa-save'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Ingresado por: </b> " + item.Created.By.Persona.FirstName + " " + item.Created.By.Persona.LastName + " - (" + item.Created.By.Email + ") <p>"+
                      "<p><i class='fa fa-save'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Ingresado El: </b> "+ this.datePipe.transform((parseInt(item.Created.At) * 1000), 'medium') +" <p>";
                    }
                    if (item.Updated.By) {
                      UpdatedBy = 
                      "<hr><p><i class='fa fa-edit'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Actualizado por: </b> " + item.Updated.By.Persona.FirstName + " " + item.Updated.By.Persona.LastName + " - (" + item.Updated.By.Email + ") <p>"+
                      "<p><i class='fa fa-edit'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Actualizado El: </b> "+ this.datePipe.transform((parseInt(item.Updated.At) * 1000), 'medium') +" <p>";
                    }
                    if (item.Representante) {
                      ruc = item.Representante.Ci +'-'+item.RUC
                      representante = 
                      "<hr><p><i class='fa fa-user'></i>&nbsp; <b>Representante: </b> " + item.Representante.FirstName + " " + item.Representante.LastName + "<p>"+
                      "<p><i class='fa fa-id-badge'></i>&nbsp;  <b>Cédula: </b> "+ item.Representante.Ci  +" <p>";
                    }
                    if (item.Admin) {
                      admin = 
                      "<hr><p><i class='fa fa-user'></i>&nbsp; <b>Administrador: </b> " + item.Admin.Persona.FirstName + " " + item.Admin.Persona.LastName + " - (" + item.Admin.Email + ") <p>"+
                      "<p><i class='fa fa-id-badge'></i>&nbsp;  <b>Cédula: </b> "+ item.Admin.Persona.Ci  +" <p>";
                    }
                    const contentString = 
                    '<div id="content">' +
                      '<div id="siteNotice">' +
                      "</div>" +
                      '<h4 id="firstHeading" class="firstHeading"> <i class="fa fa-building"></i>&nbsp;'+item.Name+' - ' + ruc + '</h4>' +
                      '<div id="bodyContent" class="p-1">' +
                        "<hr><p><i class='fas fa-location-arrow'></i>&nbsp;<b> Dirección: </b>" + JSON.parse(item.GPS).formatted_address + '.'+
                        "<p><i class='fas fa-map-marked-alt'></i>&nbsp;<b> GPS: </b>" + JSON.stringify(JSON.parse(item.GPS).geometry.location) + '.'+
                        // "<p><i class='fa fa-phone'></i>&nbsp;<b> Teléfono: </b>" + item.Phone + '.'+
                        representante +
                        admin +
                        CreatedBy + 
                        UpdatedBy + 
                      "</div>" +
                    "</div>";
                    const infowindow = new google.maps.InfoWindow({
                      content: contentString,
                    });
                    marker.addListener("click", () => {
                      infowindow.close();
                      infowindow.open(this.Map, marker);
                    })
                    // console.log('addin marker');
                    this.Markers.push(marker);
                }
            }
        )
    }
    filters() {
        console.log(this.FilterModel);
        let filterData = '';
        this.FilterModel.forEach((filter) => {
            // console.log(filter);
            filterData += filter;
        })
        console.log(filterData);
        for (let i = 0; i < this.Markers.length; i++) {
            const marker = this.Markers[i];
            if ((filterData.indexOf(marker.getTitle()) > -1)) {
                marker.setMap(this.Map);
            } else {
                marker.setMap(null);
            }

        }
    }
    ngOnInit() {
        this.initMap();
    }

}