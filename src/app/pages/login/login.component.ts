import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BtnInicioRapidoComponent } from '../../components/btn-inicio-rapido/btn-inicio-rapido.component';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    BtnInicioRapidoComponent, ReactiveFormsModule, CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authServ:AuthService = inject(AuthService);
  private storeServ:StoreService = inject(StoreService);
  private router:Router = inject(Router);
  
  get email(){
    return this.form.get('email')?.value;
  }
  get password(){
    return this.form.get('password')?.value;
  }

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, /*Validators.pattern()*/]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
    // recaptcha: new FormControl('', [Validators.required]),
  });


  setearUser(event:any){
    this.form.patchValue({
      email: event.email,
      password: event.clave
    });
  }

  iniciarSesion(){
    try{

      if(this.form.valid){
  
        let usuario$ = this.storeServ.getUsuarioPorEmail(this.email);
        // usuario$.pipe( take(1) ).subscribe( async (data) => {
        usuario$.subscribe( async (data) => {
          if(data.rol == 'especialista' && !data.adminValidation){
            // this.authServ.cerrarSesionUsuario();
            throw new Error('El especialista no tiene la validación del administrador. Aguarde a ser validado');
          }
          else{
            await this.authServ.loginUser(this.email, this.password);
            this.router.navigateByUrl('/home');
          } 
        });
      }

    }
    catch(error:any){
    
    }
  }


}
