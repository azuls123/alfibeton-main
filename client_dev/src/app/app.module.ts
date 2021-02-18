import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { AgmCoreModule } from '@agm/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import * as tslib_1 from 'tslib';
import * as date_fns_2 from 'date-fns'; 
function adapterFactory() {
  return tslib_1.__assign(tslib_1.__assign({}),date_fns_2);
}
import { HttpClientModule } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';
import { PipesModule } from './theme/pipes/pipes.module';

import { AppRoutingModule } from './app.routing';
import { AppSettings } from './app.settings';

import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { HeaderComponent } from './theme/components/header/header.component';
import { FooterComponent } from './theme/components/footer/footer.component';
import { SidebarComponent } from './theme/components/sidebar/sidebar.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { BackTopComponent } from './theme/components/back-top/back-top.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { MessagesComponent } from './theme/components/messages/messages.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { FlagsMenuComponent } from './theme/components/flags-menu/flags-menu.component';
import { SideChatComponent } from './theme/components/side-chat/side-chat.component';
import { FavoritesComponent } from './theme/components/favorites/favorites.component';
import { BlankComponent } from './pages/blank/blank.component';
import { SearchComponent } from './pages/search/search.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { CommonModule, registerLocaleData } from '@angular/common';

import { CKEditorModule } from 'ng2-ckeditor';
import { DirectivesModule } from './theme/directives/directives.module';

// import localePy from '@angular/common/locales/es-PY';
// import localePt from '@angular/common/locales/pt';
// import localeEn from '@angular/common/locales/en';
// import localeEsAr from '@angular/common/locales/es-AR';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);
// registerLocaleData(localePy, 'es');
// registerLocaleData( localePt, 'pt' );
// registerLocaleData( localeEn, 'en' );
// registerLocaleData( localeEsAr, 'es-Ar' );

import { MomentModule } from 'angular2-moment';

import { DragulaModule } from 'ng2-dragula';

// import { AgmDirectionModule } from 'agm-direction';
import { AgmDirectionModule } from 'agm-direction';   // agm-direction
// rutas propias

import {PersonasComponent} from './components/personas/personas.component';
import {LocacionesComponent} from './components/locaciones/locaciones.component';
import {ProductosComponent} from './components/productos/productos.component';
import {CategoriasComponent} from './components/categorias/categorias.component';
import {UsuarioComponent} from './components/usuario/usuario.component';
import {EmpresasComponent} from './components/empresas/empresas.component';
import {BodegasComponent} from './components/bodegas/bodegas.component';
import {IngresosComponent} from './components/ingresos/ingresos.component';
import {CrearIngresoComponent} from './components/ingresos/crear-ingreso/crear-ingreso.component';
import {ListaIngresoComponent} from './components/ingresos/lista-ingreso/lista-ingreso.component';
import {CrearTransaccionComponent} from './components/transacciones/crear-transaccion/crear-transaccion.component';
import {ListaTransaccionComponent} from './components/transacciones/lista-transaccion/lista-transaccion.component';
import {StocksComponent} from './components/stocks/stocks.component';
import {CrearPedidoComponent} from './components/pedidos/crear-pedido/crear-pedido.component';
import {ListaPedidoComponent} from './components/pedidos/lista-pedido/lista-pedido.component';
import {MyEmpresaComponent} from './components/empresas/my-empresa/my-empresa.component'
import {MyBodegaComponent} from './components/bodegas/my-bodega/my-bodega.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';

import {ChatComponent} from './components/ingresos/chat/chat.component';
import { DatePipe } from '@angular/common';

import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({  
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    PerfectScrollbarModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    MultiselectDropdownModule,
    MomentModule,
    NgxChartsModule,
    HttpClientModule,
    CKEditorModule,
    DirectivesModule,
    NgxPaginationModule,
    DragulaModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxJYec4QO29uijPhQDFW4Xbsg9vRAEQLw'
    }),
    AgmDirectionModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ToastrModule.forRoot(), 
    PipesModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    BackTopComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    FlagsMenuComponent,
    SideChatComponent,
    FavoritesComponent,
    BlankComponent,
    SearchComponent,
    NotFoundComponent,
    PersonasComponent,
    LocacionesComponent,
    ProductosComponent,
    CategoriasComponent,
    UsuarioComponent,
    EmpresasComponent,
    BodegasComponent,
    IngresosComponent,
    CrearIngresoComponent,
    ListaIngresoComponent,
    CrearTransaccionComponent,
    ListaTransaccionComponent,
    StocksComponent,
    CrearPedidoComponent,
    ListaPedidoComponent,
    MyEmpresaComponent,
    MyBodegaComponent,
    ChatComponent,
    DashboardComponent
  ],
  providers: [ 
    AppSettings,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: LOCALE_ID, useValue: 'es' },
    DatePipe
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { } 