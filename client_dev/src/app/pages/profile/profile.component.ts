import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public identity;
  constructor(private router: Router) { 
    this.identity = JSON.parse(localStorage.getItem('Identity'));
    if (this.identity == null || this.identity == undefined || this.identity == '') this.router.navigate(['/login']);

  }

  ngOnInit() {
  }

}
