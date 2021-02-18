import { Component, OnInit } from '@angular/core';
import { BodegaService } from '../../../../services/bodega.service';
import { IngresoService } from '../../../../services/ingreso.service';
import { ListaIngresoService } from '../../../../services/listaIngreso.service';
import { ProductoService } from '../../../../services/producto.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { VarianteService } from '../../../../services/variante.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lista-ingreso',
  templateUrl: './lista-ingreso.component.html',
  styleUrls: ['./lista-ingreso.component.scss'],
  providers: [UsuarioService, IngresoService, ProductoService, BodegaService, VarianteService, ListaIngresoService]
})
export class ListaIngresoComponent implements OnInit {
  public Ingresos: any[] = [];
  public role: string;
  public ListaIngresos: any[] = [];
  public SelectedIngreso: any;
  public SelectedListaIngreso: any[]=[];
  
  public paginationDataIngresos = {
    id: 'ingresos_tbl',
    itemsPerPage: 10,
    currentPage: 1
  }

  constructor(
    private location: Location,
    private _ingresoService: IngresoService,
    private _listaIngresoService: ListaIngresoService
    ) {
    this.loadIngresos();
  }

  loadIngresos() {
    let usuario = JSON.parse(localStorage.getItem('Identity'));
    this.role = usuario.Role;
    if (usuario && usuario.Role != 'Admin' && usuario.Role != 'Administrador' && usuario.Role != 'Secretario' && usuario.Role != 'Encargado de Bodega' ) {
      this.location.back();
    }
    this._ingresoService.Read().subscribe(
      response => {
        // this.Ingresos = response.Ingresos;
        this.Ingresos = [];
        response.Ingresos.forEach(ingreso => {
          const temp = ingreso;
          // console.log(temp);
          temp.Estado = '';
          // console.log(usuario.Bodega._id, '==', temp.Bodega._id);
          
          if (!temp.BodegaTraslado) {
            if (usuario.Role == 'Encargado de Bodega') {
              if (usuario.Bodega._id == temp.Bodega._id) {
                this.Ingresos.push(temp);
              }              
            } else {
              this.Ingresos.push(temp);
            }
          }
        });
        this.loadListIngresos();
      }
    )
  }
  selectIngreso(ingreso){
    this.SelectedIngreso = ingreso;
    this.SelectedListaIngreso = [];
    for (const listaIngreso of this.ListaIngresos) {
      if (listaIngreso.Ingreso._id == ingreso._id) this.SelectedListaIngreso.push(listaIngreso);
    }
  }

  loadListIngresos() {
    this._listaIngresoService.Read().subscribe(
      response => {
        this.ListaIngresos = response.ListaIngresos;
        this.reloadIngresosEstados();
      }
    )
  }

  reloadIngresosEstados() {
    this.Ingresos.forEach(ingreso => {
      ingreso.Estado = 'Entregado';
      let Units = 0;
      let Received = 0;
      for (const lista of this.ListaIngresos) {
        if (ingreso._id == lista.Ingreso._id) {
          Units += lista.Units;
          Received += lista.UnitsReceiveds;
        }
      }
      if (Received == 0) ingreso.Estado = 'Pendiente'; else
      if (Units > Received) ingreso.Estado = 'Incompleto'; else
      if (Units == Received) ingreso.Estado = 'Completado';
    });
    this.sortByEstado();
  }
  
  ReceiveUnits(listaIngreso) {
    const stringLista = JSON.stringify(listaIngreso);
    const tempLista = JSON.parse(stringLista);

    if (tempLista.UnitsReceiveds == 0) tempLista.Received = 'Pendiente'; else
    if (tempLista.Units > tempLista.UnitsReceiveds) tempLista.Received = 'Incompleto'; else
    if (tempLista.Units == tempLista.UnitsReceiveds) tempLista.Received = 'Completado';

    this._listaIngresoService.Update(tempLista).subscribe(
      response => {
        listaIngreso.Received = response.ListaIngreso.Received;
        // console.log(response.ListaIngreso);
        this.reloadIngresosEstados();
        
      }
    )

  }

  ngOnInit() {
  }

