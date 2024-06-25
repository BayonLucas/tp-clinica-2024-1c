import { Component, Input, OnInit, inject } from '@angular/core';
import { Horario } from '../../models/horario';
import { Usuario } from '../../models/usuario';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HorarioService } from '../../services/horario.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DIAS_LABORABLES, HORARIOS_SABADO, HORARIOS_SEMANA } from '../../constantes';

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
  
  diasLaborables = DIAS_LABORABLES;
  horariosSemana = HORARIOS_SEMANA;
  horariosSabado = HORARIOS_SABADO;
    
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
