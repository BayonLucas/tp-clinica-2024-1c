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

import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HorarioService } from '../../services/horario.service';

// import { CaptchaService } from '../../services/captcha.service';

@Component({
  selector: 'form-especialista',
  standalone: true,
  imports: [ 
    ReactiveFormsModule, CommonModule, NgxCaptchaModule, NgbToast, MatFormFieldModule, MatSelectModule,
  ],
  templateUrl: './form-especialista.component.html',
  styleUrl: './form-especialista.component.scss'
})
export class FormEspecialistaComponent implements OnInit {
  private authServ:AuthService = inject(AuthService);
  private storeServ: StoreService = inject(StoreService);
  private storageServ:StorageService = inject(StorageService);
  private horarioServ:HorarioService = inject(HorarioService);
  // private captchaServ:CaptchaService = inject(CaptchaService);
  private router:Router = inject(Router);

  private rol:string = 'especialista';
  private fotoCargada!:any;
  private captchaResolve:boolean = false;
  @Input() redirectTo!:string; 
  @Input() titulo:string = '¡Bienvenido Dr/a.!';
  @Input() subtitulo:string = 'Por favor, complete con sus datos:';

  siteKey:string = '6Lck9_IpAAAAAFP6_aqAjymCuu56-Rky52ed3Jfx';
  especialidades:string[] = [];
  error: string = '';
  
  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    edad: new FormControl('', [Validators.required, Validators.min(18), Validators.max(85)]),
    dni: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
    especialidad: new FormControl('', []),
    email: new FormControl('', [Validators.required, Validators.email, /*Validators.pattern()*/]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
    confirmPassword: new FormControl('', [Validators.required,/*Validators.pattern()*/]),
    fotoPerfil: new FormControl('', [Validators.required]),
    recaptcha: new FormControl('', [Validators.required]),
  }, {
    validators: [
      confirmarClaveValidator(), 
      confirmarEspecialidadRequired(),
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
  get especialidad(){
    return this.form.get('especialidad')?.value;
  }
  get email(){
    return this.form.get('email')?.value;
  }
  get password(){
    return this.form.get('password')?.value;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoCargada = file;
    }
  }

  resolve(event:any){
    // this.captchaServ.resolveCaptcha(event).subscribe( (data:any) => {
    //   console.log(event);
    //   this.captchaResolve = data.success
    //   console.log(this.captchaResolve);
    // });
    this.captchaResolve = true
  }

  async registrar(){
    if(this.form.valid && this.captchaResolve){
      await this.authServ.registrarUsuario(this.email, this.password).then( async (result) => {

      const nuevoUsuario = <Usuario>{
        uid: result.user.uid,
        email: this.email,
        password: this.password,
        dni: this.dni,
        rol: this.rol,
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        fotoPerfil_1: await this.storageServ.guardarFotoUsuario(this.apellido + '_' + this.nombre, this.fotoCargada),
        especialidad: this.especialidad,
        adminValidation: false
      }
      this.storeServ.setUsuario(nuevoUsuario);
      this.authServ.validarCorreo(result.user);

      await Swal.fire({
        position: "center",
        icon: "success",
        title: `Bienvenido ${nuevoUsuario.nombre}`,
        imageUrl: nuevoUsuario.fotoPerfil_1,
        showConfirmButton: false,
        timer: 2500 
        }).then( () => {
          this.horarioServ.generarHorariosDefault(nuevoUsuario);
          this.router.navigateByUrl(this.redirectTo);
        });
      });
    }
    else{
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Ocurrió un problema. Intentelo nuevamente",
        showConfirmButton: false,
        timer: 1500
        });
        console.log(this.form.get('recaptcha')?.value)
    }
  }
  
  async agregarNuevaEspecialidad(){
    Swal.fire({
      title: "Ingrese una especialidad:",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      showConfirmButton: true,
      showLoaderOnConfirm: true,
      preConfirm: async (input) =>{
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        try{
          if(result.value != ''){
            this.storeServ.setEspecialidad(result.value)
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Especialidad generada",
              showConfirmButton: false,
              timer: 1500
            });
          }
          else{
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Ingreso inválido",
              showConfirmButton: false,
              timer: 1500
            });
          }
        }
        catch(error){
          console.log(error)
        }
      }
      else{
        Swal.close();
      }
    });
  }

  ngOnInit(): void {
    this.storeServ.getEspecialidades().subscribe( (data) => {
      this.especialidades	= data;
    });
  }
}