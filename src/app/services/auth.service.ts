import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { UserModel } from '../models/user';
import { Usuario } from '../models/usuario';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth:Auth = inject(Auth);
  private storeServ:StoreService = inject(StoreService);
  private currentUserModel:UserModel | null = null; 
  user$ = user(this.auth);
  currentUser = signal<UserModel | null | undefined>(undefined)

  usuario:Usuario | null = null;

  constructor() { }

  async loginUser(email: string, password: string){
    try {
      const data = await signInWithEmailAndPassword(this.auth, email, password);
      
      if(!data.user.emailVerified){
        this.validarCorreo(data.user);
        this.singOutUser()
        throw new Error("El correo no ha sido verificado.");
      }

      this.storeServ.getUsuarioPorEmail(data.user.email!).subscribe( (data) => {
        this.usuario = data;
      })

      let userCredential:UserModel = {
        uid:data.user.uid,
        email: data.user.email!,
      }


      this.currentUserModel = userCredential;
      localStorage.setItem("userCredential", JSON.stringify(userCredential!));


      // const userCredential = await lastValueFrom(this.storeService.traerUsuarioPorUid(data.user.uid));  
    } 
    catch (error) {
      console.error("Error during login", error);
      throw error;
    }
  }

  async registerUser(email:string, password:string){
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  validarCorreo(user:any){
    return sendEmailVerification(user); 
  }


  async singOutUser(){
    return await signOut(this.auth)
      .then( res => {
        this.currentUserModel = null;
        this.usuario = null;
        localStorage.removeItem("userCredential");
      });
  }

  get usuarioActivo():UserModel | null{
    return this.currentUserModel
  }

  isMailVerificated() : boolean{
    return this.auth.currentUser?.emailVerified!;
  }
}