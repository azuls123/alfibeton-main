import { Component, OnInit } from '@angular/core';
import { ListaPedidoService } from '../../../../services/listaPedido.service';
import { PedidoService } from '../../../../services/pedido.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { Location } from '@angular/common';
import { } from 'googlemaps';

@Component({
  selector: 'app-lista-pedido',
  templateUrl: './lista-pedido.component.html',
  styleUrls: ['./lista-pedido.component.scss'],
  providers: [
    PedidoService,
    ListaPedidoService,
    UsuarioService
  ]
})
export class ListaPedidoComponent implements OnInit {

  public Pedidos: any[] = [];
  public ListaPedidos: any[] = [];
  public viewedCurrPosition;
  public role: string;

  public SelectedPedido: any;
  public SelectedListaPedido: any[];

  public EstadoAsc: boolean = true;
  public OrderAsc: boolean = true;
  public BodegaAsc: boolean = true;
  public DateAsc: boolean = true;
  public Usuarios: any[] = [];
  public BufferUsuarios: any[] = [];

  public typeUsers: string = 'all';
  public searchTitleUsers: string = 'Buscar Algo...';
  public searchTextUsers: string = '';

  public RouteWayPoints: google.maps.DirectionsWaypoint[] = [];

  public DirectionService: google.maps.DirectionsService;
  public DirectionsRenderer: google.maps.DirectionsRenderer;

  public Geocoder: google.maps.Geocoder;

  public InfoWindow: google.maps.InfoWindow;
  public Markers: google.maps.Marker[] = [];
  public Marker: google.maps.Marker;
  public Map: google.maps.Map;

  constructor(
    private location: Location,
    private _PedidoService: PedidoService,
    private _ListaPedidoService: ListaPedidoService,
    private _usuarioService: UsuarioService,
  ) {
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
    // let CreatedBy = '';
    // let UpdatedBy = '';
    // if (this.viewedBodega.Created.By) {
    //   CreatedBy = 
    //   "<hr><p><i class='fa fa-save'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Ingresado por: </b> " + this.viewedBodega.Created.By.Persona.FirstName + " " + this.viewedBodega.Created.By.Persona.LastName + " - (" + this.viewedBodega.Created.By.Email + ") <p>"+
    //   "<p><i class='fa fa-save'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Ingresado El: </b> "+ this.datePipe.transform((parseInt(this.viewedBodega.Created.At) * 1000), 'medium') +" <p>";
    // }
    // if (this.viewedBodega.Updated.By) {
    //   UpdatedBy = 
    //   "<hr><p><i class='fa fa-edit'></i>&nbsp;<i class='fa fa-user'></i>&nbsp; <b>Actualizado por: </b> " + this.viewedBodega.Updated.By.Persona.FirstName + " " + this.viewedBodega.Updated.By.Persona.LastName + " - (" + this.viewedBodega.Updated.By.Email + ") <p>"+
    //   "<p><i class='fa fa-edit'></i>&nbsp;<i class='fas fa-calendar-alt'></i>&nbsp;  <b>Actualizado El: </b> "+ this.datePipe.transform((parseInt(this.viewedBodega.Updated.At) * 1000), 'medium') +" <p>";
    // }
    // const contentString = 
    // '<div id="content">' +
    //   '<div id="siteNotice">' +
    //   "</div>" +
    //   '<h4 id="firstHeading" class="firstHeading"> <i class="fa fa-industry"></i>&nbsp;'+this.viewedBodega.Name+'</h4>' +
    //   '<div id="bodyContent" class="p-1">' +
    //     "<hr><p><i class='fas fa-location-arrow'></i>&nbsp;<b> Dirección: </b>" + this.viewedCurrPosition.formatted_address + '.'+
    //     "<p><i class='fas fa-map-marked-alt'></i>&nbsp;<b> GPS: </b>" + JSON.stringify(this.viewedCurrPosition.geometry.location) + '.'+
    //     "<p><i class='fa fa-phone'></i>&nbsp;<b> Teléfono: </b>" + this.viewedBodega.Phone + '.'+
    //     CreatedBy + 
    //     UpdatedBy + 
    //   "</div>" +
    // "</div>";
    // const infowindow = new google.maps.InfoWindow({
    //   content: contentString,
    // });
    const marker = new google.maps.Marker({
      map: map,
      position: this.viewedCurrPosition.geometry.location,
    });
    // infowindow.open(map, marker);
    marker.addListener("click", () => {
      // infowindow.close();
      // infowindow.open(map, marker);
    })
    map.setCenter(marker.getPosition() as google.maps.LatLng);
    markers.push(marker);

  }

