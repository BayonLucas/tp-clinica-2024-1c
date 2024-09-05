import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BtnInicioRapidoComponent } from '../../components/btn-inicio-rapido/btn-inicio-rapido.component';
import { StoreService } from '../../services/store.service';
import { LogService } from '../../services/log.service';
import { ToastService } from '../../services/toast.service';
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
  private logServ:LogService = inject(LogService);
  private router:Router = inject(Router);
  private customToastServ:ToastService = inject(ToastService)

  get email(){
    return this.form.get('email')?.value;
  }
  get password(){
    return this.form.get('password')?.value;
  }

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email,]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });


  setearUser(event:any){
    this.form.patchValue({
      email: event.email,
      password: event.clave
    });
  }

  iniciarSesion(){
    try {
      if(this.form.valid){
        let usuario$ = this.storeServ.getUsuarioPorEmail(this.email);
        usuario$.pipe( take(1) ).subscribe( async (data) => {
          if(data.rol == 'especialista' && !data.adminValidation){
            // throw new Error('(auth/no-validacion-admin)');
            this.customToastServ.showToast('error', '(auth/no-validacion-admin)');

          }
          else {
            await this.authServ.loguearUsuario(this.email, this.password).then( (data:any)  => {
              if(data != undefined){
                this.logServ.setLogs(data.uid);
                this.router.navigateByUrl('/home');
              }
            }).catch( (e) => {
              this.customToastServ.showToast('error', e.message);
            });
          } 
        });
      }
      else{
        this.form.markAllAsTouched()

      }
    }
    catch(error:any){
      this.customToastServ.showToast('error', error.message);
    }
  }


}
