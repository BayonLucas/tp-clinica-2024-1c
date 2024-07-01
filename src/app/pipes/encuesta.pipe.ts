import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encuesta',
  standalone: true
})
export class EncuestaPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const data = JSON.parse(value);
    console.log(data);
    
    return 'p: ' + data[0].p + ' - r: ' + data[0].r + '\n' +
      'p: ' + data[1].p + ' - r: ' + data[1].r + '\n' +
      'p: ' + data[2].p + ' - r: ' + data[2].r + '\n';

    
  }

}