  JSONParse(str): any {
    const Object = JSON.parse(str);
    // console.log(Object);

    return Object
  }
  JSONStringify(obj): any {
    const String = JSON.stringify(obj);
    // console.log(String);

    return String
  }
  loadPedidos() {
    let usuario = JSON.parse(localStorage.getItem('Identity'));
    this.role = usuario.Role;
    const InfoWindow = new google.maps.InfoWindow()
    if (usuario && usuario.Role != 'Admin' && usuario.Role != 'Administrador' && usuario.Role != 'Secretario' && usuario.Role != 'Encargado de Repartidores' && usuario.Role != 'Motorizado') {
      this.location.back();
    }
    this._PedidoService.Read().subscribe(
      response => {
        this.Pedidos = [];
        for (const pedido of response.Pedidos) {
          if (this.role == 'Encargado de Repartidores' && pedido.Deliverer && pedido.Deliverer._id == usuario.Empresa._id) {
            this.Pedidos.push(pedido)
          } else if (this.role == 'Motorizado' && pedido.DeliveredBy && pedido.DeliveredBy._id == usuario._id) {
            this.Pedidos.push(pedido);
          } else if (usuario.Role == 'Admin' || usuario.Role == 'Administrador' || usuario.Role == 'Secretario') {
            this.Pedidos.push(pedido);
          }
        }
        if (this.Pedidos.length >= 2) {
          for (let i = 0; i < (this.Pedidos.length) - 1; i++) {
            const item = this.Pedidos[i];

          }
        }
        let iMax = this.Pedidos.length - 1;
        // console.log(this.position.coords);
        this.DirectionsRenderer.setMap(this.Map);
        this.DirectionService.route(
          {

            // origin: 'Puyo, Ecuador',
            origin: this.Marker.getPosition(),
            // destination: "Urdaneta, Guayaquil, Ecuador",
            destination: JSON.parse(this.Pedidos[iMax].GPS).geometry.location,
            waypoints: this.RouteWayPoints,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true,

          },
          (response, status) => {
            if (status === "OK") {
              var setDisplay = new google.maps.InfoWindow();
              var myRoute = response.routes[0].legs[0];
              // agregar puntos de ruta extras
              myRoute.start_address = '<i class="fa fa-user"></i>&nbsp;Mi Ubicación';
              let content = '<i class="fas fa-truck-loading"></i>&nbsp;Pedido Número: '+this.Pedidos[iMax].Number + '. <br>Estado: ';
              if (this.Pedidos[iMax].State == 'Pendiente') content += '<span class="badge badge-danger"> ' + this.Pedidos[iMax].State + ' </span>'
              if (this.Pedidos[iMax].State == 'Incompleto') content += '<span class="badge badge-warning"> ' + this.Pedidos[iMax].State + ' </span>'
              if (this.Pedidos[iMax].State == 'Completado') content += '<span class="badge badge-success"> ' + this.Pedidos[iMax].State + ' </span>'
              // console.log(this.Pedidos[iMax]);
              
              myRoute.end_address = content;
              for (let i = 0; i < myRoute.steps.length; i++) {
                let marker = (myRoute[i] = myRoute[i] || new google.maps.Marker());
                // marker.setMap(this.Map);
                marker.setMap(null);
                marker.setPosition(myRoute.steps[i].start_location);
                marker.addListener("click", () => {
                  const content = 'marker content?'
                  setDisplay.setContent(myRoute.steps[i].instructions);
                  setDisplay.open(this.Map, marker)
                })
              }
              this.DirectionsRenderer.setDirections((response));
            } else {
              window.alert("Directions request failed due to " + status);
            }
          }
        )
        // this.Pedidos = response.Pedidos;
        this.loadListaPedidos();
      }
    )
  }
  loadListaPedidos() {
    this._ListaPedidoService.Read().subscribe(
      response => {
        this.ListaPedidos = [];
        this.ListaPedidos = response.ListaPedidos;
        this.reloadPedidoStates();
      }
    )
  }
  reloadPedidoStates() {
    this.Pedidos.forEach(pedido => {
      pedido.State = 'Entregado';
      let Units = 0;
      let Received = 0;
      for (const lista of this.ListaPedidos) {
        if (pedido._id == lista.Pedido._id) {
          Units += lista.UnitsProx;
          Received += lista.Units;
        }
      }
      if (Received == 0 && pedido.DeliveredBy) pedido.State = 'Pendiente'; else
        if (Units > Received && pedido.DeliveredBy) pedido.State = 'Incompleto'; else
          if (Units == Received && pedido.DeliveredBy) pedido.State = 'Completado'; else
            if (!pedido.DeliveredBy) pedido.State = 'En Espera de Repartidor'
    })
  }
  ngOnInit() {
    this.loadRouteMap();
  }

