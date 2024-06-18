import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import { addDays, eachDayOfInterval, format, setHours, setMinutes } from 'date-fns';
import { Turno } from '../models/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private db:Firestore = inject(Firestore);
  private turnos!:CollectionReference;
  
  diasLaborables = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado',
  ];
  horariosSemana = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00'
  ];
  horariosSabado = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00'
  ];
  
  constructor() {
    this.turnos = collection(this.db, 'turnos');
  }

  // generarTurnos(usuario:Usuario, especialidad:string){
  //   if(usuario.rol == 'especialista'){
  //     const today = new Date();
  //     let primerDiaLaboral = today;
  
  //     while (!usuario.diasLaborales?.includes(format(primerDiaLaboral, 'EEEE'))) {
  //       primerDiaLaboral.setDate(primerDiaLaboral.getDate() + 1);
  //     }


  //   }  
  //   else{
  //     throw new Error('El usuario no es un especialista');
  //   }


  // }
  async generarTurnosProximosDosMeses(especialista: Usuario): Promise<void> {
    debugger;
    const { diasLaborales, horarioSemanaDesde, horarioSemanaHasta, horarioSabadoDesde, horarioSabadoHasta } = especialista;
    const horariosSemana = this.generarHorarios(horarioSemanaDesde, horarioSemanaHasta);
    const horariosSabado = this.generarHorarios(horarioSabadoDesde, horarioSabadoHasta);

    const hoy = new Date();
    const dosMesesDespues = addDays(hoy, 5);
    const diasIntervalo = eachDayOfInterval({ start: hoy, end: dosMesesDespues });

    for (const dia of diasIntervalo) {
      const diaSemana = format(dia, 'EEEE'); // Obtener el nombre del día en español

      if (diasLaborales?.includes(diaSemana)) {
        const horarios = diaSemana === 'Sábado' ? horariosSabado : horariosSemana;

        for (const hora of horarios) {
          const turnoFecha = setHours(setMinutes(dia, parseInt(hora.split(':')[1], 10)), parseInt(hora.split(':')[0], 10));
          
          const turno = <Turno>{
            especialista: `${especialista.nombre} ${especialista.apellido}`,
            especialidad: especialista.especialidad?.join(', ') || '',
            dia: format(dia, 'EEEE'),
            mes: format(dia, 'MMMM'),
            anio: format(dia, 'yyyy'),
            hora,
            fecha: turnoFecha,
            estado: 'Disponible',
            paciente: null,
            calificacion: null,
            resenia: null,
            encuesta: null,
            comentario: null,
          };

          this.setTurno(turno);
        }
      }
    }
  }

  async setTurno(turno:Turno){
    if(turno){
      const tupla = doc(this.turnos);
      turno.id = tupla.id;
      setDoc(tupla, turno)
    }
  }

  private generarHorarios(desde: string | null, hasta: string | null): string[] {
    if (!desde || !hasta) {
      return [];
    }

    const horarios: string[] = [];
    const [desdeHoras, desdeMinutos] = desde.split(':').map(Number);
    const [hastaHoras, hastaMinutos] = hasta.split(':').map(Number);

    let currentHora = desdeHoras;
    let currentMinuto = desdeMinutos;

    while (currentHora < hastaHoras || (currentHora === hastaHoras && currentMinuto < hastaMinutos)) {
      horarios.push(`${String(currentHora).padStart(2, '0')}:${String(currentMinuto).padStart(2, '0')}`);

      currentMinuto += 30;
      if (currentMinuto >= 60) {
        currentMinuto = 0;
        currentHora += 1;
      }
    }

    return horarios;
  }

}
