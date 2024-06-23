import { DiasLaborales } from "./dia";
import { Dia_Horario } from "./dia_horario";

export interface HorariosEspecialista {
    id: string | null,
    uid: string,
    especialidad: string,
    // dias: DiasLaborales,
    lunes: Dia_Horario | null, //desde/hasta
    martes: Dia_Horario | null, //desde/hasta
    miercoles: Dia_Horario | null, //desde/hasta
    jueves: Dia_Horario | null, //desde/hasta
    viernes: Dia_Horario | null, //desde/hasta
    sabado: Dia_Horario | null, //desde/hasta
}