  public EstadoAsc: boolean = true;
  public OrderAsc: boolean = true;
  public BodegaAsc: boolean = true;
  public DateAsc: boolean = true;
  sortByEstado() {
    if (this.EstadoAsc) {
      this.Ingresos.sort(function (a,b) {
        if (a.Estado == 'Pendiente' && ( b.Estado == 'Incompleto' ||  b.Estado == 'Completado')) return -1
        if (a.Estado == 'Incompleto' && b.Estado == 'Completado') return -1
        if (a.Estado == 'Incompleto' && b.Estado == 'Pendiente') return 1
        if (a.Estado == 'Completado' && (b.Estado == 'Pendiente' || b.Estado == 'Incompleto')) return 1
        if (a.Estado == b.Estado ) return 0
      })
    } else {
      this.Ingresos.sort(function (a,b) {
        if (a.Estado == 'Pendiente' && ( b.Estado == 'Incompleto' ||  b.Estado == 'Completado')) return 1
        if (a.Estado == 'Incompleto' && b.Estado == 'Completado') return 1
        if (a.Estado == 'Incompleto' && b.Estado == 'Pendiente') return -1
        if (a.Estado == 'Completado' && (b.Estado == 'Pendiente' || b.Estado == 'Incompleto')) return -1
        if (a.Estado == b.Estado ) return 0
      })
    }
  }
  sortByDate() {
    if (this.DateAsc) {
      this.Ingresos.sort(function (a,b) {
        if (a.SuggestedTime == b.SuggestedTime) return 0
        if (a.SuggestedTime == 'Mañana') return -1
        if (a.SuggestedTime == 'Medio Día' && b.SuggestedTime == 'Mañana') return 1
        if (a.SuggestedTime == 'Medio Día') return -1
        if (a.SuggestedTime == 'Tarde' && (b.SuggestedTime == 'Mañana' || b.SuggestedTime == 'Medio Día')) return 1
        if (a.SuggestedTime == 'Tarde' && b.SuggestedTime == 'Noche') return -1
        if (a.SuggestedTime == 'Noche') return 1
        return 0
      })
      this.Ingresos.sort(function (a,b) {
        if (a.SuggestedDate > b.SuggestedDate) return 1
        if (a.SuggestedDate < b.SuggestedDate) return -1
        return 0
      })
    } else {
      this.Ingresos.sort(function (a,b) {
        if (a.SuggestedTime == b.SuggestedTime) return 0
        if (a.SuggestedTime == 'Mañana') return 1
        if (a.SuggestedTime == 'Medio Día' && b.SuggestedTime == 'Mañana') return -1
        if (a.SuggestedTime == 'Medio Día') return 1
        if (a.SuggestedTime == 'Tarde' && (b.SuggestedTime == 'Mañana' || b.SuggestedTime == 'Medio Día')) return -1
        if (a.SuggestedTime == 'Tarde' && b.SuggestedTime == 'Noche') return 1
        if (a.SuggestedTime == 'Noche') return -1
        return 0
      })
      this.Ingresos.sort(function (a,b) {
        if (a.SuggestedDate > b.SuggestedDate) return -1
        if (a.SuggestedDate < b.SuggestedDate) return 1
        return 0
      })
    }
  }
  sortByBodega() {
    if (this.BodegaAsc) {
      this.Ingresos.sort(function (a,b) {
        if (a.Bodega.Name > b.Bodega.Name) return 1
        if (a.Bodega.Name < b.Bodega.Name) return -1
        return 0
      })
    } else {
      this.Ingresos.sort(function (a,b) {
        if (a.Bodega.Name > b.Bodega.Name) return -1
        if (a.Bodega.Name < b.Bodega.Name) return 1
        return 0
      })
    }
  }
  sortByOrder() {
    if (this.OrderAsc) {
      this.Ingresos.sort(function (a,b) {
        if (a.Number > b.Number) return 1
        if (a.Number < b.Number) return -1
        return 0
      })
    } else {
      this.Ingresos.sort(function (a,b) {
        if (a.Number > b.Number) return -1
        if (a.Number < b.Number) return 1
        return 0
      })
    }
  }
}
