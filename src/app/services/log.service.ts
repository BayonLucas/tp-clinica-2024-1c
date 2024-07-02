import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Log } from '../models/log';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private db:Firestore = inject(Firestore);
  private logs!:CollectionReference;
  
  constructor() { 
    this.logs = collection(this.db, 'logs');
  }

  getLogs(): Observable<Log[]> {
    return collectionData(this.logs).pipe( map( logs => logs as Log[] ));
  }

  setLogs(uid:string){
    if(uid && uid != ''){
      const fecha = new Date();
      const tupla = doc(this.logs);
      
      setDoc(tupla, <Log>{
        id: tupla.id,
        uid_usuario: uid,
        fecha: fecha,
      });
    }
  }
}
