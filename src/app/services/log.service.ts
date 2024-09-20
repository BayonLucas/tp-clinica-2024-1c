import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData, doc, orderBy, query, setDoc, where, writeBatch } from '@angular/fire/firestore';
import { Observable, firstValueFrom, map } from 'rxjs';
import { Log } from '../models/log';
import { format, setHours, setMinutes, setSeconds, subDays } from 'date-fns';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private db:Firestore = inject(Firestore);
  private logs!:CollectionReference;

  private userServ:UsuarioService  = inject(UsuarioService);
  
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

  setLogs(uid:string, email:string){
    if(uid && uid != ''){
      const fecha = new Date();
      const tupla = doc(this.logs);
      
      setDoc(tupla, <Log>{
        id: tupla.id,
        uid_usuario: uid,
        email: email,
        fecha: fecha,
      });
    }
  }
  
  setLogsConFecha(uid:string, email:string, fecha:Date){
    if (uid && uid !== '') {
      const tupla = doc(this.logs);
      setDoc(tupla, <Log>{
        id: tupla.id,
        uid_usuario: uid,
        email: email,
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

  //Generador de datos
  async GenerarLogsPorCantDeDias(cantDias:number){
    // Obtener usuarios de Firebase
    const usuarios = await firstValueFrom(this.userServ.getUsuarios());

    const diasAtras = cantDias;  // Cantidad de días hacia atrás desde hoy

    // Iterar sobre cada usuario
    usuarios.forEach((usuario) => {
      for (let i = 0; i < diasAtras; i++) {
        // Obtener la fecha de hace 'i' días usando date-fns
        if(i < 1){
          continue;
        }
        const fechaLog = subDays(new Date(), i);  // Resta i días desde hoy
        // const randomMax = Math.floor(Math.random() * 3) + 1;

        // Generar una cantidad random de logs entre 1 y 3
        const cantidadLogs = Math.floor(Math.random() * 2) + 1;

        for (let j = 0; j < cantidadLogs; j++) {
          // Generar una hora random para ese día (entre 00:00 y 23:59)
          const horaRandom = Math.floor(Math.random() * 24);
          const minutosRandom = Math.floor(Math.random() * 60);

          // Usar date-fns para establecer la hora y minutos en la fecha
          const fechaConHora = setSeconds(setMinutes(setHours(fechaLog, horaRandom), minutosRandom), 0);

          // Reutilizar el método setLogs para crear el log
          this.setLogsConFecha(usuario.uid, usuario.email, fechaConHora);
        }
      }
    });

    console.log('Logs generados correctamente para los últimos 45 días.');
  }

  async agregarMailsLogs(){
    // Obtener usuarios y logs de Firebase
    const usuarios = await firstValueFrom(this.userServ.getUsuarios());
    const logs = await firstValueFrom(this.getLogs());
  
    // Crear un mapa de usuarios por uid para fácil acceso
    const userMap = new Map(usuarios.map(user => [user.uid, user]));
  
    // Crear un batch para eficiencia
    const batch = writeBatch(this.db);
  
    // Iterar sobre los logs y actualizar agregando el email
    logs.forEach(log => {
      const usuario = userMap.get(log.uid_usuario);
      if (usuario) {
        const logRef = doc(this.db, 'logs', log.id!);
  
        // Agregar el campo 'email' al documento del log
        batch.update(logRef, { email: usuario.email });
      }
    });
  
    // Aplicar el batch para realizar las actualizaciones en una sola operación
    await batch.commit();
    console.log('Emails añadidos a los logs correctamente.');
  }

}
