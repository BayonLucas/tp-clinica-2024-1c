import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData, doc, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Log } from '../models/log';
import { format, subDays } from 'date-fns';

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
    let qry = query(
      this.logs,
      orderBy('fecha', 'desc')
    );    return collectionData(qry).pipe( map( logs => logs as Log[] ));
  }
  
  getCantLogsPorDia(fecha:Date){
    // Obtener el comienzo del día (00:00:00)
    const inicioDia = new Date(fecha);
    inicioDia.setHours(0, 0, 0, 0); // Setear a las 00:00:00

    // Obtener el final del día (23:59:59)
    const finDia = new Date(fecha);
    finDia.setHours(23, 59, 59, 999); // Setear a las 23:59:59

    // Crear la consulta con el rango de fechas
    const qry = query(
      this.logs,
      where('fecha', '>=', inicioDia),   // Filtrar desde el comienzo del día
      where('fecha', '<=', finDia),      // Hasta el final del día
      orderBy('fecha', 'desc')
    );
    return collectionData(qry).pipe(
      map(logs => (logs as Log[]).length)  // Devolver la cantidad de logs
    );
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
  
  getLogsPorRangoDias(cantDias: number) {
    const inicioRango = subDays(new Date(), cantDias);
    inicioRango.setHours(0, 0, 0, 0); 
  
    const finRango = new Date();
    finRango.setHours(23, 59, 59, 999);
  
    const qry = query(
      this.logs,
      where('fecha', '>=', inicioRango),
      where('fecha', '<=', finRango),
      orderBy('fecha', 'desc')
    );
  
    return collectionData(qry).pipe(
      map((logs: any[]) => {
        const dataMap = new Map<string, number>();
  
        logs.forEach(log => {
          const aux = JSON.parse(JSON.stringify(log.fecha));
          const logDate = new Date(aux.seconds * 1000 + aux.nanoseconds / 1000000);
          const formattedDate = format(logDate, 'dd/MM/yyyy');
  
          if (!dataMap.has(formattedDate)) {
            dataMap.set(formattedDate, 1);
          } else {
            const currentCount = dataMap.get(formattedDate) || 0;
            dataMap.set(formattedDate, currentCount + 1);
          }
        });
  
        const result = [];
        for (let i = 0; i <= cantDias; i++) {
          const currentDate = subDays(finRango, i);
          const formattedDate = format(currentDate, 'dd/MM/yyyy');
          
          const value = dataMap.get(formattedDate) || 0;
          result.push({ date: formattedDate, value });
        }
  
        return result.reverse();
      })
    );
  }
}
