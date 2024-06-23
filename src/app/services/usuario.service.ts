import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData, doc, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, map, take } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private db:Firestore = inject(Firestore);
  private users!:CollectionReference;

  constructor() { 
    this.users = collection(this.db, 'users');
  }

  getUsuarios(): Observable<Usuario[]> {
    return collectionData(this.users).pipe( 
      map( usuarios => usuarios.map( user => user as Usuario )));
  }
  
  getUsuarioPorEmail(email:string): Observable<Usuario> {
    let qry = query(
      this.users,
      where('email', '==', email)
    );
    return collectionData(qry).pipe( take(1),
      map( usuarios => usuarios[0] as Usuario ));
  }

  getUsuarioInicioRapido(): Observable<Usuario[]> {
    let qry = query(
      this.users,
      where('email', 'in', [
        'paciente_tres@yopmail.com',
        'paciente_dos@yopmail.com',
        'paciente_uno@yopmail.com',
        'especialista_dos@yopmail.com',
        'especialista_uno@yopmail.com',
        'knights-code-lks@hotmail.com',
      ]),
      orderBy('apellido', 'asc')
    );
    return collectionData(qry).pipe( 
      map( usuarios => usuarios as Usuario[] ));
  }

  async setUsuario(usuario:Usuario){
    if(usuario){
      const tupla = doc(this.users);
      usuario.id = tupla.id;
      setDoc(tupla, usuario)
    }
  }

  setAutorizAdminUsuario(usuario:Usuario, boolean:boolean){
    const registro = doc(this.users, usuario.id!);
    usuario.adminValidation = boolean;
    setDoc(registro, usuario);
  }

  updateUsuario(usuario:Usuario){
    const registro = doc(this.users, usuario.id!);
    setDoc(registro, usuario);
  }
}
