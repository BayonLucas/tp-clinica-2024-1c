import { Pipe, PipeTransform } from '@angular/core';
import { format, FormatOptions, getDate, getYear } from 'date-fns'
import { es, enUS, ptBR } from 'date-fns/locale';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
  //   const dia = new Date(value);

  //   const fo:FormatOptions = { locale: es};

  //   const dNombre = format(dia, 'EEEE', fo);
  //   const dNumero = getDate(dia);
  //   const mes = format(dia, 'LLLL', fo);
  //   const anio = getYear(dia);
        
  //   return dNombre + ' ' + dNumero + ' de ' + mes + ' del ' + anio;

    const dia = new Date(value);

    const idioma = localStorage.getItem('lang') || 'es';

    let selectedLocale;
    switch(idioma) {
      case 'en':
        selectedLocale = enUS;
        break;
      case 'pr':
        selectedLocale = ptBR;
        break;
      default:
        selectedLocale = es;
    }

    const dNombre = format(dia, 'EEEE', { locale: selectedLocale });
    const dNumero = getDate(dia);
    const mes = format(dia, 'LLLL', { locale: selectedLocale });
    const anio = getYear(dia);
    
    let fechaFormateada = '';
    
    switch(idioma) {
      case 'en':
        fechaFormateada = `${dNombre}, ${mes} ${dNumero}, ${anio}`;
        break;
      case 'pr':
        fechaFormateada = `${dNombre}, ${dNumero} de ${mes} de ${anio}`;
        break;
      default:
        fechaFormateada = `${dNombre} ${dNumero} de ${mes} del ${anio}`;
    }
    
    return fechaFormateada;
  }

}
