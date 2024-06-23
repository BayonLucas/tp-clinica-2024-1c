export interface Horario {
    id: string,
    uid: string,
    especialidad: string,
    dia: string,
    trabaja: boolean,
    desde: string | null,
    hasta: string | null,
}
