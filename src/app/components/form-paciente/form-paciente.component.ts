import { Component, Input, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmarClaveValidator } from '../../Validators/password.validator';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { StoreService } from '../../services/store.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../models/usuario';
import { StorageService } from '../../services/storage.service';
import { confirmarOSRequired } from '../../Validators/obra_social.validator';
import { CaptchaService } from '../../services/captcha.service';

@Component({
  selector: 'form-paciente',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, NgxCaptchaModule, NgbToast 
  ],
  templateUrl: './form-paciente.component.html',
  styleUrl: './form-paciente.component.scss'
})
export class FormPacienteComponent implements OnInit{
    private authServ:AuthService = inject(AuthService);
    private storeServ: StoreService = inject(StoreService);
    private storageServ:StorageService = inject(StorageService);
    private captchaServ:CaptchaService = inject(CaptchaService);
    private router:Router = inject(Router);
  
    private rol:string = 'paciente';
    private foto1Cargada!:any;
    private foto2Cargada!:any;
    private captchaResolve:boolean = false;
    @Input() redirectTo!:string;
    @Input() titulo:string = '¡Bienvenido!';
    @Input() subtitulo:string = 'Por favor, complete con sus datos:'; 


    siteKey:string = '6Lck9_IpAAAAAFP6_aqAjymCuu56-Rky52ed3Jfx';
    obras_sociales:string[] = [];
    error: string = '';
    
    form: FormGroup = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      edad: new FormControl('', [Validators.required, Validators.min(18), Validators.max(85)]),
      dni: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
      obra_social: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.email, /*Validators.pattern()*/]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
      confirmPassword: new FormControl('', [Validators.required,/*Validators.pattern()*/]),
      fotoPerfil: new FormControl('', [Validators.required]),
      fotoPerfil2: new FormControl('', [Validators.required]),
      recaptcha: new FormControl('', [Validators.required]),
    }, {
      validators: [
        confirmarClaveValidator(), 
        confirmarOSRequired(),
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
    get obra_social(){
      return this.form.get('obra_social')?.value;
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
        this.foto1Cargada = file;
      }
    }
    onFileChange2(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.foto2Cargada = file;
      }
    }
  
    resolve(event:any){
      // debugger;
      // this.captchaServ.resolveCaptcha(event).subscribe( (data:any) => {
      //   console.log(event);
      //   this.captchaResolve = data.success
      //   console.log(this.captchaResolve);
      // });
      this.captchaResolve = true
    }
  
    async registrar(){
      if(this.form.valid && this.captchaResolve){
        await this.authServ.registerUser(this.email, this.password).then( async (result) => {
  
        const nuevoUsuario = <Usuario>{
          uid: result.user.uid,
          email: this.email,
          password: this.password,
          dni: this.dni,
          rol: this.rol,
          nombre: this.nombre,
          apellido: this.apellido,
          edad: this.edad,
          fotoPerfil_1: await this.storageServ.guardarFotoUsuario(this.apellido + '_' + this.nombre + '-1', this.foto1Cargada),
          fotoPerfil_2: await this.storageServ.guardarFotoUsuario(this.apellido + '_' + this.nombre + '-1', this.foto2Cargada),
          obraSocial: this.obra_social,
          adminValidation: true
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
    
    async agregarNuevaObraSocial(){
      Swal.fire({
        title: "Ingrese una obra social:",
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
              this.storeServ.setObraSocial(result.value)
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Obra social generada",
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
      this.storeServ.getObrasSociales().subscribe( (data) => {
        this.obras_sociales	= data;
      });
    }
  }