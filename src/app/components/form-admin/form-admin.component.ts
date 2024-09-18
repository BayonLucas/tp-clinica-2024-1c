import { Component, Input, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmarClaveValidator } from '../../Validators/password.validator';
import { confirmarEspecialidadRequired } from '../../Validators/especialidad.validator';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { StoreService } from '../../services/store.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../models/usuario';
import { StorageService } from '../../services/storage.service';
// import { CaptchaService } from '../../services/captcha.service';
import { MiCaptchaComponent } from '../mi-captcha/mi-captcha.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'form-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, NgxCaptchaModule, NgbToast, MiCaptchaComponent, TranslateModule
  ],
  templateUrl: './form-admin.component.html',
  styleUrl: './form-admin.component.scss'
})
export class FormAdminComponent implements OnInit{
  private authServ:AuthService = inject(AuthService);
  private storeServ: StoreService = inject(StoreService);
  private storageServ:StorageService = inject(StorageService);
  // private captchaServ:CaptchaService = inject(CaptchaService);
  private router:Router = inject(Router);

  private rol:string = 'admin';
  private captchaResolve:boolean = false;
  @Input() redirectTo!:string; 
  @Input() titulo:string = '¡Bienvenido Dr/a.!';
  @Input() subtitulo:string = 'Por favor, complete con los datos del nuevo Admin:';

  siteKey:string = '6Lck9_IpAAAAAFP6_aqAjymCuu56-Rky52ed3Jfx';
  especialidades:string[] = [];
  error: string = '';
  
  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    edad: new FormControl('', [Validators.required, Validators.min(18), Validators.max(85)]),
    dni: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
    email: new FormControl('', [Validators.required, Validators.email, /*Validators.pattern()*/]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
    confirmPassword: new FormControl('', [Validators.required,/*Validators.pattern()*/]),
    // recaptcha: new FormControl('', [Validators.required]),
  }, {
    validators: [
      confirmarClaveValidator(), 
    ]
  });
  
  get nombre(){
    return this.form.get('nombre')?.value;
  }
  get apellido(){
    return this.form.get('apellido')?.value;
  }
  get edad(){
    return this.form.get('edad')?.value;
  }
  get dni(){
    return this.form.get('dni')?.value;
  }
  get email(){
    return this.form.get('email')?.value;
  }
  get password(){
    return this.form.get('password')?.value;
  }

  obtenerResultCaptcha(event:any){
    this.captchaResolve = event;
    if(event){
      this.error = '';
    }
  }

  async registrar(){
    this.error = '';
    if(!this.captchaResolve){
      this.error = 'Debe resolver el captcha';
    }
    if(this.form.valid && this.captchaResolve){
      const result = await this.authServ.crearCuentaDeTerceros(this.email, this.password);

      const nuevoUsuario = <Usuario>{
        uid: result,
        email: this.email,
        password: this.password,
        dni: this.dni,
        rol: this.rol,
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        adminValidation: true
      }
      this.storeServ.setUsuario(nuevoUsuario);
      this.authServ.validarCorreo(this.email);

      await Swal.fire({
        position: "center",
        icon: "success",
        title: `Bienvenido ${nuevoUsuario.nombre}`,
        showConfirmButton: false,
        timer: 2500 
      });
      this.router.navigateByUrl(this.redirectTo);
    }
    else{
      this.form.markAllAsTouched()
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Ocurrió un problema. Intentelo nuevamente",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
  
  ngOnInit(): void {
  }
}