import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  
  public productos = [{ name:'Productos en Venta', value:0}];
  public ProductoBgColor = { domain: ['#2F3E9E'] };

  public Personas = [{ name:'Clientes', value:47588 }];
  public PersonasBgColor = { domain: ['#D22E2E'] };

  public Usuarios = [{ name:'Usuarios', value:189730 }];
  public UsuariosBgColor = { domain: ['#378D3B'] };

  public Categorias = [{ name:'Categorías', value:52470, extra: { format: 'currency' } }];
  public CategoriasBgColor = { domain: ['#0096A6'] };

  public Empresas = [{ name:'Empresas', value:75296 }];
  public EmpresasBgColor = { domain: ['#606060'] };

  public Bodegas = [{ name:'Bodegas', value:75296 }];
  public BodegasBgColor = { domain: ['#cccc00'] };

  public Pedidos = [{ name:'Pedidos', value:216279 }];
  public PedidosBgColor = { domain: ['#F47B00'] };

  public Ingresos = [{ name:'Ingresos', value:216279 }];
  public IngresosBgColor = { domain: ['#9292ff'] };


  public infoLabelFormat(c): string {
    switch(c.data.name) {
      case 'Productos en Venta':
        return `<i class="fa fa-shopping-cart mr-2"></i>${c.label}`;
      case 'Clientes':
        return `<i class="fa fa-users mr-2"></i>${c.label}`;
      case 'Usuarios':
        return `<i class="fa fa-id-badge mr-2"></i>${c.label}`;
      case 'Categorías':
        return `<i class="fa fa-tags mr-2"></i>${c.label}`;
      case 'Bodegas':
        return `<i class="fa fa-industry mr-2"></i>${c.label}`;
      case 'Empresas':
        return `<i class="fa fa-building mr-2"></i>${c.label}`;
      case 'Pedidos':
        return `<i class="fa fa-briefcase mr-2"></i>${c.label}`;
      case 'Ingresos':
        return `<i class="fa fa-briefcase mr-2"></i>${c.label}`;
      default:
        return c.label;
    }
  }

  public infoValueFormat(c): string {
    switch(c.data.extra ? c.data.extra.format : '') {
      case 'currency':
        return `\$${Math.round(c.value).toLocaleString()}`;
      case 'percent':
        return `${Math.round(c.value * 100)}%`;
      default:
        return c.value.toLocaleString();
    }
  }

  public previousShowMenuOption:boolean;
  public previousMenuOption:string;
  public previousMenuTypeOption:string;
  public settings: Settings;
  constructor(public appSettings:AppSettings, private router: Router) {    
    this.settings = this.appSettings.settings;
    this.initPreviousSettings();
  }

  public onSelect(event) {
    // console.log(event);
    switch (event.name) {
      case "Productos en Venta":
        this.router.navigate(['/productos']);
        break;
      case "Clientes":
        this.router.navigate(['/productos']);
        break;
      case "Usuarios":
        this.router.navigate(['/usuarios']);
        break;
      case "Categorías":
        this.router.navigate(['/categorias']);
        break;
      case "Empresas":
        this.router.navigate(['/empresas']);
        break;
      case "Bodegas":
        this.router.navigate(['/bodegas']);
        break;
      case "Pedidos":
        this.router.navigate(['/lista-pedidos']);
        break;
      case "Ingresos":
        this.router.navigate(['/lista-ingresos']);
        break;
    }
  }



  public ngDoCheck() {
    if(this.checkAppSettingsChanges()) {
      setTimeout(() => this.productos = [...this.productos] ); 
      setTimeout(() => this.Personas = [...this.Personas] ); 
      setTimeout(() => this.Usuarios = [...this.Usuarios] ); 
      setTimeout(() => this.Categorias = [...this.Categorias] ); 
      setTimeout(() => this.Empresas = [...this.Empresas] ); 
      setTimeout(() => this.Pedidos = [...this.Pedidos] ); 
      setTimeout(() => this.Ingresos = [...this.Ingresos] ); 
      this.initPreviousSettings();
    }
  }

  public checkAppSettingsChanges(){
    if(this.previousShowMenuOption != this.settings.theme.showMenu ||
      this.previousMenuOption != this.settings.theme.menu ||
      this.previousMenuTypeOption != this.settings.theme.menuType){
      return true;
    }
    return false;
  }

  public initPreviousSettings(){
    this.previousShowMenuOption = this.settings.theme.showMenu;
    this.previousMenuOption = this.settings.theme.menu;
    this.previousMenuTypeOption = this.settings.theme.menuType;
  }


}
