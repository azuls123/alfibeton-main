import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: [ './ingresos.component.scss' ],
} )
export class IngresosComponent implements OnInit {

  user = {
    name: ''
  };

  constructor (
  ) {
  }

  ngOnInit () {

  }

}
