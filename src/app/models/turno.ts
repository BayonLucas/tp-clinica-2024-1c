import { EstadoTurno } from "./types";

export interface Turno {
    id:string | null,
    uid_doctor: string,
    uid_paciente: string,
    especialidad: string, 
    fecha: Date,
    dia: number,
    mes:number,
    anio:number,
    hora:string,
    estado: EstadoTurno,
    calificacion: string | null,
    resenia: string | null,
    encuesta: string | null,
    comentario: string | null,
}
