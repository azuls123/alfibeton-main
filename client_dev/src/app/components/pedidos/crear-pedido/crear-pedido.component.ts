import { Component, OnInit } from '@angular/core';
import { BodegaService } from '../../../../services/bodega.service';
import { PersonaService } from '../../../../services/persona.service';
import { Pedido } from '../../../../models/pedido.model';
import { ListaPedido } from '../../../../models/ListaPedido.model';
// import { ProvinciaService } from '../../../../services/provincia.service';
import { EmpresaService } from '../../../../services/empresa.service';
import { ProductoService } from '../../../../services/producto.service';
import { VarianteService } from '../../../../services/variante.service';
import { StockService } from '../../../../services/stock.service';
import { PedidoService } from '../../../../services/pedido.service';
import { ListaPedidoService } from '../../../../services/listaPedido.service';
import { } from 'googlemaps';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.scss'],
  providers: [
    PersonaService, 
    BodegaService, 
    // ProvinciaService, 
    EmpresaService, 
    ProductoService,
    VarianteService,
    StockService,
    PedidoService,
    ListaPedidoService,
  ]
})
export class CrearPedidoComponent implements OnInit {

  public currPosition;
  public viewedCurrPosition;

  public SelectedClient: any;
  public SelectedBodega: any;

  public typeClient: string = 'all';
  public searchTitleClient: string = 'Buscar Algo...';
  public searchTextClient: string;

  public clientes:any[] = [];
  public bufferClientes: any[] = [];

  public Bodegas: any[] = [];

  public NewPedido: Pedido;
  public listaPedidos: any[];
  
  public Provincia='';
  public Canton='';
  public Provincias: any[];
  public Cantones: any[] = [];
  public Parroquias: any[] = [];
  public BufferCantones: any[];
  public BufferParroquias: any[];

  public Empresas: any[] = [];
  public SelectedEmpresa;

