import { Component, ElementRef, inject, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { TurnoService } from '../../../services/turno.service';
import { EspecialidadService } from '../../../services/especialidad.service';
import { EspecialidadModel } from '../../../models/especialidad';
import { Turno } from '../../../models/turno';
import { Chart, ChartTypeRegistry, TooltipItem, registerables } from 'chart.js'
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'turnos-por-especialidad',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule
   ],
  templateUrl: './turnos-por-especialidad.component.html',
  styleUrl: './turnos-por-especialidad.component.scss'
})
export class TurnosPorEspecialidadComponent implements OnInit, OnChanges {
  private especialidadesServ:EspecialidadService = inject(EspecialidadService);
  
  @ViewChild('content') content!: ElementRef;
  @ViewChildren('grafico') canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;
  titulo:string = 'Cantidad de Turnos por Especialidad';

  especialidades:EspecialidadModel[] = [];
  // turnos:Turno[] = [];
  @Input() turnos!:Turno[]
  
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
  chartTurnosPorEspecialidad!:any;
    
  renderPieChart(){
    if(this.chartTurnosPorEspecialidad){
      this.chartTurnosPorEspecialidad.destroy();
    }
    this.crearPieChartTurnosPorEspecialidad();
  }
  
  crearPieChartTurnosPorEspecialidad(){
    const turnosPorEspecialidad:any = {};

    this.especialidades.map(item => item.especialidad).forEach( esp => {
      let countEsp = 0
      this.turnos.forEach(turno => {
        if(turno.especialidad == esp){
          countEsp++;
        }
      });
      turnosPorEspecialidad[esp] = countEsp;
    });

    const data = {
      labels: this.especialidades.map(item => item.especialidad),
      datasets: [{
        label: 'Cantidad',
        data: this.especialidades.map(item => turnosPorEspecialidad[item.especialidad] || 0), 
        backgroundColor: this.backgroundColor
      },
      {
        label: 'Porcentaje %',
        data: (this.especialidades.map(item => turnosPorEspecialidad[item.especialidad] / this.turnos.length * 100) || 0), 
        backgroundColor: this.backgroundColor
      }]
    };
    
    this.chartTurnosPorEspecialidad = new Chart('piechartTurnosEspecialidad', {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Cant. turnos por Especialidad'
          },
        },
        animation: false,
        maintainAspectRatio: false
      }
    });
  }
  

  async ngOnInit(){
    this.especialidades = await firstValueFrom(this.especialidadesServ.getEspecialidadesconImagenes());
    if(this.turnos.length > 0 && this.especialidades.length > 0){
      this.renderPieChart();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['turnos'])
      this.renderPieChart();
  }
}
