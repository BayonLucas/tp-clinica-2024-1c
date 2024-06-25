import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { HorarioService } from '../../services/horario.service';
import { TurnoService } from '../../services/turno.service';
import { eachMinuteOfInterval, format, getDate, getDay, getMonth, getYear, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { CustomDatePipe } from "../../pipes/custom-date.pipe";
import { HORARIOS_SABADO, HORARIOS_SEMANA } from '../../constantes';
import { Turno } from '../../models/turno';


@Component({
    selector: 'lista-horarios',
    standalone: true,
    templateUrl: './lista-horarios.component.html',
    styleUrl: './lista-horarios.component.scss',
    imports: [
        FormsModule, ReactiveFormsModule, CommonModule,
        CustomDatePipe
    ]
})
export class ListaHorariosComponent implements OnInit, OnChanges{
  private horarioServ:HorarioService = inject(HorarioService);
  private turnoServ:TurnoService = inject(TurnoService);
  @Output() enviarHorario = new EventEmitter(); 
  @Input() usuario!:Usuario;
  @Input() especialidad!:string;
  @Input() dia!:any;

  horariosPosibles:Date[] = [];
  turnosOcupados:Turno[] = [];

  constructor(){

  }
  


  onEnviarHorarioSelecto(event:any){
    this.enviarHorario.emit(event);
  }

  
  obtenerHorariosTurno(){
    this.horarioServ.getHorarioLaboralEspecifico(this.usuario!.uid, this.especialidad, format(this.dia, 'EEEE', { locale: es})).subscribe( data => {
      
      let horasLaborales = [];
      const diaElegido = format(this.dia!, 'EEEE', {locale: es}).toLocaleLowerCase();
      if(diaElegido == 'sábado' ){
        horasLaborales = HORARIOS_SABADO;   
      }
      else{
        horasLaborales = HORARIOS_SEMANA
      }
    
      horasLaborales = horasLaborales.slice(
        horasLaborales.indexOf(data[0].desde!),
        horasLaborales.indexOf(data[0].hasta!),
      );

      this.horariosPosibles = horasLaborales.map(hora => {
        return parse(hora, 'HH:mm', this.dia!);
      });
      
    });
    let dia = getDate(this.dia);
    let mes = getMonth(this.dia);
    let anio = getYear(this.dia);

    this.turnoServ.getTurnosPorDia(this.usuario!.uid, this.especialidad, dia, mes + 1, anio).subscribe( data => {
      this.turnosOcupados = data;
      console.log(this.turnosOcupados);
    });
  }


  ngOnInit(): void {
    this.obtenerHorariosTurno();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['usuario'] || changes['especialidad'] || changes['dia']){
      this.obtenerHorariosTurno();
    }
  }
}
