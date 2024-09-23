import { Injectable, inject, signal } from '@angular/core';
import { Auth, User, authState, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Usuario } from '../models/usuario';
import { StoreService } from './store.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LogService } from './log.service';
import { UsuarioService } from './usuario.service';
import { getAuth } from 'firebase/auth';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth:Auth = inject(Auth);
  private router:Router = inject(Router);
  private storeServ:StoreService = inject(StoreService);
  private userServ:UsuarioService = inject(UsuarioService);
  private http:HttpClient = inject(HttpClient);
  private logServ:LogService = inject(LogService);
  private spinnerServ:SpinnerService = inject(SpinnerService)

  user$ = user(this.auth); 
  state$ = authState(this.auth);
  currentUser:User | null = null;
  usuario:Usuario | null = null;

  constructor() {
    // this.user$.subscribe( (user) => {
    //   if(user){
    //     this.currentUser = user;
    //     this.storeServ.getUsuarioPorEmail(user?.email!).subscribe( (data) => {
    //       this.usuario = data;
    //     });
    //   }
    // });
    this.state$.subscribe( (user) => {
      if(user){
        this.currentUser = user;
        this.storeServ.getUsuarioPorEmail(user?.email!).subscribe( (data) => {
          this.usuario = data;
        });
      }
    });
  }

  async loguearUsuario(email: string, password: string){
    this.spinnerServ.show();
    const data = await signInWithEmailAndPassword(this.auth, email, password);
    
    if(!data.user.emailVerified){
      this.validarCorreo(data.user);
      this.cerrarSesionUsuario()
      // await signOut(this.auth);
      throw new Error("(auth/no-verification)");
    }

    this.currentUser = data.user;

    // this.storeServ.getUsuarioPorEmail(data.user.email!).subscribe( (data) => {
    //   this.usuario = data;
    //   localStorage.setItem('usuario', JSON.stringify(data));
    //   localStorage.setItem('usuario_id', JSON.stringify(data.uid));
    // });
    // localStorage.setItem('usuario', JSON.stringify(user_data));

    const user_data = await firstValueFrom(this.storeServ.getUsuarioPorEmail(data.user.email!))
    this.usuario = user_data;

    user_data.password = '';
    localStorage.setItem('usuario', JSON.stringify(user_data));
    this.logServ.setLogs(user_data.uid, user_data.email);

    this.spinnerServ.hide();
    return data;
  }

  async registrarUsuario(email:string, password:string){
    return createUserWithEmailAndPassword(this.auth, email, password).then( (ret) => {
      this.cerrarSesionUsuario();
      return ret
    });
  }

  validarCorreo(user:any){
    return sendEmailVerification(user); 
  }

  async cerrarSesionUsuario(redirect:boolean = false){
    this.spinnerServ.show();
    return await signOut(this.auth)
      .then( res => {
        localStorage.removeItem('usuario');
        this.currentUser = null;
        this.usuario = null;
        if(redirect){
          this.router.navigateByUrl('/bienvenido');
        }
      }).finally( () => {
        this.spinnerServ.hide();

      });
  }

  async crearCuentaDeTerceros(email: string, password: string){
    this.spinnerServ.show();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `key=${this.auth.app.options.apiKey}`
    };

    //let url: string = 'https://www.googleapis.com/identitytoolkit/v3/accounts';
    let urlSingUp: string = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + this.auth.app.options.apiKey;
    let urlVerifyEmail: string = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + this.auth.app.options.apiKey;

    const body = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return firstValueFrom(this.http.post(urlSingUp, body, { headers })).then( (response: any) => {
      console.log(response)
      const ID_USER: string = response.localId;
      // const ID_TOKEN: string = response.tokenId;
      
      // const res = firstValueFrom(this.http.post(urlVerifyEmail, { requestType: "VERIFY_EMAIL", idToken:ID_USER}, { headers }));
      // console.log(res)

      return response;
      
    }).catch( (e) => {
      throw e.error
    }).finally( () => {
      this.spinnerServ.hide();
    });
  }

  async enviarVerificacionEmail(id_token:any){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `key=${this.auth.app.options.apiKey}`
    };
    let urlVerifyEmail: string = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + this.auth.app.options.apiKey;
    const body = {
      requestType: "VERIFY_EMAIL", 
      idToken: id_token
    };

    const result =  await firstValueFrom(this.http.post(urlVerifyEmail, body, { headers }));
    console.log(result)
  }

}