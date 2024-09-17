import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnChanges, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Turno } from '../../../models/turno';
import { Chart, ChartTypeRegistry, TooltipItem, registerables } from 'chart.js'
import { format, FormatOptions } from 'date-fns';
import { es } from 'date-fns/locale';
Chart.register(...registerables);

@Component({
  selector: 'turnos-por-dia',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './turnos-por-dia.component.html',
  styleUrl: './turnos-por-dia.component.scss'
})
export class TurnosPorDiaComponent implements OnChanges{
  
  
  @ViewChild('content') content!: ElementRef;
  @ViewChildren('grafico') canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;
  @Input() turnos!:Turno[]
  titulo:string = 'Cantidad de turnos por día de semana';

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
  chartTurnosPorDia!:any;
  
  renderPieChart(){
    if(this.chartTurnosPorDia){
      this.chartTurnosPorDia.destroy();
    }
    this.crearPieChartTurnosPorDia();
  }
  
  crearPieChartTurnosPorDia(){
    const turnosPorDia:any = {};
    const dias:string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', ]
    const fo:FormatOptions = { locale: es};
    
    dias.forEach( dia => {
      let countTurnoDia = 0
      this.turnos.forEach(turno => {
        let auxDia = format(turno.fecha, 'EEEE', fo);
        if(auxDia == dia.toLocaleLowerCase()){
          countTurnoDia++;
        }
      });
      turnosPorDia[dia] = countTurnoDia;
    });

    const data = {
      labels: dias,
      datasets: [{
        label: 'Cantidad',
        data: dias.map(item => turnosPorDia[item] || 0), 
        backgroundColor: this.backgroundColor
      },
      {
        label: 'Porcentaje %',
        data: (dias.map(item => turnosPorDia[item] / this.turnos.length * 100) || 0), 
        backgroundColor: this.backgroundColor
      }]
    };
    
    this.chartTurnosPorDia = new Chart('pieChartTurnosDia', {
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
            text: 'Cant. turnos por Día'
          },
        },
        animation: false,
        maintainAspectRatio: false
      }
    });
  }

  async ngOnInit(){
    if(this.turnos.length > 0){
      this.renderPieChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['turnos'])
      this.renderPieChart();
  }
}
