import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData, doc, query, setDoc, where } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import { addDays, eachDayOfInterval, format, setHours, setMinutes } from 'date-fns';
import { Turno } from '../models/turno';
import { DIAS_LABORABLES, HORARIOS_SABADO, HORARIOS_SEMANA } from '../constantes';
import { EstadoTurno } from '../models/types';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private db:Firestore = inject(Firestore);
  private turnos!:CollectionReference;
  
  diasLaborables = DIAS_LABORABLES;
  horariosSemana = HORARIOS_SEMANA;
  horariosSabado = HORARIOS_SABADO;
  
  constructor() {
    this.turnos = collection(this.db, 'turnos');
  }

  getTurnoPorId(id:string): Observable<Turno>{
    let qry = query(
      this.turnos,
      where('id', '==', id),
    );
    return collectionData(qry).pipe( 
      take(1),
      map( turnos => turnos[0] as Turno ));    
  }

  getTurnoEspecifico(uid_doc:string, especialidad:string, dia:Date): Observable<Turno>{
    let qry = query(
      this.turnos,
      where('uid_doctor', '==', uid_doc),
      where('especialidad', '==', especialidad),
      where('dia', '==', dia),
    );
    return collectionData(qry).pipe( 
      take(1),
      map( turnos => turnos[0] as Turno ));
  }
  
  getTurnosPorDia(uid_doc:string, especialidad:string, dia:number, mes:number, anio:number): Observable<Turno[]>{
    let qry = query(
      this.turnos,
      where('uid_doctor', '==', uid_doc),
      where('especialidad', '==', especialidad),
      where('dia', '==', dia),
      where('mes', '==', mes),
      where('anio', '==', anio),
    );
    return collectionData(qry).pipe( 
      map( turnos => turnos as Turno[] ));
    }
  
  getTurnosPorPaciente(uid_paciente:string): Observable<Turno[]>{
    let qry = query(
      this.turnos,
      where('uid_paciente', '==', uid_paciente),
    );
    return collectionData(qry).pipe( 
      map( turnos => turnos as Turno[] ));
    }
    
  getTurnosPorEstado(estado:EstadoTurno): Observable<Turno[]>{      
      let qry = query(
        this.turnos,
        where('estado', '==', estado),
      );
      return collectionData(qry).pipe( 
        map( turnos => turnos as Turno[] ));
  }

  getTurnosPorEspecialista(uid_doctor:string): Observable<Turno[]>{
    let qry = query(
      this.turnos,
      where('uid_doctor', '==', uid_doctor),
    );
    return collectionData(qry).pipe( 
      map( turnos => turnos as Turno[] ));
  }

  getTurnos(): Observable<Turno[]>{
    return collectionData(this.turnos).pipe(
      map(turnos => turnos as Turno[])
    );
  }

  async setTurno(turno:Turno){
    if(turno){
      const tupla = doc(this.turnos);
      turno.id = tupla.id;
      setDoc(tupla, turno)
    }
  }

  async updateTurno(turno:Turno){
    const registro = doc(this.turnos, turno.id!);
    await setDoc(registro, turno);
  }
}
