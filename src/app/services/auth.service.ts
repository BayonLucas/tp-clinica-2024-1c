import { Injectable, inject, signal } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Usuario } from '../models/usuario';
import { StoreService } from './store.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth:Auth = inject(Auth);
  private router:Router = inject(Router);
  private storeServ:StoreService = inject(StoreService);
  
  user$ = user(this.auth);
  currentUser:User | null = null;
  usuario:Usuario | null = null;

  constructor() {
    this.user$.subscribe( (user) => {
      if(user){
        this.currentUser = user;
        this.storeServ.getUsuarioPorEmail(user?.email!).subscribe( (data) => {
          this.usuario = data;
        });
      }
    });
  }

  async loginUser(email: string, password: string){
    try {
      const data = await signInWithEmailAndPassword(this.auth, email, password);
      
      if(!data.user.emailVerified){
        this.validarCorreo(data.user);
        this.cerrarSesionUsuario()
        throw new Error("El correo no ha sido verificado.");
      }

      this.currentUser = data.user;

      this.storeServ.getUsuarioPorEmail(data.user.email!).subscribe( (data) => {
        this.usuario = data;
      });
    } 
    catch (error) {
      console.error("Error during login", error);
      throw error;
    }
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

        this.currentUser = null;
        this.usuario = null;
        this.router.navigateByUrl('/bienvenido');
      });
  }
}