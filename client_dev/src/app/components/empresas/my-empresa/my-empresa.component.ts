import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../../../models/empresa.model';
import { EmpresaService } from '../../../../services/empresa.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-my-empresa',
  templateUrl: './my-empresa.component.html',
  styleUrls: ['./my-empresa.component.scss'],
  providers: [EmpresaService]
})
export class MyEmpresaComponent {
  public edit: boolean = false;
  public MyEmpresa: any;
  public BufferEmpresa: any;

  constructor(
    private _empresaService: EmpresaService,
    private location: Location
  ) {
    this.initEmpresa();
  }
  initEmpresa() {
    let usuario = JSON.parse(localStorage.getItem('Identity'));
    if (usuario && usuario.Empresa) {
      this.MyEmpresa = usuario.Empresa;
      this.BufferEmpresa = usuario.Empresa;
    } else {
      this.location.back();
    }
  }

  onSubmit() {
    this._empresaService.Update(this.MyEmpresa).subscribe(
      response => {
        let usuario = JSON.parse(localStorage.getItem('Identity'));
        usuario.Empresa = this.MyEmpresa;
        localStorage.removeItem('Identity');
        localStorage.setItem('Identity', JSON.stringify(usuario));
        this.BufferEmpresa = this.MyEmpresa;
      }
    )
  }

}
