import { Component, Input, OnDestroy, OnInit, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { Usuario } from '../../models/usuario';
import { Turno } from '../../models/turno';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx'
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'favbutton-usuario',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgbCarouselModule
  ],
  templateUrl: './favbutton-usuario.component.html',
  styleUrl: './favbutton-usuario.component.scss'
})
export class FavbuttonUsuarioComponent implements OnInit{
  private turnoServ:TurnoService = inject(TurnoService);
  private userServ:UsuarioService = inject(UsuarioService);
	private modalService = inject(NgbModal);
  @Input() usuario!:Usuario;
  @Input() quienConsulta!:string;

  fotosUsuario:string[] = []
  turnos:Turno[] = [];
  showInfo:boolean = false;
  modalInfo!:Turno;
  private estadoAutorizadoanterior!:boolean;

  constructor(){

  }
  
  async onChangeAutorizacionAdmin(event:any){
    // console.log(event.target.checked);
    // this.loading = true;
    // await this.storeServ.setAutorizAdminUsuario(this.usuario, event.target.checked)
    // setTimeout(() => {
      //   this.loading = false;
      // }, 1500)
      this.usuario.adminValidation = event.target.checked;
      if(this.estadoAutorizadoanterior != this.usuario.adminValidation){
        this.userServ.setAutorizAdminUsuario(this.usuario, this.usuario.adminValidation!)
      }
  }

  onExportarTurnosUsuario(){
    if(this.quienConsulta == 'admin' && this.usuario.rol != 'admin'){
      const aux = this.turnos.map( turno => ({
        id: turno.id,
        uid_doctor: turno.uid_doctor,
        uid_paciente: turno.uid_paciente,
        especialidad: turno.especialidad,
        fecha: turno.fecha,
        dia: turno.dia,
        mes: turno.mes,
        anio: turno.anio,
        hora: turno.hora,
        estado: turno.estado,
        calificacion: turno.calificacion,
        resenia: turno.resenia,
        encuesta: turno.encuesta,
        comentario: turno.comentario,
        altura: turno.historiaClinica?.altura,
        peso: turno.historiaClinica?.peso,
        presion: turno.historiaClinica?.presion,
        temperatura: turno.historiaClinica?.temperatura,
        dinamico1: turno.historiaClinica?.dinamicos[0]?.clave + '-' + turno.historiaClinica?.dinamicos[0]?.valor,
        dinamico2: turno.historiaClinica?.dinamicos[1]?.clave + '-' + turno.historiaClinica?.dinamicos[1]?.valor,
        dinamico3: turno.historiaClinica?.dinamicos[2]?.clave + '-' + turno.historiaClinica?.dinamicos[2]?.valor,
      }));
      const ws = XLSX.utils.json_to_sheet(aux);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Placeholder');
      XLSX.writeFile(wb, this.usuario.apellido+'_turnos.xlsx');
    }
  }

  onClickFavButton(){
         this.showInfo = !this.showInfo;
    
    // else if(this.quienConsulta == 'admin' && this.usuario.rol != 'admin'){
    //   const aux = this.turnos.map( turno => ({
    //     id: turno.id,
    //     uid_doctor: turno.uid_doctor,
    //     uid_paciente: turno.uid_paciente,
    //     especialidad: turno.especialidad,
    //     fecha: turno.fecha,
    //     dia: turno.dia,
    //     mes: turno.mes,
    //     anio: turno.anio,
    //     hora: turno.hora,
    //     estado: turno.estado,
    //     calificacion: turno.calificacion,
    //     resenia: turno.resenia,
    //     encuesta: turno.encuesta,
    //     comentario: turno.comentario,
    //     altura: turno.historiaClinica?.altura,
    //     peso: turno.historiaClinica?.peso,
    //     presion: turno.historiaClinica?.presion,
    //     temperatura: turno.historiaClinica?.temperatura,
    //     dinamico1: turno.historiaClinica?.dinamicos[0]?.clave + '-' + turno.historiaClinica?.dinamicos[0]?.valor,
    //     dinamico2: turno.historiaClinica?.dinamicos[1]?.clave + '-' + turno.historiaClinica?.dinamicos[1]?.valor,
    //     dinamico3: turno.historiaClinica?.dinamicos[2]?.clave + '-' + turno.historiaClinica?.dinamicos[2]?.valor,
    //   }));
    //   const ws = XLSX.utils.json_to_sheet(aux);
    //   const wb = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, 'Placeholder');
    //   XLSX.writeFile(wb, this.usuario.apellido+'_turnos.xlsx');
    // }
  }

  openLg(content: TemplateRef<any>, turno:Turno) {
		this.modalService.open(content, { size: 'lg' });
    this.modalInfo = turno;
	}
  
  ngOnInit(): void {
    if(this.quienConsulta == 'especialista'){
      this.turnoServ.getTurnosPorEstadoYPaciente(this.usuario.uid, 'Realizado').subscribe( (data) => {
        this.turnos = data;
      });
    }
    else if(this.quienConsulta == 'admin'){
      if(this.usuario.rol == 'especialista'){
        this.turnoServ.getTurnosPorEspecialista(this.usuario.uid).subscribe( data => {
          this.turnos = data;
        });
      }
      else if(this.usuario.rol == 'paciente'){
        this.turnoServ.getTurnosPorPaciente(this.usuario.uid).subscribe( data => {
          this.turnos = data;
        });
      }
    }
    if(this.usuario.rol == 'paciente'){
      this.fotosUsuario = [
        this.usuario.fotoPerfil_1,
        this.usuario.fotoPerfil_2!
      ]
    }
    else if(this.usuario.rol == 'especialista'){
      this.fotosUsuario = [
        this.usuario.fotoPerfil_1,
      ]
    }
    else{
      this.fotosUsuario = [
        '../../../assets/img/incognito.jpg',
      ]
    }
  }
  // ngOnDestroy(){
  //   if(this.estadoAutorizadoanterior != this.usuario.adminValidation){
  //     this.userServ.setAutorizAdminUsuario(this.usuario, this.usuario.adminValidation!)
  //   }
  // }
}
