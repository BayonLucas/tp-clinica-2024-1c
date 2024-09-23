import { Component, ElementRef, inject, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { TurnoService } from '../../../services/turno.service';
import { EspecialidadService } from '../../../services/especialidad.service';
import { EspecialidadModel } from '../../../models/especialidad';
import { Turno } from '../../../models/turno';
import { Chart, ChartTypeRegistry, TooltipItem, registerables } from 'chart.js'
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario';
Chart.register(...registerables);
@Component({
  selector: 'encuestas',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './encuestas.component.html',
  styleUrl: './encuestas.component.scss'
})
export class EncuestasComponent implements OnInit, OnChanges {
  private userServ:UsuarioService = inject(UsuarioService);
  @ViewChild('content') content!: ElementRef;
  @ViewChildren('grafico') canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;
  titulo:string = 'Datos y estadisticas de las Encuestas realizadas';

  @Input() turnos!:Turno[]
  encuestas:Turno[] = [];
  doctores:Usuario[] = [];


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
  
  chartRecomendacion!:any;
  chartEstrellas!:any;
  chartPuntajeDoctores!:any;
  chartAspectosDestacados!:any;
  
  renderPieChart(){
    if(this.chartRecomendacion){
      this.chartRecomendacion.destroy();
    }
    this.crearPieChartRecomendaciones();
  }
  
  renderBarChart(){
    if(this.chartEstrellas){
      this.chartEstrellas.destroy();
    }
    this.crearBarChartEstrellas();
  }

  renderRadarChart(){
    if(this.chartAspectosDestacados){
      this.chartAspectosDestacados.destroy();
    }
    this.crearRadarChartAspectosDestacables();
  }
  
  renderBarSatisfChart(){
    if(this.chartPuntajeDoctores){
      this.chartPuntajeDoctores.destroy();
    }
    this.crearBarChartSatisfaccionPorDoctor();
  }
  
  crearPieChartRecomendaciones(){
    const recomendaciones:any = {};
    recomendaciones['positivo'] = this.encuestas.filter( (item:Turno) => {
      const enc = JSON.parse(item.encuesta!);
      return enc.recomendable == true;
    }).length;
    recomendaciones['negativo'] = this.encuestas.length - recomendaciones['positivo']

    const data = {
      labels: ['positivo', 'negativo'],
      datasets: [{
        label: 'Cantidad',
        data: ['positivo', 'negativo'].map(item => recomendaciones[item] || 0), 
        backgroundColor: this.backgroundColor
      },
      {
        label: 'Porcentaje %',
        data: (['positivo', 'negativo'].map(item => recomendaciones[item] / this.encuestas.length * 100) || 0), 
        backgroundColor: this.backgroundColor
      }]
    };
    
    this.chartRecomendacion = new Chart('pieChartRecomendable', {
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
            text: 'Recomendaciones positivas y negativas'
          },
        },
        animation: false,
        maintainAspectRatio: false
      }
    });
  }

  crearBarChartEstrellas(){
    const estrellas:any = {};
    const calificaciones = [1, 2, 3, 4, 5];

    calificaciones.forEach( star => {
      estrellas[star] = this.encuestas.filter( (item:Turno) => {
        let enc = JSON.parse(item.encuesta!);
        return enc.calificacion == star
      }).length;
    });

    const data = {
      labels: calificaciones.reverse(),
      datasets: [{
        label: 'Valoraciones (Estrellas)',
        data: calificaciones.map(item => estrellas[item] || 0), 
        backgroundColor: this.backgroundColor
      }]
    };

    this.chartEstrellas = new Chart('barChartEstrellas', {
      type: 'bar',
      data: data,
      options:{
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Valoraciones (Estrellas)'
          },
        },
        animation: false,
        maintainAspectRatio: false,
      }
    });
  }

  crearBarChartSatisfaccionPorDoctor(){
    const valoraciones:any = {};
    const totales:any = {};

    this.doctores.forEach( (doc:Usuario) => {
      const encuestasXdoc = this.encuestas.filter( item => item.uid_doctor == doc.uid);
      totales[doc.uid] = encuestasXdoc.length;
      if(encuestasXdoc.length > 0){
        valoraciones[doc.uid] = encuestasXdoc.map( (turno:Turno) => {
          let enc = JSON.parse(turno.encuesta!);
          return Number.parseInt(enc.satisf_Atencion);
        }).reduce( (p, c) => p + c, 0) / encuestasXdoc.length;
      }
      else{
        valoraciones[doc.uid] = 0;
      }
    });
    
    const data = {
      labels: this.doctores.map(item => item.apellido + " " +item.nombre),
      datasets: [{
        label: 'Promedios del grado de satisfacción por Doctor',
        data: this.doctores.map(item => valoraciones[item.uid]) || 0, 
        backgroundColor: this.backgroundColor
      },
      {
        label: 'Total de turnos con encuestas realizadas',
        data: this.doctores.map(item => totales[item.uid]) || 0, 
        backgroundColor: this.backgroundColor
      }],
    };

    this.chartPuntajeDoctores = new Chart('barChartPromediosSatisfDoc', {
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
            text: 'Calificación de la atención brindada por doctor'
          },
        },
        animation: false,
        maintainAspectRatio: false,
      }
    });
  }
  
  crearRadarChartAspectosDestacables(){
    const aspectosDestacables = ["eficiencia","confiabilidad","instalaciones","tecnologia","disponibilidad","atencion"];
    const values:any = {};

    aspectosDestacables.forEach((aspecto: string) => {
      values[aspecto] = 0;
    });

    this.encuestas.forEach((turno: Turno) => {
      const encuesta = JSON.parse(turno.encuesta!);
      encuesta.destacables.forEach((destacado: string) => {
        if (aspectosDestacables.includes(destacado)) {
          values[destacado] += 1;
        }
      });
    });

    const data = {
      labels: aspectosDestacables.map(item => item.toLocaleUpperCase()),
      datasets: [{
        label: 'valor',
        data: aspectosDestacables.map(item => values[item]) || 0, 
        backgroundColor: this.backgroundColor
      }]
    };

    this.chartAspectosDestacados = new Chart('radarChartDestacables', {
      type: 'radar',
      data: data,
      options:{
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Aspectos destacables'
          },
        },
        animation: false,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0, // Valor mínimo del eje radial
            max: 10, // Valor máximo del eje radial
            ticks: {
              stepSize: 1, // Mostrar los valores de 1 en 1
              // beginAtZero: true, // Comenzar desde 0
              precision: 0, // Mostrar sin decimales
            }
          }
        }
      }
    });
  }
  

  async ngOnInit(){
    this.doctores = await firstValueFrom(this.userServ.getUsuariosPorRol('especialista'));
    this.encuestas = this.turnos.filter( item => item.encuesta);
    if(this.turnos.length > 0 && this.doctores.length > 0){
      this.renderPieChart();
      this.renderBarChart();
      this.renderBarSatisfChart();
      this.renderRadarChart();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['turnos'])
      this.encuestas = this.turnos.filter( item => item.encuesta != null);
      this.renderPieChart();
      this.renderBarChart();
      this.renderBarSatisfChart();
      this.renderRadarChart();
  }
}
