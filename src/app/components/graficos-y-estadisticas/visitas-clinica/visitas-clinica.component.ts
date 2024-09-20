import { Component, ElementRef, inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Chart, registerables } from 'chart.js'
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Log } from '../../../models/log';
import { LogService } from '../../../services/log.service';
Chart.register(...registerables);


@Component({
  selector: 'visitas-clinica',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './visitas-clinica.component.html',
  styleUrl: './visitas-clinica.component.scss'
})
export class VisitasClinicaComponent implements OnInit {
  private logServ:LogService = inject(LogService);
  @ViewChild('content') content!: ElementRef;
  @ViewChildren('grafico') canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;
  titulo:string = 'Visitas a la Clínica';

  logs:Log[] = []
  
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
  chartVisitasClinica!:any;
    
  renderLineChart(){
    if(this.chartVisitasClinica){
      this.chartVisitasClinica.destroy();
    }
    this.crearLineChartVisitasClinica();
  }
  
  async crearLineChartVisitasClinica(){
    const data = await firstValueFrom(this.logServ.getLogsPorRangoDias(35));

    this.chartVisitasClinica = new Chart("lineChartVisitasClinica", {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          label: 'Ingresos',
          data: data.map(d => d.value),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
        }]
      }
    });
  }
  
  async ngOnInit(){
    // this.logs = await firstValueFrom(this.logServ.getLogs());
    // if(this.logs.length > 0){
      this.renderLineChart();
    // }
  }
}
