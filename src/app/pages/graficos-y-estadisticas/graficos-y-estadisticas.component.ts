import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { LogService } from '../../services/log.service';
import { Log } from '../../models/log';
import { EspecialidadService } from '../../services/especialidad.service';
import { EspecialidadModel } from '../../models/especialidad';
import { Turno } from '../../models/turno';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Chart, ChartTypeRegistry, TooltipItem, registerables } from 'chart.js'
import { compareAsc, format, } from 'date-fns';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { FiltroService } from '../../services/filtro.service';
import { Img, PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import html2canvas from 'html2canvas';
import { MatTabsModule } from '@angular/material/tabs';
import { firstValueFrom } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-graficos-y-estadisticas',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatTabsModule
  ],
  templateUrl: './graficos-y-estadisticas.component.html',
  styleUrl: './graficos-y-estadisticas.component.scss'
})
export class GraficosYEstadisticasComponent implements OnInit, AfterViewInit{
  private turnoServ:TurnoService = inject(TurnoService);
  private especialidadesServ:EspecialidadService = inject(EspecialidadService);
  private logServ:LogService = inject(LogService);
  private usuarioServ:UsuarioService = inject(UsuarioService);
  private filtroServ:FiltroService = inject(FiltroService);

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
    // this.turnoServ.getTurnos().subscribe( data => {
    //   this.turnos = data;
    //   this.renderizarBarchartTurnosEspecialidades();
    //   this.renderizarBarchartTurnosPorDia();
    //   this.renderizarLinechartLogsDiaYHorario();
      
    // });
    // this.logServ.getLogs().subscribe( data => {
    //   this.logs = data;
    //   this.renderizarBarchartTurnosEspecialidades();
    //   this.renderizarBarchartTurnosPorDia();
    //   this.renderizarLinechartLogsDiaYHorario();

    // });
    // this.especialidadesServ.getEspecialidadesconImagenes().subscribe( data => {
    //   this.especialidades = data;
    //   this.renderizarBarchartTurnosEspecialidades();
    //   this.renderizarBarchartTurnosPorDia();
    //   this.renderizarLinechartLogsDiaYHorario();

    // });
    // this.usuarioServ.getUsuariosPorRol('especialista').subscribe( data => {
    //   this.doctores = data;
    //   this.renderizarBarchartTurnosEspecialidades();
    //   this.renderizarBarchartTurnosPorDia();
    //   this.renderizarLinechartLogsDiaYHorario();

