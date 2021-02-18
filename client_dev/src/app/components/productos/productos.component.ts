// tslint:disable: triple-equals
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Producto } from '../../../models/producto.model';
import { CategoriaService } from '../../../services/categoria.service';
import { ProductoService } from '../../../services/producto.service';
import { Variante } from '../../../models/variante.model';
import { ProductoCategoria } from '../../../models/productoCategoria.model';
import { VarianteService } from '../../../services/variante.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { ProductoCategoriaService } from '../../../services/productoCategoria.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CategoriaService, ProductoService, VarianteService, ProductoCategoriaService]
})
export class ProductosComponent implements OnInit {

  public producto: Producto;
  public productos: any[];
  public bufferProductos: any[];
  public steps: any[];
  public VarianteProductos: any[];
  public np_correcta: boolean;
  public Variantes: Variante[];

  public viewedProducto: any;

  public otherBrand: boolean = false;

  public categoriaProducto: any[];
  public categorias: any[];
  public bufferCategorias: any[];

  public type = 'all';
  public searchTitle = 'Buscar Algo...';
  public searchText: string = '';

  public typeCat = 'all';
  public searchTitleCat = 'Buscar Algo...';
  public searchTextCat: string = '';

  public CategoriesModel: any[];
  public CategoriesOptions: IMultiSelectOption[];

  public Categories: any[];

  public role: string;

  public onChange() {
    // console.log( this.CategoriesModel );
  }

