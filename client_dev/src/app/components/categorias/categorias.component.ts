import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CategoriaService]

})
export class CategoriasComponent {
  public categoria: Categoria;
  public categorias: any[];
  public bufferCategorias: any[];
  public viewedCategoria: any;
  public type: string = 'all';
  public searchTitle: string = 'Buscar Algo...';
  public searchText: string;
  public cp_correcta: boolean;
  public role: string;

  public paginationDataCategorias = {
    id: 'categorias_tbl',
    itemsPerPage: 10,
    currentPage: 1
  }

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _CategoriaService: CategoriaService,
    private location: Location
  ) {
    const usuario = JSON.parse(localStorage.getItem('Identity'));
    if (usuario && usuario.Role) this.role = usuario.Role;
    if (this.role == 'Encargado de Bodega' || this.role == 'Encargado de Repartidores' || this.role == 'Motorizado') {
      this.location.back();
    }
    this.initCategoria();
    this.Read();
  }
  Read() {
    this._CategoriaService.Read().subscribe(
      response => {
        // console.log(response);

        this.categorias = response.Categorias;
        this.bufferCategorias = this.categorias;
      },
      error => { console.error(error as any); }
    )
  }
  toUpdate(CategoriaItem) {
    const temp = JSON.stringify(CategoriaItem);
    this.categoria = JSON.parse(temp);
  }
  initCategoria() {
    this.categoria = new Categoria(
      '',
      '',
      '',
      true
    )
  }
  define() {
    this.categorias = [];
    // console.log(this.searchText);

    if (this.searchText !== '' && this.searchText != undefined) {
      for (const item of this.bufferCategorias) {
        const nombre = item.Name.toLowerCase().replace(/'[ ]'/g, '');
        const description = item.Description.replace(/'[ ]'/g, '');
        let termino = '';

        switch (this.type) {
          case 'name':
            this.searchTitle = 'Buscar Nombres...';
            termino = nombre;
            break;
          case 'description':
            this.searchTitle = 'Buscar Descripción...';
            termino = description;
            break;
          default:
            this.searchTitle = 'Buscar Algo...';
            termino = nombre + description;
            break;
        }
        if (termino.indexOf(this.searchText.toLowerCase().replace(/' '/g, '')) > -1) {
          this.categorias.push(item);
        }
      }
    } else {
      this.categorias = this.bufferCategorias;
      switch (this.type) {
        case 'name':
          this.searchTitle = 'Buscar Nombres...';
          break;
        case 'description':
          this.searchTitle = 'Buscar Descripción...';
          break;
        default:
          this.searchTitle = 'Buscar Algo...';
          break;
      }
    }

  }

  onSubmit() {
    (this.categoria._id != null && this.categoria._id !== '') ? this.Update() : this.Create();

  }
  Update() {
    this._CategoriaService.Update(this.categoria).subscribe(
      response => {
        this.Read();
        this.initCategoria();
      },
      error => {
        console.error(error as any);

      }
    )
  }
  cpUnica(Name) {
    this.cp_correcta = true;
    if (this.categoria._id == '') {
      for (const categorias of this.categorias) {
        const npBD = categorias.Name;
        console.log(npBD);
        if (npBD == Name) {
          this.cp_correcta = false;
        }
      }
    }
    console.log(this.cp_correcta);
    
    return this.cp_correcta;
  }
  Create() {
    this._CategoriaService.Create(this.categoria).subscribe(
      response => {
        this.Read();
        this.initCategoria();
      },
      error => {
        console.error(error as any);

      }
    )
  }
  Delete(categoria) {
    console.log(categoria);
    let temp = JSON.stringify(categoria);
    let DelCat = JSON.parse(temp);
    (DelCat.Active) ? DelCat.Active = false: DelCat.Active = true;
    this._CategoriaService.Update(DelCat).subscribe(
      response => {
        // console.log(response.Message);
        categoria = response.Categorial;
        this.Read();
      }
    ) 
  }
}
