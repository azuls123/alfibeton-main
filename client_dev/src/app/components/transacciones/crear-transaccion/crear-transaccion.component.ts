import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../services/usuario.service';
import { IngresoService } from '../../../../services/ingreso.service';
import { Ingreso } from '../../../../models/ingreso.model';
import { ProductoService } from '../../../../services/producto.service';
import { BodegaService } from '../../../../services/bodega.service';
import { VarianteService } from '../../../../services/variante.service';
import { ListaIngresoService } from '../../../../services/listaIngreso.service';
import { StockService } from '../../../../services/stock.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crear-transaccion',
  templateUrl: './crear-transaccion.component.html',
  styleUrls: ['./crear-transaccion.component.scss'],
  providers: [UsuarioService, IngresoService, ProductoService, BodegaService, VarianteService, ListaIngresoService, StockService]
})
export class CrearTransaccionComponent implements OnInit {

  public typeReceived: string = 'all';
  public searchTitleReceived: string = 'Buscar Algo...';
  public searchTextReceived: string;

  public SelectedReceived;
  public SelectedBodega;
  public SelectedBodegaTraslado;
  public SelectedIngreso;

  public Usuarios: any[];
  public BufferUsuarios: any[];

  public ListaIngresos: any[] = [];

  public NewIngreso: Ingreso

  public Productos: any[] = [];

  public Bodegas: any[] = [];

  public Variantes: any[] = [];

  public StockByBodegas: any[] = [];

  constructor(
    private _usuarioService: UsuarioService,
    private _ingresoService: IngresoService,
    private _productoService: ProductoService,
    private _bodegaService: BodegaService,
    private _varianteService: VarianteService,
    private _listaIngresoService: ListaIngresoService,
    private _stockService: StockService,
    private location: Location
  ) {
    let usuario = JSON.parse(localStorage.getItem('Identity'));
    if (usuario && usuario.Role != 'Admin' && usuario.Role != 'Secretario') {
      this.location.back();
    }
    this.loadUsuarios();
    this.loadBodegas();
    this.loadProductos();
    this.loadVariantes();
    this.initNewIngreso();
    this.initListaIngreso();
    this.loadStocks();
  }
  loadStocks() {
    this._stockService.Read().subscribe(
      response => {
        console.log();
        this.StockByBodegas = response.StocksGlobal;
        for (let i = 0; i < this.StockByBodegas.length; i++) {
          const stockBodega = this.StockByBodegas[i];
          // console.log(stockBodega);
          response.StocksGlobal.forEach(stock => {
            if (stockBodega.Bodega._id == stock.Bodega) stockBodega.StocksGlobal.push(stock);
          });
        }
      }
    )
  }
  loadSelectedData() {
    if (this.NewIngreso.Bodega && this.NewIngreso.Bodega != '') {
      this.SelectedBodega = this.Bodegas.find(bodega => bodega._id == this.NewIngreso.Bodega);
    }
    if (this.NewIngreso.BodegaTraslado && this.NewIngreso.BodegaTraslado != '') {
      this.SelectedBodegaTraslado = this.Bodegas.find(bodega => bodega._id == this.NewIngreso.BodegaTraslado);
      // console.log(this.SelectedBodegaTraslado);
      this.SetDatas(this.SelectedBodegaTraslado._id);
    }
  }
  SetDatas(bodega) {
    let temp = this.StockByBodegas.find(stock => stock.Bodega._id == bodega);
    this.Variantes = temp.Variantes;
    console.log(this.Variantes);
  }
  getMaxValue(index) {
    for (const variante of this.Variantes) {
      if (variante.Variante._id == this.ListaIngresos[index].ProductoVariante) {
        this.ListaIngresos[index].MaxValue = variante.Units;
      }
    }
  }
  loadVariantes() {
    this._varianteService.Read().subscribe(
      response => {
        // this.Variantes = response.Variantes;
      }
    )
  }
  loadProductos() {
    this._productoService.ReadActive().subscribe(
      response => {
        this.Productos = response.Productos;
      }
    )
  }
  loadBodegas() {
    this._bodegaService.ReadActive().subscribe(
      response => {
        this.Bodegas = response.Bodegas;
      }
    )
  }
  initListaIngreso() {
    this.ListaIngresos = [];
    this.addListaIngreso();
  }
  deleteListaIngreso(i) {
    this.ListaIngresos.splice(i, 1);
  }
  addListaIngreso() {
    const tempListaIngreso = {
      _id: '',
      Ingreso: '',
      Producto: '',
      ProductoVariante: '',
      Units: 0,
      Received: 'Pendiente',
      UnitsReceiveds: 0,
      Active: true
    }
    this.ListaIngresos.push(tempListaIngreso);
  }
  initNewIngreso() {
    const temp: Ingreso = {
      _id: '',
      Number: 0,
      Bodega: '',
      SuggestedTime: '',
      SuggestedDate: '',
      BodegaTraslado: '',
      Estado: 'Pendiente',
      Active: true,
      Received: {
        By: '',
        At: ''
      }
    }
    this.NewIngreso = temp;
  }
  ngOnInit() {
  }

