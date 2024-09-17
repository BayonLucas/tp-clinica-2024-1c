import { Component, ElementRef, inject, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { EspecialidadService } from '../../../services/especialidad.service';
import { EspecialidadModel } from '../../../models/especialidad';
import { Chart, ChartTypeRegistry, TooltipItem, registerables } from 'chart.js'
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';
Chart.register(...registerables);



@Component({
  selector: 'medicos-por-especialidad',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './medicos-por-especialidad.component.html',
  styleUrl: './medicos-por-especialidad.component.scss'
})
export class MedicosPorEspecialidadComponent implements OnInit, OnChanges {
  private especialidadesServ:EspecialidadService = inject(EspecialidadService);
  private userServ:UsuarioService = inject(UsuarioService);
  
  @ViewChild('content') content!: ElementRef;
  @ViewChildren('grafico') canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;
  
  private medicos:Usuario[] = [];
  private especialidades:EspecialidadModel[] = [];
  
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
  chartMedicosPorEspecialidad!:any;
  titulo:string = 'Cantidad de Médicos por Especialidad';

  renderPieChart(){
    if(this.chartMedicosPorEspecialidad){
      this.chartMedicosPorEspecialidad.destroy();
    }
    this.crearPiechartMedicosPorEspecialidad();
  }
  
  crearPiechartMedicosPorEspecialidad(){
    const medicosPorEspecialidad:any = {};

    this.especialidades.map(item => item.especialidad).forEach( esp => {
      const medicosUnicosPorEspecialidad = new Set();
      
      this.medicos.forEach(med => {
        if(med.especialidad?.some( item => item == esp)){
          medicosUnicosPorEspecialidad.add(med.uid)
        }
      });
      medicosPorEspecialidad[esp] = medicosUnicosPorEspecialidad.size;
    });

    const data = {
      labels: this.especialidades.map(item => item.especialidad),
      datasets: [{
        label: 'Cantidad',
        data: this.especialidades.map(item => medicosPorEspecialidad[item.especialidad] || 0), 
        backgroundColor: this.backgroundColor
      }]
    };
    
    this.chartMedicosPorEspecialidad = new Chart('piechartMedicosEspecialidad', {
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
            text: 'Cant. de Médicos por Especialidad'
          },
        },
        animation: false,
        maintainAspectRatio: false
      }
    });
  }
  

  async ngOnInit(){
    this.especialidades = await firstValueFrom(this.especialidadesServ.getEspecialidadesconImagenes());
    this.medicos = await firstValueFrom(this.userServ.getUsuariosPorRol('especialista'));
    if(this.medicos.length > 0 && this.especialidades.length > 0){
      this.renderPieChart();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['turnos'])
      this.renderPieChart();
  }
}
