import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { EspecialidadModel } from '../models/especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private db:Firestore = inject(Firestore);
  private especialidades!:CollectionReference;

  constructor() { 
    this.especialidades = collection(this.db, 'especialidades');
  }

  getEspecialidades(): Observable<any[]> {
    return collectionData(this.especialidades).pipe(
      map((especialidades: any[]) => especialidades.map(e => e.especialidad))
    );
  }
  getEspecialidadesconImagenes(): Observable<any[]> {
    return collectionData(this.especialidades).pipe(
      map(especialidades => especialidades as EspecialidadModel[])
    );
  }

  setEspecialidad(especialidad:string){
    if(especialidad && especialidad != ''){
      addDoc(this.especialidades, <EspecialidadModel>{
        especialidad: especialidad.toLocaleUpperCase()
      }).catch( (error) => { throw error } );
    }
  }

}