  loadUsuarios() {
    this._usuarioService.Read().subscribe(
      response => {
        // console.log(response);
        this.Usuarios = response.Usuarios;
        this.BufferUsuarios = this.Usuarios;
      }
    )
  }
  defineReceived() {
    this.Usuarios = [];
    console.log(this.BufferUsuarios);

    if (this.searchTextReceived !== '' && this.searchTextReceived != undefined) {
      for (const item of this.BufferUsuarios) {
        const nombre = item.Persona.FirstName.toLowerCase().replace(/'[ ]'/g, '');
        const apellido = item.Persona.LastName.toLowerCase().replace(/'[ ]'/g, '');
        const telefono = item.Persona.Phone.replace(/'[ ]'/g, '');
        const cedula = item.Persona.Ci.replace(/'[ ]'/g, '');
        let ciudad = item.Persona.City.Name.toLowerCase().replace(/'[ ]'/g, '');
        let direccion = item.Persona.Address.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.Persona.City.Name.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.Persona.City.Canton.Name.toLowerCase().replace(/'[ ]'/g, '');
        direccion = direccion + item.Persona.City.Canton.Provincia.Name.toLowerCase().replace(/'[ ]'/g, '');

        const rol = item.Role.toLowerCase().replace(/'[ ]'/g, '');
        const mail = item.Email.toLowerCase().replace(/'[ ]'/g, '');
        let termino = '';
        switch (this.typeReceived) {
          case 'name':
            this.searchTitleReceived = 'Buscar Nombres...';
            termino = nombre;
            break;
          case 'ci':
            this.searchTitleReceived = 'Buscar Cédula...';
            termino = cedula;
            break;
          case 'lastname':
            this.searchTitleReceived = 'Buscar Apellidos...';
            termino = apellido;
            break;
          case 'phone':
            this.searchTitleReceived = 'Buscar Teléfono...';
            termino = telefono;
            break;
          case 'city':
            this.searchTitleReceived = 'Buscar Ciudad...';
            termino = ciudad;
            break;
          case 'address':
            this.searchTitleReceived = 'Buscar Dirección...';
            termino = direccion;
            break;
          case 'mail':
            this.searchTitleReceived = 'Buscar Correo Electrónico...';
            termino = mail;
            break;
          case 'role':
            this.searchTitleReceived = 'Buscar Rol de Usuario...';
            termino = rol;
            break;
          default:
            this.searchTitleReceived = 'Buscar Algo...';
            termino = nombre + apellido + telefono + direccion + cedula + mail + rol;
            break;
        }
        if (termino.indexOf(this.searchTextReceived.toLowerCase().replace(/' '/g, '')) > -1) {
          this.Usuarios.push(item);
        }
      }
    } else {
      this.Usuarios = this.BufferUsuarios;
      switch (this.typeReceived) {
        case 'name':
          this.searchTitleReceived = 'Buscar Nombres...';
          break;
        case 'lastname':
          this.searchTitleReceived = 'Buscar Apellidos...';
          break;
        case 'ci':
          this.searchTitleReceived = 'Buscar Cédula...';
          break;
        case 'phone':
          this.searchTitleReceived = 'Buscar Teléfono...';
          break;
        case 'city':
          this.searchTitleReceived = 'Buscar Ciudad...';
          break;
        case 'address':
          this.searchTitleReceived = 'Buscar Dirección...';
          break;
        case 'mail':
          this.searchTitleReceived = 'Buscar Correo Electrónico...';
          break;
        case 'role':
          this.searchTitleReceived = 'Buscar Rol de Usuario...';
          break;
        default:
          this.searchTitleReceived = 'Buscar Algo...';
          break;
      }
    }
  }

  cleanData() {
    this.initNewIngreso();
    this.initListaIngreso();
  }

  onSubmit() {
    // console.log(this.NewIngreso);
    this._ingresoService.Create(this.NewIngreso).subscribe(
      response => {
        const tempIngreso = response.Ingreso;
        this.SelectedIngreso = tempIngreso;
        this.initNewIngreso();
        if (tempIngreso && tempIngreso._id) {
          this.onSubmitList(tempIngreso);
        }
      }
    )
  }

  onSubmitList(Ingreso) {
    // console.log(this.ListaIngresos);
    const jsonObject = JSON.stringify(this.ListaIngresos)
    const temp = JSON.parse(jsonObject);
    for (const lista of temp) {
      const tempLista = lista;
      tempLista.Ingreso = Ingreso._id;
      // tempLista.Bodega = Ingreso.Bodega;
      if (Ingreso.BodegaTraslado) tempLista.BodegaTraslado = Ingreso.BodegaTraslado;
      this._listaIngresoService.Create(tempLista).subscribe(
        response => {

        }
      )
    }
    this.initListaIngreso();
  }

  clearBodegaTraslado() {
    if (this.NewIngreso.Bodega == this.NewIngreso.BodegaTraslado) this.NewIngreso.BodegaTraslado = '';
  }

}
