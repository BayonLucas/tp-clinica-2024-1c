import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { eachDayOfInterval, addDays, format } from 'date-fns';
import { es } from 'date-fns/locale'
import { HorarioService } from '../../services/horario.service';
import { Horario } from '../../models/horario';

@Component({
  selector: 'lista-dias',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule, 
  ],
  templateUrl: './lista-dias.component.html',
  styleUrl: './lista-dias.component.scss'
})
export class ListaDiasComponent implements OnInit, OnChanges{
  private horarioServ:HorarioService = inject(HorarioService);
  @Output() enviarDia = new EventEmitter(); 
  @Input() usuario!:Usuario;
  @Input() especialidad!:string;

  diasPosiblesSegunEspecialista:Date[] = [];
  horariosDelDoctor: Horario[] = [];

  constructor(){
    const hoy = new Date()
    this.diasPosiblesSegunEspecialista = eachDayOfInterval({
      start: hoy,
      end: addDays(hoy, 15)
    });
  }
  
  onEnviarDiaSelecto(event:any){
    this.enviarDia.emit(event);
  }
  
  filtrarDiasPosibles(){
    this.horarioServ.getHorarioLaboralPorUidYEspecialidad(this.usuario!.uid, this.especialidad!).subscribe( (data) => {
      this.horariosDelDoctor = data;
      this.diasPosiblesSegunEspecialista = eachDayOfInterval({
        start: new Date(),
        end: addDays(new Date(), 15)
      })
      .filter( date => {
        return this.horariosDelDoctor.some(item => {
          const dia = format(date, 'EEEE', { locale: es }).toLowerCase();
          return dia === item.dia.toLowerCase() && item.trabaja;
        });
      });
    });
  }
  
  ngOnInit(): void {
    this.filtrarDiasPosibles();        
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['especialidad'] || changes['usuario']){
      this.filtrarDiasPosibles();  
    }
  }
}
