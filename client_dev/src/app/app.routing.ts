import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router'; 
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { PersonasComponent } from './components/personas/personas.component';
import { LocacionesComponent } from './components/locaciones/locaciones.component';
import { ProductosComponent } from './components/productos/productos.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { EmpresasComponent } from './components/empresas/empresas.component';
import { BodegasComponent } from './components/bodegas/bodegas.component';
import {CrearIngresoComponent} from './components/ingresos/crear-ingreso/crear-ingreso.component';
import {ListaIngresoComponent} from './components/ingresos/lista-ingreso/lista-ingreso.component';
import { CrearTransaccionComponent } from './components/transacciones/crear-transaccion/crear-transaccion.component';
import { ListaTransaccionComponent } from './components/transacciones/lista-transaccion/lista-transaccion.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { CrearPedidoComponent } from './components/pedidos/crear-pedido/crear-pedido.component';
import { ListaPedidoComponent } from './components/pedidos/lista-pedido/lista-pedido.component';
import {MyEmpresaComponent} from './components/empresas/my-empresa/my-empresa.component'
import { MyBodegaComponent } from './components/bodegas/my-bodega/my-bodega.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { ChatComponent } from './components/ingresos/chat/chat.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '', 
    component: PagesComponent,
    children:[
      { path: 'form-elements', loadChildren: () => import('./pages/form-elements/form-elements.module').then(m => m.FormElementsModule), data: { breadcrumb: 'Form Elements' } },
      { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule), data: { breadcrumb: 'Perfil' }  },         
      { path: 'personas', component: PersonasComponent, data: { breadcrumb: 'Control de Personas' } },
      { path: 'locaciones', component: LocacionesComponent, data: { breadcrumb: 'Listado de Locaciones' } },
      { path: 'productos', component: ProductosComponent, data: { breadcrumb: 'Control de Productos' } },
      { path: 'categorias', component: CategoriasComponent, data: { breadcrumb: 'Ingreso de Categorías' } },
      { path: 'usuarios', component: UsuarioComponent, data: { breadcrumb: 'Control de Usuarios' } },
      { path: 'empresas', component: EmpresasComponent, data: { breadcrumb: 'Control de Empresas' } },
      { path: 'bodegas', component: BodegasComponent, data: { breadcrumb: 'Control de Empresas' } },
      { path: '', component: DashboardComponent, data: { breadcrumb: 'AlfiBeton' } },
      // { path: 'chat/:id', component: ChatComponent, data: { breadcrumb: 'Pruebas de Sala de Chat' } },
      { path: 'crear-ingresos', component: CrearIngresoComponent, data: { breadcrumb: 'Solicitud de Ingreso' } },
      { path: 'lista-ingresos', component: ListaIngresoComponent, data: { breadcrumb: 'Lista de Ingresos' } },
      { path: 'crear-transacciones', component: CrearTransaccionComponent, data: { breadcrumb: 'Solicitud de Traslado' } },
      { path: 'lista-transacciones', component: ListaTransaccionComponent, data: { breadcrumb: 'Lista de Traslados' } },
      { path: 'stocks', component: StocksComponent, data: { breadcrumb: 'Inventario' } },
      { path: 'crear-pedidos', component: CrearPedidoComponent, data: { breadcrumb: 'Solicitud de Pedidos' } },
      { path: 'lista-pedidos', component: ListaPedidoComponent, data: { breadcrumb: 'Lista de Pedidos' } },
      { path: 'my-empresa', component: MyEmpresaComponent, data: { breadcrumb: 'Datos de Mi Empresa' } },
      { path: 'my-bodega', component: MyBodegaComponent, data: { breadcrumb: 'Datos de Mi Bodega' } },
    ]
  },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
  { path: '**', component: NotFoundComponent }
]; 

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
    // useHash: true
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }