import { Component, ElementRef, inject, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Turno } from '../../../models/turno';
import { Usuario } from '../../../models/usuario';
import { firstValueFrom, map, Observable, startWith } from 'rxjs';
import { UsuarioService } from '../../../services/usuario.service';
import { Chart, ChartTypeRegistry, TooltipItem, registerables } from 'chart.js'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
Chart.register(...registerables);


@Component({
  selector: 'turnos-por-paciente',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, AsyncPipe
  ],
  templateUrl: './turnos-por-paciente.component.html',
  styleUrl: './turnos-por-paciente.component.scss'
})
export class TurnosPorPacienteComponent implements OnInit{
  private userServ:UsuarioService = inject(UsuarioService);
  myControl = new FormControl<string | Usuario>('');
  @ViewChild('content') content!: ElementRef;
  @ViewChildren('grafico') canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;
  titulo:string = 'Turnos del paciente';
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
  chartTurnosDelPaciente!:any;
  
  @Input() turnos!:Turno[]
  turnosFiltradosPorPaciente:Turno[] = [];
  pacientes:Usuario[] = [];
  listaFiltradaPacientes!: Observable<Usuario[]>;
  pacienteElegido!:Usuario;

  _filter(value: string): Usuario[] {
    const filterValue = value.toLowerCase();
    return this.pacientes.filter( (user:Usuario) => 
      user.apellido.toLowerCase().includes(filterValue) || 
      user.nombre.toLowerCase().includes(filterValue) || 
      user.dni.toLowerCase().includes(filterValue));
  }
  
  _showPaciente(value: Usuario | null){
    return value ? value!.apellido + ' ' + value!.nombre + ' - ' + value!.dni : '';
  }

  _selectPaciente(){
    const pac = this.myControl.value;
    this.pacienteElegido = pac as Usuario;

    this.turnosFiltradosPorPaciente = this.turnos.filter( item => item.uid_paciente == this.pacienteElegido.uid);
    this.renderBarChart();
  }

  renderBarChart(){
    if(this.chartTurnosDelPaciente){
      this.chartTurnosDelPaciente.destroy();
    }
    this.crearBarChartTurnosDelPaciente();
  }
  
  crearBarChartTurnosDelPaciente(){
    const turnosDelPaciente:any = {};
    const estadosTurnos = ['Realizado', 'Esperando confirmación', 'Aceptado', 'Rechazado']

    estadosTurnos.forEach( estado => {
      let countTurnos = 0;
      this.turnosFiltradosPorPaciente.forEach(turno => {
        if(estado == turno.estado){
          countTurnos++;
        }
      });
      turnosDelPaciente[estado] = countTurnos;
    });

    const data = {
      labels: estadosTurnos,
      datasets: [{
        label: 'Turnos Del Paciente - ' + this._showPaciente(this.pacienteElegido),
        data: estadosTurnos.map(item => turnosDelPaciente[item] || 0), 
        backgroundColor: this.backgroundColor
      }]
    };

    this.chartTurnosDelPaciente = new Chart('barChartTurnosPorPaciente', {
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
            text: 'Turnos Del Paciente - ' + this._showPaciente(this.pacienteElegido)
          },
        },
        animation: false,
        maintainAspectRatio: false,
      }
    });
  }

  async ngOnInit() {
    await firstValueFrom(this.userServ.getUsuariosPorRol('paciente')).then((data) => {
      this.pacientes = data;
  
      this.listaFiltradaPacientes = this.myControl.valueChanges.pipe(
        startWith(''), // Iniciar con cadena vacía
        map((value: string | Usuario | null) => {
          // Asegurarse de que sea una cadena para el filtro
          const filterValue = typeof value === 'string' ? value : this._showPaciente(value);
          return filterValue ? this._filter(filterValue) : this.pacientes.slice();
        })
      );
    });
  }
}
