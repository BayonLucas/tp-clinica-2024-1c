import { Component, ElementRef, inject, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { firstValueFrom } from 'rxjs';
import { TurnoService } from '../../../services/turno.service';
import { Turno } from '../../../models/turno';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario';
import { format, isWithinInterval } from 'date-fns';
import { Chart, ChartTypeRegistry, TooltipItem, registerables } from 'chart.js'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

Chart.register(...registerables);

@Component({
  selector: 'turnos-finalizados-por-medico-periodos',
  standalone: true,
  imports: [
    MatFormFieldModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, CommonModule
  ],
  templateUrl: './turnos-finalizados-por-medico-periodos.component.html',
  styleUrl: './turnos-finalizados-por-medico-periodos.component.scss'
})
export class TurnosFinalizadosPorMedicoPeriodosComponent implements OnInit, OnChanges {
  private userServ:UsuarioService = inject(UsuarioService);
  @ViewChild('content') content!: ElementRef;
  @ViewChildren('grafico') canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;
  titulo:string = 'Turnos FINALIZADOS por médico en un lapso';

  colores:string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
  backgroundColor: string[] =[
    'rgba(255, 99, 132, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(255, 205, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(201, 203, 207, 0.5)'
  ];
  chartTurnosPorMedico!:any;

  @Input() turnos!:Turno[]
  turnosFiltradosPorDia:Turno[] = [];
  especialistas:Usuario[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  get start(){
    return this.range.get('start')?.value;
  }
  get end(){
    return this.range.get('end')?.value;
  }

  resetFiltro(){
    this.range.patchValue({
      start: null,
      end: null
    });
    this.turnosFiltradosPorDia = this.turnos.filter( (item) => {
      return item.estado.toString() == 'Realizado';
    });

    this.renderBarChart();
  }

  actualizarFiltroRangoDia(event: MatDatepickerInputEvent<Date>){
    if(this.start && this.end && this.start <= this.end){
      this.turnosFiltradosPorDia = this.turnos.filter( (item) => {
        const turnoFecha = new Date(item.fecha);
        return isWithinInterval(turnoFecha, { start: this.start!, end: this.end! });      })

      this.renderBarChart();
    }
  }

  renderBarChart(){
    if(this.chartTurnosPorMedico){
      this.chartTurnosPorMedico.destroy();
    }
    this.crearBarChartTurnosPorMedico();
  }
  
  crearBarChartTurnosPorMedico(){
    const turnosPorMedico:any = {};
    this.especialistas.forEach( esp => {
      let countTurnos = 0;
      this.turnosFiltradosPorDia.forEach(turno => {
        if(esp.uid == turno.uid_doctor){
          countTurnos++;
        }
      });
      turnosPorMedico[esp.uid] = countTurnos;
    });

    const data = {
      labels: this.especialistas.map(item => item.nombre + ' ' + item.apellido),
      datasets: [{
        label: 'Cantidad de turnos FINALIZADOS solicitado por médico',
        data: this.especialistas.map(item => turnosPorMedico[item.uid] || 0), 
        backgroundColor: this.backgroundColor
      }]
    };

    this.chartTurnosPorMedico = new Chart('barChartTurnosFINALIZADOSPorMedicoPeriodo', {
      type: 'bar',
      data: data,
      options:{
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Cantidad de turnos finalizados por médico'
          },
        },
        animation: false,
        maintainAspectRatio: false,
      }
    });
  }

  async ngOnInit(){
    this.especialistas = await firstValueFrom(this.userServ.getUsuariosPorRol('especialista'))
    this.turnosFiltradosPorDia = this.turnos.filter( (item) => {
      return item.estado.toString() == 'Realizado';
    });
    this.renderBarChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['turnos']){
      this.turnosFiltradosPorDia = this.turnos.filter( (item) => {
        return item.estado.toString() == 'Realizado';
      });
      this.renderBarChart();
    }
  }

}