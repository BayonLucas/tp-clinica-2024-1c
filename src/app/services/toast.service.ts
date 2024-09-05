import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastServ:ToastrService = inject(ToastrService)
  
  constructor() { }

  async showToast(type:'success' | 'error' | 'info', mensaje:string){
    let titulo:string = '';
    let msj:string = '';
    let result:string = mensaje;
    
    if(mensaje.includes("(") || mensaje.includes(")")){
      result = mensaje.slice(mensaje.indexOf('(') + 1, mensaje.indexOf(')'));
    }

    console.log(result);
    switch(result){
      case 'auth/invalid-credential':
        titulo = 'Credenciales invalidas.';
        msj = 'El email/contraseña es incorrecto.'; 
        break;
      case 'auth/too-many-requests':
        titulo = 'Exceso de intentos fallidos.';
        msj = 'La cuenta ha sido bloqueada. Comuniquese con el administrador del servicio.'; 
        break;
      case 'auth/no-verification':
        titulo = 'Error: Verificación';
        msj = 'El correo no ha sido verificado.';
        break;
      case 'auth/no-validacion-admin':
        titulo = 'Error: Verificación';
        msj = 'El especialista no tiene la validación del administrador. Aguarde a ser validado'
        break;
      case 'EMAIL_EXISTS':
        titulo = 'Error: Registro';
        msj = 'El correo ingresado ya está en uso.'
        break;
      default:
        titulo = 'Error inesperado';
        msj = 'Vuelva a intentarlo mas tarde';
        break;
    }
    
    switch(type){
      case 'success':
        await this.toastServ.success(msj, titulo);
        break;
      case 'info':
        await this.toastServ.info(msj, titulo);
        break;
      case 'error':
        await this.toastServ.error(msj, titulo);
        break;
    }
  }

  async showCustomToast(type:'success' | 'error' | 'info', titulo:string, mensaje:string){
    switch(type){
      case 'success':
        await this.toastServ.success(mensaje, titulo);
        break;
      case 'info':
        await this.toastServ.info(mensaje, titulo);
        break;
      case 'error':
        await this.toastServ.error(mensaje, titulo);
        break;
    }
  }

}
