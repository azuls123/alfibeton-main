import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StockService } from '../../../services/stock.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss'],
  providers: [StockService],
  encapsulation: ViewEncapsulation.None
})
export class StocksComponent implements OnInit {

  public stocks: any[] =[];
  public StockByBodegas: any[] =[];

  public usuario: any

  public SelectedBodega;
  public SelectedVariante;

  constructor(
    private _stockService: StockService,
    private location: Location
  ) { 
    this.usuario = JSON.parse(localStorage.getItem('Identity'));
    if (this.usuario && this.usuario.Role != 'Admin' && this.usuario.Role != 'Administrador' && this.usuario.Role != 'Secretario' && this.usuario.Role != 'Encargado de Bodega' ) {
      this.location.back();
    }
    this.loadStocksByBodegas();
  }
  loadStocksByBodegas() {
    this.StockByBodegas = [];
    this.loadStocks();
  }
  loadStocks() {
    this._stockService.ReadActive().subscribe(
      response => {
        // console.log();
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

  ngOnInit() {
  }

}
