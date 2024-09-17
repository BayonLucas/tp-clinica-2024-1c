import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'timestampToDate',
  standalone: true
})
export class TimestampToDatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
   const fechaCompleta = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
   const fechaHoraString = format(fechaCompleta, 'dd/MM/yyyy HH:mm');
 
   return fechaHoraString;
  }

}