  sortByOrder() {
    if (this.OrderAsc) {
      this.Pedidos.sort(function (a, b) {
        if (a.Number > b.Number) return 1
        if (a.Number < b.Number) return -1
        return 0
      })
    } else {
      this.Pedidos.sort(function (a, b) {
        if (a.Number > b.Number) return -1
        if (a.Number < b.Number) return 1
        return 0
      })
    }
  }
  sortByEstado() {
    if (this.EstadoAsc) {
      this.Pedidos.sort(function (a, b) {
        if (a.State == b.State) return 0

        if (a.State == 'En Espera de Repartidor' && b.State != 'En Espera de Repartidor') return -1;
        if (a.State == 'Pendiente' && b.State == 'En Espera de Repartidor') return 1;
        if (a.State == 'Pendiente' && b.State != 'En Espera de Repartidor') return -1;
        if (a.State == 'Incompleto' && b.State == 'Completado') return -1;
        if (a.State == 'Incompleto' && b.State != 'Completado') return 1;
        if (a.State == 'Completado') return 1;
      })
    } else {
      this.Pedidos.sort(function (a, b) {
        if (a.State == b.State) return 0

        if (a.State == 'En Espera de Repartidor' && b.State != 'En Espera de Repartidor') return 1;
        if (a.State == 'Pendiente' && b.State == 'En Espera de Repartidor') return -1;
        if (a.State == 'Pendiente' && b.State != 'En Espera de Repartidor') return 1;
        if (a.State == 'Incompleto' && b.State == 'Completado') return 1;
        if (a.State == 'Incompleto' && b.State != 'Completado') return -1;
        if (a.State == 'Completado') return -1;
      })
    }
  }
  sortByDate() {
    if (this.DateAsc) {
      this.Pedidos.sort(function (a, b) {
        if (a.SuggestedTime == b.SuggestedTime) return 0
        if (a.SuggestedTime == 'Mañana') return -1
        if (a.SuggestedTime == 'Medio Día' && b.SuggestedTime == 'Mañana') return 1
        if (a.SuggestedTime == 'Medio Día') return -1
        if (a.SuggestedTime == 'Tarde' && (b.SuggestedTime == 'Mañana' || b.SuggestedTime == 'Medio Día')) return 1
        if (a.SuggestedTime == 'Tarde' && b.SuggestedTime == 'Noche') return -1
        if (a.SuggestedTime == 'Noche') return 1
        return 0
      })
      this.Pedidos.sort(function (a, b) {
        if (a.SuggestedDate > b.SuggestedDate) return 1
        if (a.SuggestedDate < b.SuggestedDate) return -1
        return 0
      })
    } else {
      this.Pedidos.sort(function (a, b) {
        if (a.SuggestedTime == b.SuggestedTime) return 0
        if (a.SuggestedTime == 'Mañana') return 1
        if (a.SuggestedTime == 'Medio Día' && b.SuggestedTime == 'Mañana') return -1
        if (a.SuggestedTime == 'Medio Día') return 1
        if (a.SuggestedTime == 'Tarde' && (b.SuggestedTime == 'Mañana' || b.SuggestedTime == 'Medio Día')) return -1
        if (a.SuggestedTime == 'Tarde' && b.SuggestedTime == 'Noche') return 1
        if (a.SuggestedTime == 'Noche') return -1
        return 0
      })
      this.Pedidos.sort(function (a, b) {
        if (a.SuggestedDate > b.SuggestedDate) return -1
        if (a.SuggestedDate < b.SuggestedDate) return 1
        return 0
      })
    }
  }
  sortByBodega() {
    if (this.BodegaAsc) {
      this.Pedidos.sort(function (a, b) {
        if (a.Bodega.Name > b.Bodega.Name) return 1
        if (a.Bodega.Name < b.Bodega.Name) return -1
        return 0
      })
    } else {
      this.Pedidos.sort(function (a, b) {
        if (a.Bodega.Name > b.Bodega.Name) return -1
        if (a.Bodega.Name < b.Bodega.Name) return 1
        return 0
      })
    }
  }
  public changeDeliveredBy: boolean = false;
  selectPedido(pedido) {
    this.SelectedPedido = pedido;
    this.SelectedListaPedido = [];
    for (const lista of this.ListaPedidos) {
      if (lista.Pedido._id == pedido._id) this.SelectedListaPedido.push(lista);
    }
    if (this.SelectedPedido.DeliveredBy) {
      this.changeDeliveredBy = false;
      this.SelectedDeliveredBy = this.SelectedPedido.DeliveredBy;
    } else {
      this.changeDeliveredBy = true;
    }
    this.loadUsers(this.SelectedPedido.Deliverer._id);

    this.viewedCurrPosition = JSON.parse(pedido.GPS);
    setTimeout(() => {
      this.initInfoMap();
    }, 500);
  }
  public SelectedDeliveredBy;
  ReceiveUnits(lista) {
    const listaStr = JSON.stringify(lista);
    const ListaJson = JSON.parse(listaStr);
    if (ListaJson.Units == 0) ListaJson.Received = 'Pendiente'; else
      if (ListaJson.UnitsProx > ListaJson.Units) ListaJson.Received = 'Incompleto'; else
        if (ListaJson.UnitsProx == ListaJson.Units) ListaJson.Received = 'Completado';

    this._ListaPedidoService.Update(ListaJson).subscribe(
      response => {
        lista.Received = response.ListaPedido.Received;
        // console.log(response.ListaIngreso);
        this.reloadPedidoStates();

      }
    )
  }
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
        // let ciudad = item.Persona.City.Name.toLowerCase().replace(/'[ ]'/g, '');
        let direccion = item.Persona.Address.toLowerCase().replace(/'[ ]'/g, '');
        let myAddress = this.JSONParse(item.Persona.GPS);

