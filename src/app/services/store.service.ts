import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, query, collection, collectionData, enablePersistentCacheIndexAutoCreation, getDocs, where, orderBy, doc, setDoc } from '@angular/fire/firestore';
import { Observable, map, take, throttleTime } from 'rxjs';
import { EspecialidadModel } from '../models/especialidad';
import { Usuario } from '../models/usuario';
import { ObraSocialModel } from '../models/obra_social';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private db:Firestore = inject(Firestore);
  private users!:CollectionReference;
  private especialidades!:CollectionReference;
  private obras_sociales!:CollectionReference;


  constructor() {
    this.users = collection(this.db, 'users');
    this.especialidades = collection(this.db, 'especialidades');
    this.obras_sociales = collection(this.db, 'obras_sociales');
  }

  //#region Especialidades
  getEspecialidades(): Observable<string[]> {
    return collectionData(this.especialidades).pipe(
      map((especialidades: any[]) => especialidades.map(e => e.especialidad))
    );
  }

  setEspecialidad(especialidad:string){
    if(especialidad && especialidad != ''){
      addDoc(this.especialidades, <EspecialidadModel>{
        especialidad: especialidad.toLocaleUpperCase()
      }).catch( (error) => { throw error } );
    }
  }
  //#endregion

  //#region Usuarios
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

  //#endregion

  //#region Obras Sociales
  getObrasSociales(): Observable<string[]> {
    return collectionData(this.obras_sociales).pipe(
      map((obras_sociales: any[]) => obras_sociales.map(os => os.obra_social))
    );
  }

  setObraSocial(os:string){
    if(os && os != ''){
      addDoc(this.obras_sociales, <ObraSocialModel>{
        obra_social: os.toLocaleUpperCase()
      }).catch( (error) => { throw error } );
    }
  }

  //#endregion





  
}
