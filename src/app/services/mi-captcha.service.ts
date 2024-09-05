import { inject, Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, Firestore, query, where } from '@angular/fire/firestore';
import { firstValueFrom, map, take } from 'rxjs';
import { Captcha } from '../models/mi-captcha';

@Injectable({
  providedIn: 'root'
})
export class MiCaptchaService {
  private db:Firestore = inject(Firestore)
  private captchas!:CollectionReference;
  
  constructor() { 
    this.captchas = collection(this.db, 'captchas');
  }

  obtenerCaptchas(){
    return collectionData(this.captchas).pipe(
      map( captchas => captchas as Captcha[] )
    );
  }

  async validarRespuestaCaptcha(idCaptcha:string, respuesta:string):Promise<boolean>{
    let ret = false;
    const qry = query(
      this.captchas,
      where('id', '==', idCaptcha)
    );
  
    const respuestasObtenidas:string[] = await firstValueFrom(
      collectionData(qry).pipe(
        take(1), 
        map( item => item[0]['respuestas'] as string[])
      )
    );

    if(respuestasObtenidas){
      ret = respuestasObtenidas.some( item => {
        return item.toLowerCase() == respuesta.toLowerCase(); 
      });
    }

    return ret;
  }
}
