import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserMenuComponent implements OnInit {
  public usuario: any;
  constructor(public router: Router) {
    this.usuario = JSON.parse(localStorage.getItem('Identity'));
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);      

  }
  ngOnInit() {
  }

}
