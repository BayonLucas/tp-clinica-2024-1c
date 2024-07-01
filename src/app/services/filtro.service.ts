import { Injectable, inject } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../models/usuario';
import { Turno } from '../models/turno';

@Injectable({
  providedIn: 'root'
})
export class FiltroService {
  private usuarioServ: UsuarioService = inject(UsuarioService);
  
  allPacientes:Usuario[] = [];
  allEspecialistas:Usuario[] = [];
  
  constructor() {
    this.usuarioServ.getUsuariosPorRol('paciente').subscribe( (data) => {
      this.allPacientes = data;
    });
    this.usuarioServ.getUsuariosPorRol('especialista').subscribe( (data) => {
      this.allEspecialistas = data;
    });
  }

  ordenarPorFecha(turnos:Turno[]){
    return turnos.sort((a, b) => {
      const dateA = new Date(a.fecha).getTime();
      const dateB = new Date(b.fecha).getTime();

      return dateA - dateB;
    });
  }

  filtrarTurnosPorSujeto_Especialiadad(listaTurnos:Turno[], filtro:string, rol:string){
    return listaTurnos.filter( (turno) => {
      const matchEspecialidad = turno.especialidad.toLowerCase().includes(filtro.toLowerCase());
      
      let sujeto:Usuario;
      if(rol == 'admin' || rol == 'paciente'){
        this.allEspecialistas.forEach( doc => {
          if(doc.uid == turno.uid_doctor){
            sujeto = doc;
          }
        });
      }
      else{
        this.allPacientes.forEach( pac => {
          if(pac.uid == turno.uid_paciente){
            sujeto = pac;
          }
        });
      }

      const matchSujeto = sujeto!.apellido.toLowerCase().includes(filtro.toLowerCase()) || sujeto!.nombre.toLowerCase().includes(filtro.toLowerCase());
      
      return matchEspecialidad || matchSujeto;
    });
  }



}
