import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData, doc, query, setDoc, where, writeBatch } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Horario } from '../models/horario';
import { Usuario } from '../models/usuario';
// import { HorariosEspecialista } from '../models/horarios_especialista';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private db:Firestore = inject(Firestore);
  private horarios!:CollectionReference;
  
  diasLaborables = [ 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', ];

  constructor() { 
    this.horarios = collection(this.db, 'horarios_especialistas');
  }

  getHorarioLaboralPorUid(uid:string): Observable<Horario[]> {
    let qry = query(
      this.horarios,
      where('uid', '==', uid)
    );
    return collectionData(qry).pipe( 
      map( horarios => horarios as Horario[] ));
  }

  updateHorario(horario:Horario){
    if(horario){
      const registro = doc(this.horarios, horario.id!);
      setDoc(registro, horario);
    }
  }

  updateHorariosLote(horarios: Horario[]) {
    const batch = writeBatch(this.db);
    horarios.forEach(horario => {
      const registro = doc(this.horarios, horario.id!);
      batch.set(registro, horario);
    });
    batch.commit().then(() => {
      console.log('Horarios actualizados con éxito');
    }).catch(error => {
      console.error('Error actualizando horarios: ', error);
    });
  }

  generarHorariosDefault(especialista:Usuario){
    if(especialista){
      const batch = writeBatch(this.db);
      especialista.especialidad?.forEach( esp => {
        this.diasLaborables.forEach( dia => {
          const registro = doc(this.horarios);
          let nuevoHorario = <Horario>{
            id: registro.id,
            uid: especialista.uid,
            especialidad: esp,
            dia: dia,
            trabaja: false,
            desde: null,
            hasta: null,
          }
          batch.set(registro, nuevoHorario);
        });
      });
      batch.commit().then(() => {
        console.log('Horarios generados con éxito');
      }).catch(error => {
        console.error('Error actualizangenerando horarios: ', error);
      });
    }
  }

  // setHorarioLaboral(horario:string){
  //   if(horario && horario != ''){
  //     addDoc(this.horarios, <HorariosEspecialista>{
  //       horario: horario.toLocaleUpperCase()
  //     }).catch( (error) => { throw error } );
  //   }
  // }

}
