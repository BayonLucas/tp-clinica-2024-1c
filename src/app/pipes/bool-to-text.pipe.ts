import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolToText',
  standalone: true
})
export class BoolToTextPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    let lowerValue = value.toLocaleLowerCase();
    
    if(lowerValue == 'true'){
      lowerValue = 'SI';
    }
    if(lowerValue == 'false'){
      lowerValue = 'NO';
    }

    return lowerValue;
  }

}