  public myTexts: IMultiSelectTexts = {
    checkAll: 'Todas las Categorias',
    uncheckAll: 'Quitar categorias',
    checked: 'categoria seleccionada',
    checkedPlural: 'categorias seleccionadas',
    searchPlaceholder: 'Buscar',
    searchEmptyResult: 'Sin Resultados...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Elegir Categorias...............',
    allSelected: 'Todo Seleccionado',
  };
  public mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'form-control',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true,
    showCheckAll: true,
    showUncheckAll: true,
  };
  constructor(
    private _categoriaService: CategoriaService,
    private _productoService: ProductoService,
    private _varianteService: VarianteService,
    private _productoCategoria: ProductoCategoriaService,
    private location: Location
  ) {
    const usuario = JSON.parse(localStorage.getItem('Identity'));
    if (usuario && usuario.Role) this.role = usuario.Role;
    if (this.role == 'Encargado de Bodega' || this.role == 'Encargado de Repartidores' || this.role == 'Motorizado') {
      this.location.back();
    }
    this.initProducto();
    this.ReadProducto();
    this.ReadCategorias();
    this.initSteps();
    this.readCatProd();
  }

  readVariantes() {
    this._varianteService.Read().subscribe(
      response => {
        this.VarianteProductos = response.Variantes;
        // console.log(this.VarianteProductos);

      }, error => { console.error(error as any); }
    );
  }
  initVariantes() {
    this.Variantes = [
      { Variante: '', Producto: '', _id: '', Active: true }
    ];
  }
  initCategoria() {
    this.categoriaProducto = [
      { _id: '', Order: '', Categoria: '', Producto: '' }
    ];
  }
  addVariantes() {
    const newColor = { Variante: '', Producto: '', _id: '', Active: true };
    this.Variantes.push(newColor);
  }
  deleteVariantes(i) {
    this.Variantes.splice(i, 1);
  }
  checkCat(id, index, ind): boolean {
    let check = false;
    for (let i = 0; i < this.categoriaProducto.length; i++) {
      const cat = this.categoriaProducto[i];
      if (cat.Categoria == id._id) {
        check = true;
        if (ind == i) {
          check = false;
        }
      } else {
        check = false;
      }
    }
    return check;
  }
  addCat() {
    const newCat = { _id: '', Order: '', Categoria: '', Producto: '' };
    this.categoriaProducto.push(newCat);
  }
  deleteCat(i) {
    this.categoriaProducto.splice(i, 1);
  }
  readCatProd() {
    this._productoCategoria.Read().subscribe(
      response => {
        this.Categories = response.ProductoCategoria;
        // console.log(response);
      }, error => { console.error(error as any); }
    );
  }
  npUnica(nameProd) {
    (!(this.productos.find(prod => (prod.Name == this.producto.Name && this.producto._id != prod._id)))) ? this.np_correcta = true : this.np_correcta = false;
  }
  initSteps() {
    this.steps = [
      { name: 'Información del Producto', icon: 'fa-shopping-cart', active: true, valid: false, hasError: false },
      { name: 'Variaciones y Categorías', icon: 'fa-tag', active: false, valid: false, hasError: false }
    ];
  }
  ngOnInit() {
  }

  ReadProducto() {
    this._productoService.Read().subscribe(
      response => {
        // console.log(response);
        this.productos = response.Productos;
        this.bufferProductos = this.productos;
        this.readVariantes();
      }, error => { console.error(error as any); }
    );
  }
  cleanVariantes() {
    const tempVariantes = [];
    this.Variantes.forEach(color => {
      if (color._id != '') {
        tempVariantes.push(color);
      }
    })
    this.Variantes = tempVariantes;
    this.initVariantes();
  }
  ReadCategorias() {
    this._categoriaService.Read().subscribe(
      response => {
        // console.log(response);\
        this.categorias = response.Categorias;
        this.CategoriesOptions = [];
        for (const cat of response.Categorias) {
          // console.log('inserting');
          const temp: IMultiSelectOption = { id: cat._id, name: cat.Name };
          this.CategoriesOptions.push(temp);
        }
        // console.log(this.CategoriesOptions);
        // this.bufferCategorias = this.categorias;
      }, error => { console.error(error as any); }
    );
  }


  initProducto() {
    this.producto = new Producto(
      '',
      '',
      '',
      '',
      '',
      true
    );
    this.np_correcta = null;
    this.initVariantes();
    this.initCategoria();
  }
  cleanData() {
    this.initVariantes();
    this.initCategoria();
    this.initSteps();
    this.initProducto();
  }
  define() {
    this.productos = [];
    // console.log(this.searchText);

    if (this.searchText !== '' && this.searchText != undefined) {
      for (const item of this.bufferProductos) {
        const nombre = item.Name.toLowerCase().replace(/'[ ]'/g, '');
        const description = item.Description.replace(/'[ ]'/g, '');
        const color = item.Color.replace(/'[ ]'/g, '');
        let termino = '';

        switch (this.type) {
          case 'name':
            this.searchTitle = 'Buscar Nombres...';
            termino = nombre;
            break;
          case 'desc':
            this.searchTitle = 'Buscar Descripción...';
            termino = description;
            break;
          case 'color':
            this.searchTitle = 'Buscar Color...';
            termino = color;
            break;
          case 'categ':
            this.searchTitle = 'Buscar Categoria...';
            termino = description;
            break;
          default:
            this.searchTitle = 'Buscar Algo...';
            termino = nombre + description + color;
            break;
        }
        if (termino.indexOf(this.searchText.toLowerCase().replace(/' '/g, '')) > -1) {
          this.productos.push(item);
        }
      }
    } else {
      this.productos = this.bufferProductos;
      switch (this.type) {
        case 'name':
          this.searchTitle = 'Buscar Nombres...';
          break;
        case 'desc':
          this.searchTitle = 'Buscar Descripción...';
          break;
        case 'color':
          this.searchTitle = 'Buscar Color...';
          break;
        case 'categ':
          this.searchTitle = 'Buscar Categoria...';
          break;
        default:
          this.searchTitle = 'Buscar Algo...';
          break;
      }
    }

  }
  Validating() {
    let check;
    (this.producto.Name == '' || this.producto.Description == '') ? check = false : check = true;
    return check;
  }
  public next() {

    if (this.steps[this.steps.length - 1].active)
      return false;
    // console.log(this.empleado);
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      if (step.name == 'Información del Producto') {
        const validating = this.Validating();

        // console.log(validating);

        if (validating == true) {
          step.active = false;
          step.valid = true;
          // (this.empleado._id != '') ? this.wasClient = true : this.wasClient = false;
          this.steps[i + 1].active = true;
        } else {
          step.hasError = true;
        }
      }
      if (step.name == 'Colores y Categorías') {
        let validating;

        if (validating == true) {
          step.active = false;
          step.valid = true;
          this.steps[i + 1].active = true;
        } else {
          step.hasError = true;
        }
      }
    }
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
  onSubmit() {
    (!this.producto._id) ? this.CreateProducto() : this.UpdateProducto();
  }
  CreateProducto() {
    this._productoService.Create(this.producto).subscribe(
      response => {
        const prod = response.Producto;
        this.onSubmitData(prod);

      }
    )
  }
  cleanEmptyVariant() {
    for (let i = 0; i < this.Variantes.length; i++) {
      const variante = this.Variantes[i];
      if (!variante.Variante || variante.Variante == '') this.Variantes.splice(i, 1);
    }
  }
  onSubmitData(prod) {
    if (prod && prod._id) {
      this.cleanEmptyVariant();
      if (this.Variantes && this.Variantes.length >= 1) {
        for (const variante of this.Variantes) {
          variante.Producto = prod._id
          if (!variante.Variante || variante.Variante == '') {
            variante.Variante = 'Sin Variantes';
          }
          this.onSubmitVariante(variante);
        }
      } else {
        const variante: Variante = { _id: '', Variante: 'Sin Variantes', Producto: prod._id, Active: true }
        this.onSubmitVariante(variante);
      }
      this.onSubmitCategory(prod);
    }
    setTimeout(() => {
      this.ReadProducto();
    }, 350);

  }
  UpdateProducto() {
    this._productoService.Update(this.producto).subscribe(
      response => {
        const prod = response.Producto;
        this.onSubmitData(prod);
      }
    )
  }

  onSubmitCategory(prod) {
    this._productoCategoria.CleanCategories(prod._id).subscribe(
      responseCleanCat => {
        if (this.CategoriesModel.length >= 1) {
          for (let i = 0; i < this.CategoriesModel.length; i++) {
            const category = this.CategoriesModel[i];
            const newCat: ProductoCategoria = { _id: '', Order: (i + 1).toString(), Categoria: category, Producto: prod._id }
            this._productoCategoria.Create(newCat).subscribe(
              responseCreateCat => {
              }
            )
          }
        }
      }
    )
  }

  onSubmitVariante(variante) {
    (variante._id && variante._id != '') ? this.UpdateVariante(variante) : this.CreateVariante(variante);
  }

  CreateVariante(variante) {
    this._varianteService.Create(variante).subscribe(
      response => { }
    );
  }

  UpdateVariante(variante) {
    this._varianteService.Update(variante).subscribe(
      response => { }
    );
  }

  deleteCats() {
    this.CategoriesModel = [];
  }
  Delete(producto) {
    this._productoService.Delete(producto).subscribe(
      response => {
        console.log(response);
        this.ReadProducto();
      }
    )
  }
  public prevCat: any[];
  toUpdate(item) {
    const temporal: string = JSON.stringify(item);
    this.producto = JSON.parse(temporal);
    const tempvariantes = [];
    for (const color of this.VarianteProductos) {
      if (color.Producto._id == item._id) {
        const temporal = JSON.stringify(color);
        tempvariantes.push(JSON.parse(temporal));
      }
    }
    const tempPrev = [];
    const tempCats = [];
    for (const cat of this.Categories) {
      if (cat.Producto._id == item._id) {
        tempCats.push(cat.Categoria._id);
        tempPrev.push(cat);
      }
    }
    let temArray = [];
    const myObj = {};
    tempCats.forEach(el => !(el in myObj) && (myObj[el] = true) && temArray.push(el));
    let temArray2 = [];
    const myObj2 = {};
    tempPrev.forEach(el => !(el in myObj2) && (myObj2[el] = true) && temArray2.push(el));

    this.CategoriesModel = temArray;
    (tempvariantes.length >= 1) ? this.Variantes = tempvariantes : this.initVariantes();
  }
  infoProducto(producto) {
    this.viewedProducto = producto;
  }
  checkProduct(): boolean {
    let check = true;
    if (!this.producto.Name || !this.np_correcta) { check = false; }
    if (!this.producto.Description) check = false;
    if (this.otherBrand && !this.producto.Brand) check = false;
    return check
  }
  getCategoria(id) {
    const cat = this.categorias.find(categoria => categoria._id == id);
    return cat;
  }
}
