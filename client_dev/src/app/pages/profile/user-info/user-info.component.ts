import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';

import {PersonaService} from '../../../../services/persona.service';
import {Persona} from '../../../../models/persona.model'
import { UsuarioService } from '../../../../services/usuario.service';
import {Usuario} from '../../../../models/usuario.model'


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  providers: [PersonaService, UsuarioService]
})
export class UserInfoComponent implements OnInit {
  public personalForm:FormGroup;
  public identity;
  public passwords = {
    _id: '',
    newPassword: '',
    oldPassword: ''
  }
  constructor(private formBuilder: FormBuilder, private _personaService: PersonaService, private _UsuairoService: UsuarioService) {
    this.passwords.newPassword = "";
    this.passwords.oldPassword = "";
   }

  ngOnInit() {
    this.identity = JSON.parse(localStorage.getItem('Identity'));
    this.personalForm = this.formBuilder.group({
      // 'salutation': [''],
      'FirstName': [this.identity.Persona.FirstName, Validators.required],
      'LastName': [this.identity.Persona.LastName, Validators.required],
      // 'gender': [''],
      'Email': [this.identity.Email, Validators.compose([Validators.required, emailValidator])],
      'Phone': [this.identity.Persona.Phone, Validators.required],
      // 'zipcode': ['', Validators.required],
      // 'City': [this.identity.Persona.City, Validators.required],
      'Ci' : [this.identity.Persona.Ci, Validators.compose([Validators.required, ciValidator])],
      'Address' : [this.identity.Persona.Address, Validators.required]
    });
  }

  public onSubmit(values:any):void {
    const usuario = JSON.parse(localStorage.getItem('Identity'))
    const persona = usuario.Persona;
    const newPersona: Persona = new Persona(
      persona._id,
      values.Ci ,
      values.FirstName,
      values.LastName,
      values.Phone ,
      // values.City,
      values.Address,  
      values.GPS,  
      true,
      false,
      false,
      persona.Created,
      persona.Updated
    );
    this._personaService.Update(newPersona).subscribe(
      response => {
        console.log(response);
        if (response.Persona) {
          usuario.Persona = response.Persona;
          localStorage.setItem('Identity', JSON.stringify(usuario));
        }
      }
    )
    // const newUsuario: Usuario = new Usuario(
    //   usuario.id,
    //   null    ,
    //   values.Email        ,
    //   null      ,
    //   null         ,
    //   null    ,
    //   null   ,
    //   null     ,
    //   true
    // );
    
    if (this.personalForm.valid) {
        // this.router.navigate(['pages/dashboard']);
    }
  }

  changePassword(oldPassword: string, newPassword: string) {
    // console.log(oldPassword, newPassword);
    const Passwords = {
      _id : this.identity._id,
      oldPassword : oldPassword,
      newPassword : newPassword
    }
    this._UsuairoService.changePasswords(Passwords).subscribe(
      response => {
        console.log(response);
        
      }
    )
  }
  checkPasswords(newPassword: string, confirmPassword: string): boolean {
    let check = false;
    if (newPassword != '' && confirmPassword != '') {
      (newPassword == confirmPassword) ? check = true: check = false; 
    } else {
      check = false;
    } 
    return check;
  }

}

export function emailValidator(control: FormControl): {[key: string]: any} {
  var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;    
  if (control.value && !emailRegexp.test(control.value)) {
      return {invalidEmail: true};
  }
}
export function ciValidator(control: FormControl): {[key: string]: any} {
  var ciRegexp = /[0-9]{10,13}/;    
  if (control.value && !ciRegexp.test(control.value)) {
      return {invalidCi: true};
  }
}
