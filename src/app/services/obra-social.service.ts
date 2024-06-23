import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { ObraSocialModel } from '../models/obra_social';

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {
  private db:Firestore = inject(Firestore);
  private obras_sociales!:CollectionReference;
  constructor() { 
    this.obras_sociales = collection(this.db, 'obras_sociales');
  }

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
}
