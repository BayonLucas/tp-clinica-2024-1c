export interface Usuario {
    id: string | null,
    uid: string,
    email: string,
    password: string | null,
    rol: string,
    nombre: string,
    apellido: string,
    edad: number,
    dni:string, 
    fotoPerfil_1: string,
    fotoPerfil_2: string | null,
    especialidad: string[] | null,
    obraSocial: string | null,
    adminValidation: boolean,
}
