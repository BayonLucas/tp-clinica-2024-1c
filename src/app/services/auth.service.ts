import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { UserModel } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth:Auth = inject(Auth);
  currentUserModel:UserModel | null = null; 
  user$ = user(this.auth);
  currentUser = signal<UserModel | null | undefined>(undefined)


  constructor() { }

  async loginUser(email: string, password: string){
    try {
      const data = await signInWithEmailAndPassword(this.auth, email, password);
      
      if(!data.user.emailVerified){
        this.validarCorreo(data.user);
        this.singOutUser()
        throw new Error("El correo no ha sido verificado.");
      }

      

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