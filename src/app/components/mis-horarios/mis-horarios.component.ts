import { Component, Input, OnInit, inject } from '@angular/core';
import { Horario } from '../../models/horario';
import { Usuario } from '../../models/usuario';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HorarioService } from '../../services/horario.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'mis-horarios',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule,
  ],
  templateUrl: './mis-horarios.component.html',
  styleUrl: './mis-horarios.component.scss'
})
export class MisHorariosComponent implements OnInit{
  private horarioServ:HorarioService = inject(HorarioService);
  @Input() usuario!:Usuario;
  editar:boolean = false;
  horarios:Horario[] = [];
  horariosBackUp:Horario[] = [];
  
  diasLaborables = [ 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', ];
  horariosSemana = [ '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00' ];
  horariosSabado = [ '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00' ];
    
  onClickEditar(){
    this.editar = !this.editar;
    // this.horarioServ.generarHorariosDefault(this.usuario);
  }

  onClickConfirmar(){
    this.editar = !this.editar;
    this.horarioServ.updateHorariosLote(this.horarios);
  }

  onClickCancelar(){
    this.editar = !this.editar;
    this.horarios = JSON.parse(JSON.stringify(this.horariosBackUp));
  }
  
  onChangeHorarioTrabaja(horario:Horario){
    if(!horario.trabaja){
      horario.desde = null;
      horario.hasta = null;
    }
  }

  ngOnInit(): void {
    this.horarioServ.getHorarioLaboralPorUid(this.usuario.uid).subscribe( (result) => {
      this.horarios = result;
      this.horariosBackUp = JSON.parse(JSON.stringify(result));
    });
  }
}