        if (myAddress && myAddress.address_components.length >= 1) {
          direccion = direccion + myAddress.address_components[0].long_name;
          direccion = direccion + myAddress.address_components[1].long_name;
          direccion = direccion + myAddress.address_components[2].long_name;
          direccion = direccion + myAddress.address_components[3].long_name;
          if (myAddress.address_components[4]) direccion = direccion + myAddress.address_components[4].long_name;
          if (myAddress.address_components[5]) direccion = direccion + myAddress.address_components[5].long_name;
          if (myAddress.address_components[6]) direccion = direccion + myAddress.address_components[6].long_name;
        }
        // direccion = direccion + item.Persona.City.Name.toLowerCase().replace(/'[ ]'/g, '');
        // direccion = direccion + item.Persona.City.Canton.Name.toLowerCase().replace(/'[ ]'/g, '');
        // direccion = direccion + item.Persona.City.Canton.Provincia.Name.toLowerCase().replace(/'[ ]'/g, '');
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
  loadUsers(empresa) {
    this._usuarioService.ReadMotorizados(empresa).subscribe(
      response => {
        this.Usuarios = response.Usuarios;
        this.BufferUsuarios = response.Usuarios;
      }
    )
  }
  savePedido() {
    this._PedidoService.Update(this.SelectedPedido).subscribe(
      response => {
        console.log(this.SelectedPedido, 'saving...', response);
        this.reloadPedidoStates();
      }
    )
  }
  GetAccess(pedido): boolean {
    let check = true;
    if (pedido.State == 'En Espera de Repartidor') check = false;
    if (this.role == 'Administrador' || this.role == 'Motorizado') check = false;
    return check;
  }
  public position;
  loadRouteMap() {
    this.DirectionService = new google.maps.DirectionsService();
    this.DirectionsRenderer = new google.maps.DirectionsRenderer();
    this.Geocoder = new google.maps.Geocoder();
    this.InfoWindow = new google.maps.InfoWindow();
    this.Map = new google.maps.Map(
      document.getElementById("routeMap") as HTMLDivElement,
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
    navigator.geolocation.getCurrentPosition(position => {
      this.position = position
      this.Marker = new google.maps.Marker({
        map: null,
        title: 'Mi Posición Actual',
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
      this.loadPedidos();
    })
  }
  public pedidoToDelete;
  public delMsg = {
    class: '',
    message: ''
  }
  public confirmPassword = {
    id: '',
    Password: ''
  };
  deletePedido(pedido) {
    this.confirmPassword.id = pedido._id;
    
    this._PedidoService.Delete(this.confirmPassword).subscribe(
      response => {
        console.group('borrado');
        for (const lista of this.ListaPedidos) {
          if (lista.Pedido == this.confirmPassword.id) {
            console.log(response);
            this._ListaPedidoService.Delete(lista._id).subscribe(
              response => {
                console.log(response);
                if (response.status == 200) {
                  this.delMsg = {
                    class: 'danger',
                    message: response.Message
                  } 
                }
              }, error => {
                console.warn(error as any);
                if (error.status == 500 || error.status == 404) {
                  this.delMsg = {
                    class: 'danger',
                    message: error.error.Message
                  } 
                }
              }
            )
          }
        }
        console.groupEnd();
      }, error => {
        console.group('errores');
        console.warn(error as any);
        if (error.status == 500 || error.status == 403) {
          this.delMsg = {
            class: 'danger',
            message: error.error.Message
          } 
        }
        console.groupEnd();
      }
    )
  }
  deleteButtonAccess(pedido) {
    let check
    if (pedido.State == 'Pendiente' || pedido.State == 'En Espera de Repartidor')
    return check
  }
}
