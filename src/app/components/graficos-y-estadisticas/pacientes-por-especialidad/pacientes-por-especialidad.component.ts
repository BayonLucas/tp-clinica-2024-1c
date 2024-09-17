import { Component, ElementRef, inject, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { EspecialidadService } from '../../../services/especialidad.service';
import { EspecialidadModel } from '../../../models/especialidad';
import { Turno } from '../../../models/turno';
import { Chart, ChartTypeRegistry, TooltipItem, registerables } from 'chart.js'
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'pacientes-por-especialidad',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './pacientes-por-especialidad.component.html',
  styleUrl: './pacientes-por-especialidad.component.scss'
})
export class PacientesPorEspecialidadComponent implements OnInit, OnChanges {
  private especialidadesServ:EspecialidadService = inject(EspecialidadService);
  
  @ViewChild('content') content!: ElementRef;
  @ViewChildren('grafico') canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;
  titulo:string = 'Cantidad de Pacientes por Especialidad';
  especialidades:EspecialidadModel[] = [];
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
    const pacientesPorEspecialidad:any = {};

    this.especialidades.map(item => item.especialidad).forEach( esp => {
      const pacienteUnicoEspecialidad = new Set();
      
      this.turnos.forEach(turno => {
        if(turno.especialidad == esp){
          pacienteUnicoEspecialidad.add(turno.uid_paciente)
        }
      });
      pacientesPorEspecialidad[esp] = pacienteUnicoEspecialidad.size;
    });

    const data = {
      labels: this.especialidades.map(item => item.especialidad),
      datasets: [{
        label: 'Cantidad',
        data: this.especialidades.map(item => pacientesPorEspecialidad[item.especialidad] || 0), 
        backgroundColor: this.backgroundColor
      }]
    };
    
    this.chartTurnosPorEspecialidad = new Chart('piechartPacientesEspecialidad', {
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
            text: 'Cant. de pacientes por Especialidad'
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
