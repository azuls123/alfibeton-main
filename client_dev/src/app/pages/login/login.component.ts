import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms'; 
import { EmailValidators } from 'ngx-validators'
import { UsuarioService } from '../../../services/usuario.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [UsuarioService]
})
export class LoginComponent implements OnInit {
  public router: Router;
  public form:FormGroup;
  public Email:AbstractControl;
  public Password:AbstractControl;
  public alert: string;
  public isOn: boolean = true;
  public connected: boolean = false;
  public message: string;
  constructor(router:Router, fb:FormBuilder, private _UsuarioService: UsuarioService, private _location: Location ) {
      this.router = router;
    (localStorage.getItem('Identity') != undefined && localStorage.getItem('Identity') != '' && localStorage.getItem('Token') != undefined && localStorage.getItem('Token') != '' ) ? this._location.back(): this.isOn = false;
      
      this.form = fb.group({
          'Email': ['', Validators.compose([Validators.required, EmailValidators.normal])],
          'Password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      });

      this.Email = this.form.controls['Email'];
      this.Password = this.form.controls['Password'];
  }
  ngOnInit() {
    this._UsuarioService.test().subscribe(
      response => {
        if (response.check) this.connected = true;
        // console.log(response);
        this.message = JSON.stringify(response);
      }, error => {
        console.log(error as any);
        this.message = JSON.stringify(error);
      }
    )
  }
  public onSubmit ( values: Object ): void {
    if ( this.form.valid ) {
        // console.log(values);
        this._UsuarioService.Login(values).subscribe(
            response => {
                this.alert = null;
                // (response.Token) ? Config.Token = response.Token : Config.Token = 'No Token';
                localStorage.setItem('Identity', JSON.stringify(response.Usuario));
                localStorage.setItem('Token', response.Token);
                this.router.navigate(['/']);
                window.location.reload();
                // console.log(response as any);
            },
            error => {
                console.error(error as any);
                (error.status === 404) ? this.alert = 'No se encuentra la Cuenta, intentelo nuevamente' : this.alert = error.error.Message;
            }
        );
    }
}

  ngAfterViewInit(){
      document.getElementById('preloader').classList.add('hide');                 
  }

}
