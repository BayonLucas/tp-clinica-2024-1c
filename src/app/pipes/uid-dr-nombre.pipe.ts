import { Pipe, PipeTransform, inject } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';

@Pipe({
  name: 'uidDrNombre',
  standalone: true
})
export class UidDrNombrePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const userServ:UsuarioService = inject(UsuarioService);
    const uid = value;

    userServ.getUsuarioPorUid(uid).subscribe( (data) => {
      // if(data.uid == uid){
        return data.apellido + ', ' + data.nombre;
      // }
    });
  }
}
