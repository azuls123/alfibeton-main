import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../services/usuario.service';
import { IngresoService } from '../../../../services/ingreso.service';
import { Ingreso } from '../../../../models/ingreso.model';
import { ListaIngreso } from '../../../../models/listaIngreso.model';
import { ProductoService } from '../../../../services/producto.service';
import { BodegaService } from '../../../../services/bodega.service';
import { VarianteService } from '../../../../services/variante.service';
import { ListaIngresoService } from '../../../../services/listaIngreso.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crear-ingreso',
  templateUrl: './crear-ingreso.component.html',
  styleUrls: ['./crear-ingreso.component.scss'],
  providers: [UsuarioService, IngresoService, ProductoService, BodegaService, VarianteService, ListaIngresoService]
})
export class CrearIngresoComponent implements OnInit {

  public typeReceived: string = 'all';
  public searchTitleReceived: string = 'Buscar Algo...';
  public searchTextReceived: string;

  public Encargado: boolean = false;

  public SelectedReceived;
  public SelectedBodega;
  public SelectedIngreso;

  public Usuarios: any[];
  public BufferUsuarios: any[];

  public ListaIngresos: ListaIngreso[] = [];

  public NewIngreso: Ingreso

  public Productos: any[] = [];

  public Bodegas: any[] = [];

  public Variantes: any[] = [];


  constructor(
    private _usuarioService: UsuarioService,
    private _ingresoService: IngresoService,
    private _productoService: ProductoService,
    private _bodegaService: BodegaService,
    private _varianteService: VarianteService,
    private _listaIngresoService: ListaIngresoService,
    private location: Location
    ) { 
    let usuario = JSON.parse(localStorage.getItem('Identity'));
    if (usuario && usuario.Role != 'Admin' && usuario.Role != 'Secretario' && usuario.Role != 'Encargado de Bodega' ) {
      this.location.back();
    }
    this.loadUsuarios();
    this.loadBodegas();
    this.loadProductos();
    this.loadVariantes();
    this.initNewIngreso();
    this.initListaIngreso();
  }
  loadSelectedData() {
    this.SelectedIngreso = undefined;
    this.SelectedListaIngreso = undefined;
    if (this.NewIngreso.Bodega && this.NewIngreso.Bodega !=  '') {
      this.SelectedBodega = this.Bodegas.find(bodega => bodega._id == this.NewIngreso.Bodega)
    } else {
      this.SelectedBodega = undefined;
    }
  }
  loadVariantes() {
    this._varianteService.Read().subscribe(
      response=> {
        this.Variantes = response.Variantes;
      }
    )
  }
  loadProductos(){
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
    this.ListaIngresos.splice(i,1);
  }
  addListaIngreso() {
    const tempListaIngreso = {
      _id              : '',
      Ingreso          : '',
      Producto         : '',
      ProductoVariante : '',
      Units            : 0,
      Received         : 'Pendiente',
      UnitsReceiveds   : 0,
      Active           : true
    }
    this.ListaIngresos.push(tempListaIngreso);
  }
  initNewIngreso() {
    const temp: Ingreso = {
      _id : '',
      Number : 0,
      Bodega : '',
      SuggestedTime: '',
      SuggestedDate: '',
      BodegaTraslado : '',
      Estado: 'Pendiente',
      Active : true,
      Received : {
        By : '',
        At : ''
      }
    }
    this.NewIngreso = temp;
    let usuario = JSON.parse(localStorage.getItem('Identity'));
    if (usuario.Role == 'Encargado de Bodega' ) {
      this.NewIngreso.Bodega = usuario.Bodega._id;
      this.Encargado = true;
    }
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
  defineReceived () {
    this.Usuarios = [];
    console.log(this.BufferUsuarios);

    if ( this.searchTextReceived !== '' && this.searchTextReceived != undefined ) {
      for ( const item of this.BufferUsuarios ) {
        const nombre = item.Persona.FirstName.toLowerCase().replace( /[^\w]/gi, '' );
        const apellido = item.Persona.LastName.toLowerCase().replace( /[^\w]/gi, '' );
        const telefono = item.Persona.Phone.replace( /[^\w]/gi, '' );
        const cedula = item.Persona.Ci.replace( /[^\w]/gi, '' );
        let ciudad = item.Persona.City.Name.toLowerCase().replace( /[^\w]/gi, '' );
        let direccion = item.Persona.Address.toLowerCase().replace( /[^\w]/gi, '' );
        direccion = direccion + item.Persona.City.Name.toLowerCase().replace( /[^\w]/gi, '' );
        direccion = direccion + item.Persona.City.Canton.Name.toLowerCase().replace( /[^\w]/gi, '' );
        direccion = direccion + item.Persona.City.Canton.Provincia.Name.toLowerCase().replace( /[^\w]/gi, '' );

        const rol = item.Role.toLowerCase().replace( /[^\w]/gi, '' );
        const mail = item.Email.toLowerCase().replace( /[^\w]/gi, '' );
        let termino = '';
        switch ( this.typeReceived ) {
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
        if ( termino.indexOf( this.searchTextReceived.toLowerCase().replace( /' '/g, '' ) ) > -1 ) {
          this.Usuarios.push( item );
        }
      }
    } else {
      this.Usuarios = this.BufferUsuarios;
      switch ( this.typeReceived ) {
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
    console.log(this.NewIngreso);
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
  public SelectedListaIngreso = [];
  onSubmitList(Ingreso) {
    console.log(this.ListaIngresos);
    const jsonObject = JSON.stringify(this.ListaIngresos);
    this.SelectedListaIngreso = undefined;
    let tempList = [];
    // const jsonSelectedbodega = JSON.stringify(this.SelectedBodega);
    const temp = JSON.parse(jsonObject);
    for (const lista of temp) {
      const tempLista = lista;
      tempLista.Ingreso = Ingreso._id;
      // tempLista.Bodega = Ingreso.Bodega;
      this._listaIngresoService.Create(tempLista).subscribe(
        response => {
          tempList.push(response.ListaIngreso);
        }
      )
    }
    this.SelectedListaIngreso = tempList;
    this.initListaIngreso();
  }

  JSONParse(str): any {
    const Object = JSON.parse(str);
    // console.log(Object);
    
    return Object
  }
}
