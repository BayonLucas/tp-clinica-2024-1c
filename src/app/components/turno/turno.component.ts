import { Component, Input, OnInit, inject } from '@angular/core';
import { Turno } from '../../models/turno';
import { TurnoService } from '../../services/turno.service';
import { CustomDatePipe } from "../../pipes/custom-date.pipe";
import { UidDrNombrePipe } from "../../pipes/uid-dr-nombre.pipe";
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFinalizarTurnoComponent } from '../modal-finalizar-turno/modal-finalizar-turno.component';
import { EncuestaPipe } from "../../pipes/encuesta.pipe";
import { ModalEncuestaComponent } from '../modal-encuesta/modal-encuesta.component';


@Component({
    selector: 'app-turno',
    standalone: true,
    templateUrl: './turno.component.html',
    styleUrl: './turno.component.scss',
    imports: [CustomDatePipe, UidDrNombrePipe, CommonModule, ReactiveFormsModule, FormsModule, ModalFinalizarTurnoComponent, EncuestaPipe]
})
export class TurnoComponent implements OnInit{
  private turnoServ:TurnoService = inject(TurnoService);
  private userServ:UsuarioService = inject(UsuarioService);
	private modalService = inject(NgbModal);

  @Input() turno!:Turno;
  @Input() quienConsulta!:string;
  
  dr!:Usuario;
  paciente!:Usuario;
  verReseniaComentario:boolean = false;


  ngOnInit(): void {
    if(this.quienConsulta == 'especialista' || this.quienConsulta == 'admin'){
      this.userServ.getUsuarioPorUid(this.turno.uid_paciente).subscribe( data => {
        this.paciente = data;
      });
    }
    if(this.quienConsulta == 'paciente' || this.quienConsulta == 'admin'){
      this.userServ.getUsuarioPorUid(this.turno.uid_doctor).subscribe( data => {
        this.dr = data;
      });
    }
  }

  async cancelar_rechazarTurno(){
    const { value: comentario } = await Swal.fire({
      title: 'Cancelar/Rechazar turno',
      text: 'Favor de dejar un comentario del por qué cancela este turno',
      input: 'textarea',
      inputLabel: 'Comentario',
      showCancelButton: true
    });
    if(comentario){
      this.turno.estado = 'Rechazado';
      this.turno.comentario = comentario;
      this.turnoServ.updateTurno(this.turno).then( () => {
        this.resultadoMensaje(true, 'Turno Cancelado', 'Se ha cancelado el turno exitosamente');
      });
    }
    else{
      this.resultadoMensaje(false, 'Error al cancelar', 'Debe subir algun tipo de comentario');
    }
  }

  verReseniaComentarioClick(){
    this.verReseniaComentario = !this.verReseniaComentario; 
  }

  async calificarAtencion(){
    if(!this.turno.calificacion){
      const { value: calificacion } = await Swal.fire({
        title: 'Calificar atención',
        text: 'Qué tan satisfecho está con el turno recibido?',
        input: 'range',
        inputLabel: 'Calificación',
        inputAttributes: {
          min: "1",
          max: "10",
          step: "1"
        },
        inputValue: 5,
      });
      if(calificacion){
        this.turno.calificacion = calificacion;
        this.turnoServ.updateTurno(this.turno).then( () => {
          this.resultadoMensaje(true, 'Turno Calificado', 'Gracias por su calificación');
        });
      }
      else{
        this.resultadoMensaje(false, 'Error al calificar', 'Intentelo nuevamente');
      }
    }
    else{
      this.resultadoMensaje(false, 'Error al calificar', 'El servicio ya fue calificado previamente. Gracias!');
    }
  }

  async aceptarTurno(){
    this.turno.estado = 'Aceptado';
    await this.turnoServ.updateTurno(this.turno).then( () => {
      this.resultadoMensaje(true, 'Turno aceptado', '');
    })
    .catch( () => {
      this.resultadoMensaje(false, 'Turno aceptado', 'Hubo un error. Refresque la página');
    });
  }

  async completarEncuesta(){
    if(!this.turno.encuesta){
      const modalRef = this.modalService.open(ModalEncuestaComponent, { centered: true });
      modalRef.componentInstance.turno = this.turno;
      // const { value: formValues } = await Swal.fire({
      //   title: "Encuesta",
      //   html: `
      //     <p>Qué le pareció la atención dada?</p>
      //     <input id="swal-input1" class="swal2-input">
      //     <hr>
      //     <p>Qué opina del establecimiento?</p>
      //     <input id="swal-input2" class="swal2-input">
      //     <hr>
      //     <p>Recomendaría esta institución?</p>
      //     <input id="swal-input3" class="swal2-input">
      //   `,
      //   focusConfirm: false,
      //   preConfirm: () => {
      //     const input1 = document.getElementById("swal-input1") as HTMLInputElement;
      //     const input2 = document.getElementById("swal-input2") as HTMLInputElement;
      //     const input3 = document.getElementById("swal-input3") as HTMLInputElement;
  
      //     return [
      //       input1 ? {p: "Qué le pareció la atención dada?", r: input1.value} : null,
      //       input2 ? {p: "Qué opina del establecimiento?", r: input2.value} : null,
      //       input3 ? {p: "Recomendaría esta institución?", r: input3.value} : null,
      //     ];
      //   }
      // });
      // if (formValues) {
      //   this.turno.encuesta = JSON.stringify(formValues);
      //   await this.turnoServ.updateTurno(this.turno).then( () => {
      //     this.resultadoMensaje(true, 'Encuesta completada', '');
      //   });
      // }

    }
  }

  openFinalizar() {
		const modalRef = this.modalService.open(ModalFinalizarTurnoComponent, { centered: true });
		modalRef.componentInstance.turno = this.turno;
	}

  private async resultadoMensaje(exito:boolean, titulo:string, msj:string){
    await Swal.fire({
      title: titulo,
      text: msj,
      icon: exito? 'success' : 'error',
      timer: 2000,
      showConfirmButton: false,
      showCancelButton: false,
    });
  }
}
