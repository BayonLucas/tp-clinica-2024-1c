export interface HistorialClinico {
    // id:string;
    altura:string;
    peso:number;
    temperatura:string;
    presion:string;
    dinamicos: {clave: string, valor: string}[];
}
