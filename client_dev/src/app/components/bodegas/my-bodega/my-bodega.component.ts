import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BodegaService } from '../../../../services/bodega.service';

@Component({
  selector: 'app-my-bodega',
  templateUrl: './my-bodega.component.html',
  styleUrls: ['./my-bodega.component.scss'],
  providers: [BodegaService]
})
export class MyBodegaComponent implements OnInit {
  public edit: boolean = false;
  public MyBodega: any;
  public BufferBodega: any;
  constructor(
    private location: Location,
    private _bodegaService: BodegaService
  ) { 
    this.initBodega();
  }

  ngOnInit() {
  }

  initBodega() {
    
    let usuario = JSON.parse(localStorage.getItem('Identity'));
    if (usuario && usuario.Bodega) {
      this.MyBodega = usuario.Bodega;
      this.BufferBodega = usuario.Bodega;
    } else {
      this.location.back();
    }
  }
  onSubmit() {
    this._bodegaService.Update(this.MyBodega).subscribe(
      response => {
        let usuario = JSON.parse(localStorage.getItem('Identity'));
        usuario.Bodega = this.MyBodega;
        localStorage.removeItem('Identity');
        localStorage.setItem('Identity', JSON.stringify(usuario));
        this.BufferBodega = this.MyBodega;
      }
    )
  }

}
