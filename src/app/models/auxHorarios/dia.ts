import { Dia_Horario } from "./dia_horario";

export interface DiasLaborales {
    lunes: Dia_Horario | null,
    martes: Dia_Horario | null,
    miercoles: Dia_Horario | null,
    jueves: Dia_Horario | null,
    viernes: Dia_Horario | null,
    sabado: Dia_Horario | null,
}
