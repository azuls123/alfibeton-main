import { Component, PipeTransform, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PersonaService } from '../../../services/persona.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
// import { RoleService } from '../../.././../services/roles.service';
import { Persona } from '../../../models/persona.model';
import { PasswordValidators, EmailValidators, CreditCardValidators, UniversalValidators } from 'ngx-validators';


@Component( {
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: [ './usuario.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  providers: [ PersonaService, UsuarioService]

} )
export class UsuarioComponent {
  public steps: any[];
  public showConfirm: boolean;
  public confirmed: boolean;

  constructor(private formBuilder: FormBuilder) {


    this.steps = [
      { name: 'Cuenta', icon: 'fa-id-badge', active: true, valid: false, hasError: false },
      { name: 'Detalles', icon: 'fa-user', active: false, valid: false, hasError: false }
    ]
  }

  public next() {

    if (this.steps[this.steps.length - 1].active)
      return false;

    this.steps.some(function (step, index, steps) {
      if (index < steps.length - 1) {
        if (step.active) {
          if (step.name == 'Cuenta') {
            // console.log('on next');
            // if (accountForm.valid) {
              step.active = false;
              step.valid = true;
              steps[index + 1].active = true;
              return true;
            // }
            // else {
              // step.hasError = true;
            // }
          }
          if (step.name == 'Detalles') {
            // if (personalForm.valid) {
              step.active = false;
              step.valid = true;
              steps[index + 1].active = true;
              return true;
            // }
            // else {
              // step.hasError = true;
            // }
          }
        }
      }
    });
  }

  public prev() {
    if (this.steps[0].active)
      return false;
    this.steps.some(function (step, index, steps) {
      if (index != 0) {
        if (step.active) {
          step.active = false;
          steps[index - 1].active = true;
          return true;
        }
      }
    });
  }

  public confirm() {
    this.steps.forEach(step => step.valid = true);
    this.confirmed = true;
  }



}
