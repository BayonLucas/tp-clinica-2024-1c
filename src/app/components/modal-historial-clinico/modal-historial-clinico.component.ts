import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../models/turno';
import { Usuario } from '../../models/usuario';
import { FiltroService } from '../../services/filtro.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsuarioService } from '../../services/usuario.service';
import { CustomDatePipe } from "../../pipes/custom-date.pipe";
import { PdfService } from '../../services/pdf.service';
import { BoolToTextPipe } from '../../pipes/bool-to-text.pipe';

@Component({
    selector: 'modal-historial-clinico',
    standalone: true,
    templateUrl: './modal-historial-clinico.component.html',
    styleUrl: './modal-historial-clinico.component.scss',
    imports: [
        FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule, CustomDatePipe, BoolToTextPipe
    ]
})
export class ModalHistorialClinicoComponent implements OnInit{
  private turnoServ:TurnoService = inject(TurnoService);
  private usuarioServ:UsuarioService = inject(UsuarioService);
  private filtroServ:FiltroService = inject(FiltroService);
  activeModal:NgbActiveModal = inject(NgbActiveModal);
  pdfServ:PdfService = inject(PdfService);
  
  @Input() usuario!:Usuario;
  historialClinico:Turno[] = [];
  historialClinicoFiltrado:Turno[] = [];
  filtro:Usuario[] = [];
  filtroElegido:Usuario | any = 'todos';
  
  
  
  
  
  aplicarFiltro(event:any){
    const index = event.target.value;

    if(index == 'todos'){
        this.historialClinicoFiltrado = this.historialClinico;
    }
    else{
      this.filtroElegido = this.filtro[index]
      console.log('Entré al else')
      this.historialClinicoFiltrado = this.historialClinico.filter( item => {
        return item.uid_doctor == this.filtroElegido.uid;
      });
    }
  }

  private obtenerUidEspecialistas(turnos:Turno[]){
    const uidEspecialistasSet = new Set<string>();
    
    turnos.forEach(turno => {
      uidEspecialistasSet.add(turno.uid_doctor);
    });
    
    return Array.from(uidEspecialistasSet);
  }
  
  ngOnInit(): void {
    this.turnoServ.getTurnosConHistoriaClinicaPorPaciente(this.usuario.uid).subscribe( data => {
      this.historialClinico = this.filtroServ.ordenarPorFecha(data, false);
      this.historialClinicoFiltrado = this.historialClinico;
      
      if(this.historialClinicoFiltrado.length > 0){
        this.usuarioServ.getEspecialistasSegunPaciente(this.obtenerUidEspecialistas(this.historialClinico)).subscribe( (data) => {
          this.filtro = data;
        });
      }
    });
  }
}
