import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf";
import { Turno } from '../models/turno';
import { Usuario } from '../models/usuario';
import { FormatOptions, format, getDate, getYear } from 'date-fns';
import { es, ru } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }
  generarHistoriaClinicaPDF(historiaClinica:Turno[], paciente:Usuario, especialistas:Usuario[]){

    console.log(paciente);
    if(historiaClinica && historiaClinica.length > 0){
      const doc = new jsPDF();
      const nombreArchivo = 'Historia_clinica-' + paciente.apellido + '-' + new Date();

      //Encabezado
      doc.addImage('../../assets/iconos/fav3.ico', 'PNG', 5, 5, 40 ,40);
      
      doc.rect(45, 5, 80, 40)
      doc.setFontSize(50);
      doc.text('ClinicApp', 50, 25);
      doc.setFontSize(20);
      doc.text('Historial Clínico', 55, 35);
      
      doc.rect(125, 5, 70, 40)
      doc.setFontSize(12);
      doc.text("Paciente: " + paciente.apellido + ', ' + paciente.nombre, 127, 10);
      doc.text("Dni: " + paciente.dni, 127, 15);
      doc.text("Edad: " + paciente.edad, 127, 20);
      doc.text("Email: " + paciente.email, 127, 25);

      doc.line( 10, 50, 200, 50); 

      let x = 15;
      let y = 60;

      historiaClinica.forEach( (turno, index) => {
        let yPosition = y * (index + 1)
        const fecha = this.formatDate(new Date(turno.fecha)).toLocaleUpperCase();
        const especialista = especialistas[especialistas.findIndex( (item) => { 
          return item.uid == turno.uid_doctor; 
        })];
        
        doc.setFontSize(28);
        doc.text(fecha, x, yPosition);
        doc.setFontSize(10);
        doc.text(turno.especialidad!, x, yPosition + 5);
        doc.text('Dr/a: ' + especialista.apellido! + ', ' + especialista.nombre, x, yPosition + 10);
        doc.text('Reseña: ' + turno.resenia!, x, yPosition + 15)


        doc.text('Altura:' + turno.historiaClinica?.altura, x, yPosition + 25)
        doc.text('Peso:' + turno.historiaClinica?.peso, x, yPosition + 30)
        doc.text('Temperatura:' + turno.historiaClinica?.temperatura, x, yPosition + 35)
        doc.text('Presión:' + turno.historiaClinica?.presion, x, yPosition + 40)

        let x2 = x + 100;
        let y2 = yPosition + 25;
        if(turno.historiaClinica!.dinamicos && turno.historiaClinica!.dinamicos!.length > 0){
          turno.historiaClinica?.dinamicos.forEach( (item) => {
            doc.text(item.clave.toLocaleUpperCase() + ': ' + item.valor.toLocaleUpperCase(), x2, y2);
            y2 = y2 + 5;
          });
        }

        doc.line( x, yPosition + 45, 200, yPosition + 45); 
      });

      doc.save(nombreArchivo + '.pdf')
    }
  }

  private formatDate(value:Date){
    const dia = new Date(value);
    const fo:FormatOptions = { locale: es};

    const dNombre = format(dia, 'EEEE', fo);
    const dNumero = getDate(dia);
    const mes = format(dia, 'LLLL', fo);
    const anio = getYear(dia);
        
    return dNombre + ' ' + dNumero + ' de ' + mes + ' del ' + anio;
  }


}
