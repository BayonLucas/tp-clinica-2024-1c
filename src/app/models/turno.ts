import { EstadoTurno } from "./types";

export interface Turno {
    id:string | null,
    especialista: string,
    especialidad: string,
    dia: string, 
    mes: string, 
    anio: string,
    hora: string, 
    fecha: Date,
    estado: EstadoTurno,
    paciente: string | null,
    calificacion: string | null,
    resenia: string | null,
    encuesta: string | null,
    comentario: string | null,
}
