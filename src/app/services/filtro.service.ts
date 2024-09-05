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

  ordenarPorFecha(turnos:Turno[], asc:boolean = true){
    return turnos.sort((a, b) => {
      const dateA = new Date(a.fecha).getTime();
      const dateB = new Date(b.fecha).getTime();

      return asc? dateA - dateB : dateB - dateA;
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

  filtrarTurnosPorSujeto_Especialiadad_HistClinica(listaTurnos:Turno[], filtro:string, rol:string){
    return listaTurnos.filter( (turno) => {
      let resultados:boolean[] = [];
      const lowerFiltro = filtro.toLowerCase();
      
      const matchEspecialidad = turno.especialidad.toLowerCase().includes(lowerFiltro);
      resultados.push(matchEspecialidad);
      
      let sujeto:Usuario;
      if(rol == 'admin' || rol == 'paciente'){
        sujeto = this.allEspecialistas.find(doc => doc.uid == turno.uid_doctor)!;
      }
      else{
        sujeto = this.allPacientes.find(pac => pac.uid == turno.uid_paciente)!;

      }

      if(sujeto){
        const matchSujeto = sujeto!.apellido.toLowerCase().includes(lowerFiltro) || sujeto!.nombre.toLowerCase().includes(lowerFiltro);
        resultados.push(matchSujeto);
      }

      if(turno.historiaClinica){
        const matchAltura = turno.historiaClinica?.altura.toString().includes(lowerFiltro);
        const matchPeso = turno.historiaClinica?.peso.toString().includes(lowerFiltro);
        const matchTemp = turno.historiaClinica?.temperatura.toString().includes(lowerFiltro);
        const matchPresion = turno.historiaClinica?.presion.toString().includes(lowerFiltro);
        
        resultados.push(matchAltura);
        resultados.push(matchPeso);
        resultados.push(matchTemp);
        resultados.push(matchPresion);
        
        if(turno.historiaClinica.dinamicos && turno.historiaClinica.dinamicos.length > 0){
          const matchDinamicos = turno.historiaClinica?.dinamicos.some( (dinamic) => {
            return (dinamic.clave.toLowerCase().includes(lowerFiltro) || dinamic.valor.toLowerCase().includes(lowerFiltro))
          });
          resultados.push(matchDinamicos);
        }

      }

      return resultados.some(res => res);
    });
  }

  obtenerUidDeOpuestosSegunRol(rol:string, turnos:Turno[]){
    const uidSujetosSet = new Set<string>();
    
    turnos.forEach(turno => {
      let uid;
      if(rol == 'paciente'){
        uid = turno.uid_doctor;
      }
      else
      {
        uid = turno.uid_paciente;
      }
      uidSujetosSet.add(uid);
    });
    
    return Array.from(uidSujetosSet);
  }

}