  public Productos: any[] = [];
  public Variantes: any[] = [];
  constructor(
    private _PersonaService: PersonaService,
    private _bodegaService: BodegaService,
    // private _ProvinciaService: ProvinciaService,
    private _empresaService: EmpresaService,
    private _ProductoService: ProductoService,
    private _VarianteService: VarianteService,
    private _stockService: StockService,
    private _PedidoService: PedidoService,
    private _ListaPedidoService: ListaPedidoService
    ) { 
    this.loadPersonas();
    this.loadStocks();
    this.loadEmpresas();
    this.loadProductos();
    this.initNewPedido();
    // this.LoadLocations();
    this.initListaPedido();
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
        this.NewPedido.GPS = JSON.stringify(this.currPosition);
        this.NewPedido.Address = this.currPosition.formatted_address;
      }
    );
    (document.getElementById("setNewPosition") as HTMLElement).addEventListener(
      "click",
      () => {
        // this.MyAddressMarker.setMap = null;
        this.NewPedido.GPS = this.SelectedClient.GPS;
        this.NewPedido.Address = this.SelectedClient.Address;
        const currPosition = JSON.parse(this.NewPedido.GPS);
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        const marker = new google.maps.Marker({
          map: map,
          position: currPosition.geometry.location,
        });
        map.setCenter(marker.getPosition() as google.maps.LatLng);
        markers.push(marker)
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
  JSONStringify(obj): any {
    const String = JSON.stringify(obj);
    // console.log(String);
    
    return String
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

  loadStocks() {
    this._stockService.Read().subscribe(
      response => {
        // console.group('Stocks');
        // console.log(response.StocksGlobal);
        this.Bodegas = response.StocksGlobal;
        for (let i = 0; i < this.Bodegas.length; i++) {
          const stockBodega = this.Bodegas[i];
          // console.log(stockBodega);
          response.StocksGlobal.forEach(stock => {
            if (stockBodega.Bodega._id == stock.Bodega) stockBodega.StocksGlobal.push(stock);
          });
        }
        // console.log(this.Bodegas);
        // console.groupEnd( );
      }
    )
  }
  loadProductos() {
    this._ProductoService.Read().subscribe(
      response => {
        this.Productos = response.Productos;
        this.loadVariantes();
      }
    )
  }

  getMaxValue(listaPedido): number {
    let maxValue = 999999;
    this.SelectedBodega.Variantes.forEach(Variante => {
      // console.log(Variante.Variante._id +  "==" + listaPedido.ProductoVariante);
      if (Variante.Variante._id == listaPedido.ProductoVariante && !Variante.Variante.Producto.Brand) {
        maxValue = Variante.Units;
      }
    })

    return maxValue;
  }
  loadVariantes() {
    this._VarianteService.Read().subscribe(
      response => {
        // this.Variantes = response.Variantes;
        this.Variantes = [];
        response.Variantes.forEach(variante => {
          if (variante.Producto.Brand && (variante.Producto.Brand != '' || variante.Producto.Brand != 'Alfibeton')) {
            this.Variantes.push(variante);
          }
        })
      }
    )
  }

  loadEmpresas() {
    this._empresaService.ReadActive().subscribe(
      response => {
        this.Empresas = response.Empresas;
      }
    )
  }
  cleanData() {
    this.SelectedBodega = undefined;
    this.SelectedClient = undefined;
    this.Canton = '';
    this.Provincia = '';
    this.initNewPedido();
    this.initListaPedido();
  }
  public bufferSelectedBodega;
  public bufferSelectedClient;
  loadSelectedData() {
    this.bufferSelectedBodega = this.SelectedBodega;
    this.bufferSelectedClient = this.SelectedClient;
  }
  RecalculateTotales() {
    let SubTotal = 0;
    let TotalDiscount = 0;
    let Total = 0;
    this.listaPedidos.forEach((listaPedido)=> {
      SubTotal += listaPedido.ValueIdeal;
      TotalDiscount += listaPedido.TotalDiscount;
      Total += listaPedido.FinalValueProx;
    });
    this.NewPedido.SubTotal = SubTotal;
    this.NewPedido.TotalDiscount = TotalDiscount;
    this.NewPedido.Total = Total;
  }
  public SelectedPedido;
  onSubmit() {
    this._PedidoService.Create(this.NewPedido).subscribe(
      response => {
        const tempPedido = response.Pedido;
        if (tempPedido && response.Pedido) {
          this.SelectedPedido = tempPedido;
          this.initNewPedido();
          if (tempPedido && tempPedido._id) {
            this.onSubmitList(tempPedido);
          }
        }
      }
    )
  }
  SetValues(listaPedido) {
    listaPedido.UnitsProx = listaPedido.UnitsFree + listaPedido.UnitsSell
    listaPedido.ValueIdeal = listaPedido.UnitsSell * listaPedido.ValueByUnits
    listaPedido.TotalDiscount = listaPedido.Discount + ((listaPedido.Percent / 100) * listaPedido.ValueIdeal ); 
    listaPedido.FinalValueProx = listaPedido.ValueIdeal - listaPedido.TotalDiscount;
    this.RecalculateTotales()
  }
  onSubmitList(Pedido) {
    const jsonObject = JSON.stringify(this.listaPedidos);
    const temp = JSON.parse(jsonObject);

    for (const lista of temp) {
      const tempLista = lista;
      tempLista.Pedido = Pedido._id;
      this._ListaPedidoService.Create(tempLista).subscribe(response => {});
    }
    this.initListaPedido();
  }
  setCurrentEmpresa() {
    this.Empresas.forEach(empresa => {
      if (empresa._id == this.NewPedido.Deliverer) {
        this.SelectedEmpresa = empresa;
      }
    })
  }

  initListaPedido() {
    this.listaPedidos = [];
    this.addListaPedido();
  }

  addListaPedido() {
    const listaPedido: any = {
      _id                  : '',
      Pedido               : '',
      Producto             : '',
      ProductoVariante     : '',
      UnitsSell            : 0,
      UnitsFree            : 0,
      Units                : 0,
      UnitsProx            : 0,
      ValueByUnits         : 0,
      Discount             : 0,
      Percent              : 0,
      ValueIdeal           : 0,
      TotalDiscount        : 0,
      UnitsBack            : 0,
      OrderCode            : '',
      Received             : 'Pendiente',
      Delivered            : {
        By: undefined,
        At: undefined
      },
      FinalValue           : 0,
      FinalValueProx       : 0,
    }
    this.listaPedidos.push(listaPedido)
  }

  deleteProductoOfList(index) {
    this.listaPedidos.splice(index, 1);
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
  //   this.NewPedido.City = '';
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
  //   if (this.Parroquias.length == 1) this.NewPedido.City = this.Parroquias[0]._id;
  // }
  initNewPedido() {
    const temp = {
      _id                          : '',
      Number                       : 0,
      Client                       : '',
      OrderDate                    : '',
      OrderTime                    : '',
      DeliveryTime                 : '',
      DeliveryTimeReplace          : '',
      GPS                          : '',
      City                         : '',
      Address                      : '',
      AddedBy                      : '',
      Bodega                       : '',
      State                        : '',
      Total                        : 0,
      SubTotal                     : 0,
      TotalDiscount                : 0,
      TotalProdSell                : 0,
      TotalProdFree                : 0,
      SendCost                     : 0,
      Comments                     : '',
      FindedBy                     : '',
      ContactedBy                  : '',
      Deliverer                    : '',
      DeliveredBy                  : '',
      Image                        : '',
      Active                       : true,
    }
    this.NewPedido = temp;
  }

  SelectCurrentBodega() {
    this.Bodegas.forEach(bodega => {
      if (bodega.Bodega._id == this.NewPedido.Bodega) {
        this.SelectedBodega = bodega;
      }
    });
  }

  ngOnInit(): void {
    jQuery('.tt').tooltip({
      sanitize: false,
      sanitizeFn: function (content) {
        return null;
      }
    });
    jQuery('.tt').tooltip({
      sanitize: false,
      sanitizeFn: function (content) {
        return null;
      }
    });
    jQuery('.pp').popover({
      sanitize: false,
      sanitizeFn: function (content) {
        return null;
      }
    });
}
  loadBodegas() {
    this._bodegaService.Read().subscribe(
      response => {
        this.Bodegas = response.Bodegas;
      }
    )
  }
  loadPersonas() {
    this._PersonaService.Read().subscribe(
      response => {
        const temp = JSON.stringify(response.Personas);
        this.clientes = JSON.parse(temp);
        this.bufferClientes = this.clientes;
        // console.log(this.clientes);

      },
      error => {
        console.error(error as any);
      }
    );
  }

  defineClient() {
    this.clientes = [];
    // console.log(this.searchText);

    if (this.searchTextClient !== '' && this.searchTextClient != undefined) {
      for (const item of this.bufferClientes) {
        const nombre = item.FirstName.toLowerCase().replace(/[^\w]/gi, '');
        const apellido = item.LastName.toLowerCase().replace(/[^\w]/gi, '');
        const telefono = item.Phone.replace(/[^\w]/gi, '');
        const cedula = item.Ci.replace(/[^\w]/gi, '');
        // let ciudad = item.City.Name.toLowerCase().replace(/[^\w]/gi, '');
        // let direccion = item.Address.toLowerCase().replace(/[^\w]/gi, '');
        // direccion = direccion + item.City.Name.toLowerCase().replace(/[^\w]/gi, '');
        // direccion = direccion + item.City.Canton.Name.toLowerCase().replace(/[^\w]/gi, '');
        // direccion = direccion + item.City.Canton.Provincia.Name.toLowerCase().replace(/[^\w]/gi, '');
        let termino = '';
        switch (this.typeClient) {
          case 'name':
            this.searchTitleClient = 'Buscar Nombres...';
            termino = nombre;
            break;
          case 'ci':
            this.searchTitleClient = 'Buscar Cédula...';
            termino = cedula;
            break;
          case 'lastname':
            this.searchTitleClient = 'Buscar Apellidos...';
            termino = apellido;
            break;
          case 'phone':
            this.searchTitleClient = 'Buscar Teléfono...';
            termino = telefono;
            break;
          // case 'city':
          //   this.searchTitleClient = 'Buscar Ciudad...';
          //   termino = ciudad;
            // break;
          // case 'address':
          //   this.searchTitleClient = 'Buscar Dirección...';
          //   termino = direccion;
          //   break;
          default:
            this.searchTitleClient = 'Buscar Algo...';
            termino = nombre + apellido + telefono + cedula;
            break;
        }
        if (termino.indexOf(this.searchTextClient.toLowerCase().replace(/' '/g, '')) > -1) {
          this.clientes.push(item);
        }
      }
    } else {
      this.clientes = this.bufferClientes;
      switch (this.typeClient) {
        case 'name':
          this.searchTitleClient = 'Buscar Nombres...';
          break;
        case 'lastname':
          this.searchTitleClient = 'Buscar Apellidos...';
          break;
        case 'ci':
          this.searchTitleClient = 'Buscar Cédula...';
          break;
        case 'phone':
          this.searchTitleClient = 'Buscar Teléfono...';
          break;
        // case 'city':
        //   this.searchTitleClient = 'Buscar Ciudad...';
        //   break;
        case 'address':
          this.searchTitleClient = 'Buscar Dirección...';
          break;
        default:
          this.searchTitleClient = 'Buscar Algo...';
          break;
      }
    }
  }

  checkListaPedido(): boolean{
    let check = true;
    for (const lista of this.listaPedidos) {
        
    }
    return true;
  }

}
