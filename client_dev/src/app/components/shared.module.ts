import { NgModule } from '@angular/core';
import { CambiarPasswordComponent } from '../components/cambiar-password/cambiar-password.component'

@NgModule({
  declarations: [
    CambiarPasswordComponent
  ],
  exports: [
    CambiarPasswordComponent
  ]
})
export class SharedModule { }
