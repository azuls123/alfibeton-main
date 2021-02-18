import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PagesComponent implements OnInit {
    public showMenu:boolean = false;
    public showSetting:boolean = false;
    public menus = ['vertical', 'horizontal'];
    public menuOption:string;
    public menuTypes = ['default', 'compact', 'mini'];
    public menuTypeOption:string;
    
    public settings: Settings;
    constructor(public appSettings:AppSettings, public router:Router){        
        this.settings = this.appSettings.settings; 
        if(sessionStorage["skin"]) {
            this.settings.theme.skin = sessionStorage["skin"];
        } 
        if (sessionStorage["menu"]) {
            this.settings.theme.menu = sessionStorage["menu"];
        }
        if (sessionStorage["menuType"]) {
            this.settings.theme.menuType = sessionStorage["menuType"];
        }
        if (sessionStorage["header"]) {
            let temp: boolean;
            (sessionStorage["header"] == 'true') ? temp = true: temp = false 
            this.settings.theme.navbarIsFixed = temp
        }     
        if (sessionStorage["sidebar"]) {
            let temp: boolean;
            (sessionStorage["sidebar"] == 'true') ? temp = true: temp = false    
            this.settings.theme.sidebarIsFixed = temp
        }     
        if (sessionStorage["footer"]) {
            let temp: boolean;
            (sessionStorage["footer"] == 'true') ? temp = true: temp = false            
            this.settings.theme.footerIsFixed = temp
        }     
    }

    ngOnInit() {        
        if(window.innerWidth <= 768){
            this.settings.theme.showMenu = false;
            this.settings.theme.sideChatIsHoverable = false;
        }
        this.showMenu = this.settings.theme.showMenu;
        this.menuOption = this.settings.theme.menu;
        this.menuTypeOption = this.settings.theme.menuType;           
    }

    public chooseMenu(menu){
        this.settings.theme.menu = menu; 
        sessionStorage["menu"] = menu;    
        // this.router.navigate(['/']);      
    }

    public chooseMenuType(menuType){
        this.settings.theme.menuType = menuType;
        sessionStorage["menuType"] = menuType;    
        jQuery('.menu-item-link').tooltip({
            sanitize: false,
            sanitizeFn: function (content) {
                return null;
            }
        });
        if(menuType=='mini'){
            jQuery('.menu-item-link').tooltip('enable');
        }else{
            jQuery('.menu-item-link').tooltip('disable');
        }
    }

    public changeTheme(theme){
        this.settings.theme.skin = theme;
        sessionStorage["skin"] = theme;        
    }
 
    ngAfterViewInit(){
        document.getElementById('preloader').classList.add('hide');
    }


    @HostListener('window:resize')
    public onWindowResize():void {
        let showMenu= !this._showMenu();

        if (this.showMenu !== showMenu) {
            this.showMenuStateChange(showMenu);
        }
        this.showMenu = showMenu;
    }

    public showMenuStateChange(showMenu:boolean):void {
        this.settings.theme.showMenu = showMenu;
    }

    private _showMenu():boolean {
        return window.innerWidth <= 768;
    }

    FixMenu() {
        sessionStorage["header"] = this.settings.theme.navbarIsFixed;        
        sessionStorage["sidebar"] = this.settings.theme.sidebarIsFixed;        
        sessionStorage["footer"] = this.settings.theme.footerIsFixed;        

    }
    FixHeader () {
        this.settings.theme.navbarIsFixed = !this.settings.theme.navbarIsFixed;
        sessionStorage["header"] = this.settings.theme.navbarIsFixed;        
    }
    FixSidebar () {
        this.settings.theme.sidebarIsFixed = !this.settings.theme.sidebarIsFixed;
        sessionStorage["sidebar"] = this.settings.theme.sidebarIsFixed;        
    }
    FixFooter () {
        this.settings.theme.footerIsFixed = !this.settings.theme.footerIsFixed;
        sessionStorage["footer"] = this.settings.theme.footerIsFixed;        
    }

}
