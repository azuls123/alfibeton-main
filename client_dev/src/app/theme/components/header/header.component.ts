import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { trigger,  state,  style, transition, animate } from '@angular/animations';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ],
  animations: [
    trigger('showInfo', [
      state('1' , style({ transform: 'rotate(180deg)' })),
      state('0', style({ transform: 'rotate(0deg)' })),
      transition('1 => 0', animate('400ms')),
      transition('0 => 1', animate('400ms'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  public showHorizontalMenu:boolean = true; 
  public showInfoContent:boolean = false;
  public settings: Settings;
  public menuItems:Array<any>;

  public muted: boolean = false;

  public identity;
  public editRole: boolean = false;
  constructor(
    public appSettings:AppSettings, 
    public menuService:MenuService, 
    private router: Router,
    private location: Location
    ) {
      this.settings = this.appSettings.settings;
      this.menuItems = this.menuService.getHorizontalMenuItems();
      this.identity = JSON.parse(localStorage.getItem('Identity'));
      if (sessionStorage["muted"]) this.muted = sessionStorage['muted'];
      if (this.identity == null || this.identity == undefined || this.identity == '') this.router.navigate(['/login']);
  }
  updateRole() {
    let usuario = JSON.parse(localStorage.getItem('Identity'));
    usuario.Role = this.identity.Role;
    localStorage.removeItem('Identity');
    localStorage.setItem('Identity', JSON.stringify(usuario));
    window.location.reload();
  }
  ngOnInit() {
    if(window.innerWidth <= 768) 
      this.showHorizontalMenu = false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);      

  }
  
  public closeSubMenus(){
    let menu = document.querySelector("#menu0"); 
    if(menu){
      for (let i = 0; i < menu.children.length; i++) {
          let child = menu.children[i].children[1];
          if(child){          
              if(child.classList.contains('show')){            
                child.classList.remove('show');
                menu.children[i].children[0].classList.add('collapsed'); 
              }             
          }
      }
    }
  }

  public muting () {
    this.muted = !this.muted;
    sessionStorage["muted"] = this.muted;        
  }

  @HostListener('window:resize')
  public onWindowResize():void {
     if(window.innerWidth <= 768){
        this.showHorizontalMenu = false;
        // sessionStorage["header"] = this.settings.theme.navbarIsFixed;        

     }      
      else{
        this.showHorizontalMenu = true;
      }
  }
  
}
