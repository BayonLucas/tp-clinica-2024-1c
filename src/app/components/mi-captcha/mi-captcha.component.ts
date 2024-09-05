import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MiCaptchaService } from '../../services/mi-captcha.service';
import { Captcha } from '../../models/mi-captcha';
import { take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MiCaptchaReveledDirective } from '../../directives/mi-captcha-reveled.directive';

@Component({
  selector: 'mi-captcha',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule,MatCheckboxModule, MatProgressSpinnerModule, MiCaptchaReveledDirective
  ],
  templateUrl: './mi-captcha.component.html',
  styleUrl: './mi-captcha.component.scss'
})
export class MiCaptchaComponent  implements OnInit{
  private miCaptchaServ:MiCaptchaService = inject(MiCaptchaService);  
  @Output() enviarCaptchaResult = new EventEmitter<boolean>();
  
  deshabilitar:boolean = false;
  loading:boolean = false;
  resultado!:boolean;
  randomCaptcha!:Captcha | null;
  mostrarError: boolean = false;
  intentos = 0;

  form:FormGroup = new FormGroup({
    captcha: new FormControl('', [Validators.required] )
  });

  get captcha(){
    return this.form.get('captcha')!.value;
  }

  async validarCaptcha(){
    this.resultado = false;
    this.mostrarError = false;

    if(this.deshabilitar){
      this.resultado = true;
    }
    else{
      this.loading = true;
      this.resultado = await this.miCaptchaServ.validarRespuestaCaptcha(
        this.randomCaptcha!.id, 
        this.captcha
      ).then( (data) => {
        this.loading = false;
        if (!data) {
          this.intentos++;
          if(this.intentos > 2){
            this.randomCaptcha = null; 
            this.obtenerCaptchaRandom();
            this.intentos = 0;
          }
          
          this.mostrarError = true;
          setTimeout(() => {
            this.mostrarError = false;
            this.form.get('captcha')?.patchValue('');
          }, 1000);
        }
        return data;
      });
    }
    this.enviarCaptchaResult.emit(this.resultado);
  }

  obtenerCaptchaRandom(){
    this.miCaptchaServ.obtenerCaptchas().pipe( take(1) ).subscribe( data => {
      this.randomCaptcha = data[Math.floor( Math.random() * data.length)];
    });
  }


  ngOnInit(): void {
    this.obtenerCaptchaRandom();
  }
}
