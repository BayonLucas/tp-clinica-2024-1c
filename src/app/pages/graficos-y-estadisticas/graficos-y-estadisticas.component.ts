import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { Log } from '../../models/log';
import { EspecialidadModel } from '../../models/especialidad';
import { Turno } from '../../models/turno';
import { Chart, registerables } from 'chart.js'
import { Usuario } from '../../models/usuario';
import { Img, PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import { MatTabsModule } from '@angular/material/tabs';
import { firstValueFrom } from 'rxjs';
import { TablaLogsComponent } from '../../components/graficos-y-estadisticas/tabla-logs/tabla-logs.component';
import { TurnosPorEspecialidadComponent } from '../../components/graficos-y-estadisticas/turnos-por-especialidad/turnos-por-especialidad.component';
import { TurnosPorDiaComponent } from '../../components/graficos-y-estadisticas/turnos-por-dia/turnos-por-dia.component';
import { TurnosFinalizadosPorMedicoPeriodosComponent } from '../../components/graficos-y-estadisticas/turnos-finalizados-por-medico-periodos/turnos-finalizados-por-medico-periodos.component';
import { TurnosPorMedicoPeriodosComponent } from '../../components/graficos-y-estadisticas/turnos-por-medico-periodos/turnos-por-medico-periodos.component';
import { PacientesPorEspecialidadComponent } from '../../components/graficos-y-estadisticas/pacientes-por-especialidad/pacientes-por-especialidad.component';
import { MedicosPorEspecialidadComponent } from '../../components/graficos-y-estadisticas/medicos-por-especialidad/medicos-por-especialidad.component';
import { VisitasClinicaComponent } from '../../components/graficos-y-estadisticas/visitas-clinica/visitas-clinica.component';
import { TurnosPorPacienteComponent } from '../../components/graficos-y-estadisticas/turnos-por-paciente/turnos-por-paciente.component';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';
Chart.register(...registerables);

@Component({
  selector: 'app-graficos-y-estadisticas',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatTabsModule, TablaLogsComponent, TurnosPorEspecialidadComponent, TurnosPorDiaComponent, TurnosPorMedicoPeriodosComponent, TurnosFinalizadosPorMedicoPeriodosComponent, PacientesPorEspecialidadComponent, MedicosPorEspecialidadComponent, VisitasClinicaComponent, TurnosPorPacienteComponent
  ],
  templateUrl: './graficos-y-estadisticas.component.html',
  styleUrl: './graficos-y-estadisticas.component.scss'
})
export class GraficosYEstadisticasComponent implements OnInit{
  private turnoServ:TurnoService = inject(TurnoService);

  @ViewChild('content') content!: ElementRef;
  @ViewChildren('canvasElement') canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;

  logs:Log[] = [];
  especialidades:EspecialidadModel[] = [];
  doctores:Usuario[] = [];
  turnos:Turno[] = [];
  
  chartTurnosPorEspecialidad!:any;
  chartTurnosPorDia!:any;
  LinechartLog!:any;

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
  
  constructor(){
  }

  async capturarGraficoComoImagen(chartId: string): Promise<string> {
    const chartElement = document.getElementById(chartId);

    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      return canvas.toDataURL('image/png');
    }

    return '';
  }

  async agregarGraficoAlPdf(pdf: PdfMakeWrapper, chartId: string, titulo: string): Promise<void> {
    const imagenBase64 = await this.capturarGraficoComoImagen(chartId);
    const logo = await new Img(imagenBase64).absolutePosition(30,20).fit([40,40]).build();
    if (imagenBase64) {
      pdf.add([
        logo,
        new Txt(titulo).fontSize(14).bold().margin([0, 0, 0, 10]),

      ]
      );
    }
  }

  obtenerImagenesBase64DeCanvas(): Promise<string[]> {
    const imagenesBase64: string[] = [];
    this.canvasElements.forEach((canvasElementRef:any) => {
      console.log(canvasElementRef);
      // const canvasElement = canvasElementRef.nativeElement;
      const canvasElement = canvasElementRef.canvasElements.first.nativeElement;
      const imagenBase64 = canvasElement.toDataURL('image/png');
      imagenesBase64.push(imagenBase64);
    });
  
    return Promise.resolve(imagenesBase64);
  }

  obtenerTitulosDeCanvas(): Promise<string[]> {
    const imagenesBase64: string[] = [];
    this.canvasElements.forEach((canvasElementRef:any) => {
      imagenesBase64.push(canvasElementRef.titulo);
    });
  
    return Promise.resolve(imagenesBase64);
  }

  async imprimirPdf() {
    const pdf = new PdfMakeWrapper();
    PdfMakeWrapper.setFonts(pdfFonts);
    const logo = await new Img('../../assets/iconos/fav3.ico').absolutePosition(30,20).fit([40,40]).build();
    const imagenesBase64 = await this.obtenerImagenesBase64DeCanvas();
    const titulos = await this.obtenerTitulosDeCanvas();
    
    pdf.add([logo, new Txt('ClinicApp').color('gray').absolutePosition(73,35).fontSize(15).italics().end]);
    pdf.add('\n');
    pdf.add(new Txt('Estadisticas').decoration('underline').alignment('center').fontSize(20).bold().end);
    let hoy = new Date();
    pdf.add(new Txt(['', new Txt('Fecha: ').bold().end, ' ', hoy.getDate().toString(), '/', (hoy.getMonth() + 1).toString(), '/', hoy.getFullYear().toString()]).end);
    
    for (let i = 0; i < imagenesBase64.length; i++) {
      const img = imagenesBase64[i];
      const titulo = titulos[i];
  
      pdf.add(new Txt(titulo).alignment('center').fontSize(15).bold().margin([0, 10, 0, 10]).end);
  
      const grafico = await new Img(img).alignment('center').fit([450, 450]).margin([0, 0, 0, 40]).build();
      pdf.add(grafico);
    }

    pdf.create().download('estadisticas.pdf');
    pdf.create().open();
  }
  
  async ngOnInit() {
    this.turnos = await firstValueFrom(this.turnoServ.getTurnos());
  }
}
