import { Pipe, PipeTransform } from '@angular/core';
import { format, FormatOptions, getDate, getYear } from 'date-fns'
import { es } from 'date-fns/locale';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    const dia = new Date(value);
    const fo:FormatOptions = { locale: es};

    const dNombre = format(dia, 'EEEE', fo);
    const dNumero = getDate(dia);
    const mes = format(dia, 'LLLL', fo);
    const anio = getYear(dia);
        
    return dNombre + ' ' + dNumero + ' de ' + mes + ' del ' + anio;
  }

}