    // });
  }



  mostrarGraficoTab(index:any){
    switch(index){
      case 0:
        this.renderizarLinechartLogsDiaYHorario();
        break;
      case 1:
        this.renderizarBarchartTurnosEspecialidades();
        break;
      case 2:
        this.renderizarBarchartTurnosPorDia();
;        break;
      case 3:
        break;

    }
  }

  renderizarBarchartTurnosEspecialidades(){
    if(this.chartTurnosPorEspecialidad){
      this.chartTurnosPorEspecialidad.destroy();
    }
    this.crearBarchartTurnosEspecialidades();
  }

  crearBarchartTurnosEspecialidades(){
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
        label: 'Cantidad de turnos por especialidad',
        data: this.especialidades.map(item => turnosPorEspecialidad[item.especialidad] || 0), 
        backgroundColor: this.backgroundColor
      }]
    };

    this.chartTurnosPorEspecialidad = new Chart('barchartTurnosEspecialidad', {
      type: 'bar',
      data: data,
      options:{
        animation: false,
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  renderizarLinechartLogsDiaYHorario(){
    if(this.LinechartLog){
      this.LinechartLog.destroy();
    }
    this.crearLinechartLogsDiaYHorario();
  }

  crearLinechartLogsDiaYHorario(){
    const userStats: { [usuario: string]: { index: number; count: number } } = {};
    const usuariosFormateados = this.logs.map((log, index) => {
      const usuarioInfo = userStats[log.uid_usuario];
      if (usuarioInfo) {
        usuarioInfo.count += 1;
      } else {
        userStats[log.uid_usuario] = { index: index + 1, count: 1 };
      }
      return { index: userStats[log.uid_usuario].index, usuario: log.uid_usuario, count: userStats[log.uid_usuario].count };
    });
  
    const fechaHora = this.logs.map(item => {
      let aux = JSON.parse(JSON.stringify(item.fecha));
      const fechaHoraString = format(new Date(aux.seconds * 1000 + aux.nanoseconds / 1000000), 'HH:mm');
      return fechaHoraString;
    });


    const dias = this.logs.map( (log) => {
      let aux = JSON.parse(JSON.stringify(log.fecha));
      return format(new Date(aux.seconds * 1000 + aux.nanoseconds / 1000000), 'yyyy/MM/dd') 
    });

  
    this.LinechartLog = new Chart("LinechartLog", {
      type: 'line',
      data: {
        xLabels: dias,
        yLabels: fechaHora,
        datasets: [{
          label: 'Historial de ingresos',
          data: usuariosFormateados.map(usuario => usuario.count),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          pointRadius: 5,
          pointBackgroundColor: '#168ede', // Color del punto
          pointBorderColor: '#fff', // Color del borde del punto
          pointHoverRadius: 8, // Tamaño del punto al pasar el ratón
          pointHoverBackgroundColor: '#168ede', // Color del punto al pasar el ratón
          pointHoverBorderColor: '#fff' 
        }],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem: TooltipItem<keyof ChartTypeRegistry>) => {
                const usuario = usuariosFormateados[tooltipItem.dataIndex];
                return `Usuario: ${usuario.usuario}, Ingresos: ${usuario.count}`;
              }
            }
          }
        },
        // ... otras opciones
      }
    });
  }

  renderizarBarchartTurnosPorDia(){
    if(this.chartTurnosPorDia){
      this.chartTurnosPorDia.destroy();
    }
    this.crearBarchartTurnosPorDia();
  }

  crearBarchartTurnosPorDia(){
    const dias = this.filtroServ.ordenarPorFecha(this.turnos).map( (turno) => {
      return format(turno.fecha, 'yyyy/MM/dd') 
    });
    
    const turnosPorDia:any = {};
    dias.forEach( dia => {
      let countTurnos = 0
      this.turnos.forEach(turno => {
        if(dia == format(new Date(turno.fecha), 'yyyy/MM/dd')){
          countTurnos++;
        }
      });
      turnosPorDia[dia] = countTurnos;
    });

    const data = {
      labels: dias,
      datasets: [{
        label: 'Cantidad de turnos por día',
        data: dias.map(item => turnosPorDia[item] || 0), 
        backgroundColor: this.backgroundColor
      }]
    };

    this.chartTurnosPorDia = new Chart('barchartTurnosPorDia', {
      type: 'bar',
      data: data,
      options:{
        animation: false,
        responsive: true,
        maintainAspectRatio: false
      }
    });
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
  
    this.canvasElements.forEach(canvasElementRef => {
      const canvasElement = canvasElementRef.nativeElement;
      const imagenBase64 = canvasElement.toDataURL('image/png');
      imagenesBase64.push(imagenBase64);
    });
  
    return Promise.resolve(imagenesBase64);
  }

  async imprimirPdf() {
    const pdf = new PdfMakeWrapper();
    PdfMakeWrapper.setFonts(pdfFonts);
    const logo = await new Img('../../assets/iconos/fav3.ico').absolutePosition(30,20).fit([40,40]).build();
    const imagenesBase64 = await this.obtenerImagenesBase64DeCanvas();
    pdf.add([logo, new Txt('ClinicApp').color('gray').absolutePosition(73,35).fontSize(15).italics().end]);
    pdf.add('\n');
    pdf.add(new Txt('Estadisticas').decoration('underline').alignment('center').fontSize(20).bold().end);
    let hoy = new Date();
    pdf.add(new Txt(['', new Txt('Fecha: ').bold().end, ' ', hoy.getDate().toString(), '/', (hoy.getMonth() + 1).toString(), '/', hoy.getFullYear().toString()]).end);
    
    const grafico1 = await new Img(imagenesBase64[0]).absolutePosition(100, 120).fit([400, 400]).build();
    pdf.add(new Txt('Historial ingresos').alignment('center').fontSize(15).bold().end);
    pdf.add(grafico1);
    
    const grafico2 = await new Img(imagenesBase64[1]).absolutePosition(100,340).fit([400, 400]).build();
    pdf.add(new Txt('Cantidad de turnos por especialidad').absolutePosition(150,320).fontSize(15).bold().end);
    pdf.add(grafico2);
    
    const grafico3 = await new Img(imagenesBase64[2]).absolutePosition(100,540).fit([400, 400]).build();
    pdf.add(new Txt('Cantidad de turnos por día').absolutePosition(150,520).fontSize(15).bold().end);
    pdf.add(grafico3);
    // pdf.add(new Txt('Turnos Solicitados').absolutePosition(25,620).fontSize(15).bold().end);
    // const grafico4 = await new Img(imagenesBase64[3]).absolutePosition(25,650).fit([250, 250]).build();
    // pdf.add(grafico4);
    // pdf.add(new Txt('Turnos Finalizados').absolutePosition(350,620).fontSize(15).bold().end);
    // const grafico5 = await new Img(imagenesBase64[4]).absolutePosition(350,650).fit([250, 250]).build();
    // pdf.add(grafico5);
  
  
    pdf.create().download('estadisticas.pdf');
    pdf.create().open();
  }

  
  async ngOnInit() {
    this.turnos = await firstValueFrom(this.turnoServ.getTurnos());
    this.logs = await firstValueFrom(this.logServ.getLogs());
    this.especialidades = await firstValueFrom(this.especialidadesServ.getEspecialidadesconImagenes());
    this.doctores = await firstValueFrom(this.usuarioServ.getUsuariosPorRol('especialista'));
    
    this.renderizarBarchartTurnosEspecialidades();
    this.renderizarBarchartTurnosPorDia();
    this.renderizarLinechartLogsDiaYHorario();
  }

  ngAfterViewInit(): void {
  }

}
