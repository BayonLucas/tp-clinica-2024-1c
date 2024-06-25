import { Component, OnInit, inject } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { EspecialidadModel } from '../../models/especialidad';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListaDoctoresComponent } from '../../components/lista-doctores/lista-doctores.component';
import { ListaEspecialidadesComponent } from '../../components/lista-especialidades/lista-especialidades.component';
import { ListaDiasComponent } from '../../components/lista-dias/lista-dias.component';
import { ListaHorariosComponent } from '../../components/lista-horarios/lista-horarios.component';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../models/turno';
import { CustomDatePipe } from "../../pipes/custom-date.pipe";
import { Router } from '@angular/router';
import { format, getDate, getMonth, getYear } from 'date-fns';

@Component({
    selector: 'app-solicitar-turno',
    standalone: true,
    templateUrl: './solicitar-turno.component.html',
    styleUrl: './solicitar-turno.component.scss',
    imports: [
        FormsModule, ReactiveFormsModule, CommonModule, ListaDoctoresComponent, ListaEspecialidadesComponent, ListaDiasComponent, ListaHorariosComponent,
        CustomDatePipe
    ]
})
export class SolicitarTurnoComponent implements OnInit{
  private authServ:AuthService = inject(AuthService);
  private userServ:UsuarioService = inject(UsuarioService);
  private turnoServ:TurnoService = inject(TurnoService);
  private router:Router = inject(Router);
  private usuario!:Usuario;

  doctorElegido!:Usuario;
  especialidadElegida:EspecialidadModel | null = null;
  diaElegido:any | null = null;
  horarioElegido:any | null = null;

  onRecibirUsuario(event:any){
    this.doctorElegido = event;
    this.especialidadElegida = null;
    this.diaElegido = null;
    this.horarioElegido = null;
    console.log(event);
  }

  onRecibirEspecialidad(event:any){
    this.especialidadElegida = event;
    this.diaElegido = null;
    this.horarioElegido = null;
    console.log(event);
  }

  onRecibirDia(event:any){
    this.diaElegido = event;
    this.horarioElegido = null;
    console.log(event);
  }
  
  onRecibirHorario(event:any){
    this.horarioElegido = event;
    console.log(event);
  }

  registrarTurno(){
    if(this.doctorElegido && this.especialidadElegida && this.diaElegido && this.horarioElegido && this.usuario.rol == 'paciente' || 'admin'){
      

      console.log(this.horarioElegido);

      // const nuevoTurno = <Turno>{
      //   id: '',
      //   uid_doctor: this.doctorElegido.uid,
      //   uid_paciente: this.usuario.uid,
      //   especialidad: this.especialidadElegida?.especialidad,
      //   fecha: this.horarioElegido,
      //   dia: getDate(this.horarioElegido),
      //   mes: getMonth(this.horarioElegido) + 1,
      //   anio: getYear(this.horarioElegido),
      //   hora: format(this.horarioElegido, 'HH:mm'),
      //   estado: 'Esperando confirmación',
      //   calificacion: null,
      //   resenia: null,
      //   encuesta: null,
      //   comentario: null
      // }
      // this.turnoServ.setTurno(nuevoTurno).then( () => {
      //   this.router.navigateByUrl('/home');
      // })

    }
  }


  ngOnInit(): void {
    this.authServ.user$.subscribe( (data) => {
      this.usuario = this.authServ.usuario!;
      if(!this.usuario){
        this.userServ.getUsuarioPorEmail(data?.email!).subscribe( res => {
          this.usuario = res;
        });
      }
    });
  }
}
