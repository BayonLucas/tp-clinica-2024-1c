import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encuesta',
  standalone: true
})
export class EncuestaPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const data = JSON.parse(value);
    
    const comment = "Comentario: " + data.comentario + "\n"; 
    const recomend = "El paciente " + (!data.recomendable? 'NO ': '') + "recomienda la institución \n";
    const calificacion = "Calificación: " + data.calificacion + " estrellas. \n";
    const destacables = data.destacables.length > 0 ? "Los aspectos que mas destaca el paciente es/son: " + data.destacables.join(' - ') + '\n' : '';
    const satisfaccion = "El grado de satisfacción en cuanto al Dr. que lo atendió es de: " + data.satisf_Atencion + "/10.\n"; 

    return comment + recomend + calificacion + destacables + satisfaccion;
  }

}
