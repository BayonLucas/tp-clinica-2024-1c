import { Injectable, inject, signal } from '@angular/core';
import { Auth, User, authState, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Usuario } from '../models/usuario';
import { StoreService } from './store.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth:Auth = inject(Auth);
  private router:Router = inject(Router);
  private storeServ:StoreService = inject(StoreService);
  private http:HttpClient = inject(HttpClient);

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
    const data = await signInWithEmailAndPassword(this.auth, email, password);
    
    if(!data.user.emailVerified){
      this.validarCorreo(data.user);
      // this.cerrarSesionUsuario()
      await signOut(this.auth);
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

  async cerrarSesionUsuario(){
    return await signOut(this.auth)
      .then( res => {
        localStorage.removeItem('usuario');
        this.currentUser = null;
        this.usuario = null;
        this.router.navigateByUrl('/bienvenido');
      });
  }

  async crearCuentaDeTerceros(email: string, password: string){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `key=${this.auth.app.options.apiKey}`
    };

    //let url: string = 'https://www.googleapis.com/identitytoolkit/v3/accounts';
    let url: string = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + this.auth.app.options.apiKey;

    const body = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return firstValueFrom(this.http.post(url, body, { headers })).then( (response: any) => {
      const ID_USER: string = response.localId;
      return ID_USER;
      
    }).catch( (e) => {
      throw e.error
    });
  }



}