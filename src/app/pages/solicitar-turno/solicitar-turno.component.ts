import { Component, OnInit, inject } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { EspecialidadModel } from '../../models/especialidad';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-solicitar-turno',
    standalone: true,
    templateUrl: './solicitar-turno.component.html',
    styleUrl: './solicitar-turno.component.scss',
    imports: [
        FormsModule, ReactiveFormsModule, CommonModule, ListaDoctoresComponent, ListaEspecialidadesComponent, ListaDiasComponent, ListaHorariosComponent, CustomDatePipe, MatFormFieldModule, MatInputModule, MatAutocompleteModule, TranslateModule
    ]
})
export class SolicitarTurnoComponent implements OnInit{
  private userServ:UsuarioService = inject(UsuarioService);
  private turnoServ:TurnoService = inject(TurnoService);
  private router:Router = inject(Router);
  private toastServ:ToastService = inject(ToastService);

  usuario!:Usuario;
  paciente!:Usuario;
  myControl = new FormControl<string | Usuario>('');
  listaPacientes:Usuario[] = [];
  listaFiltradaPacientes!: Observable<Usuario[]>;
  
  doctorElegido!:Usuario;
  especialidadElegida:EspecialidadModel | null = null;  
  diaElegido:any | null = null;
  horarioElegido:any | null = null;

  onRecibirUsuario(event:any){
    this.doctorElegido = event;
    this.especialidadElegida = null;
    this.diaElegido = null;
    this.horarioElegido = null;
  }

  onRecibirEspecialidad(event:any){
    this.especialidadElegida = event;
    this.diaElegido = null;
    this.horarioElegido = null;
  }

  onRecibirDia(event:any){
    this.diaElegido = event;
    this.horarioElegido = null;
  }
  
  onRecibirHorario(event:any){
    this.horarioElegido = event;
  }

  registrarTurno(){
    try{
      if(this.usuario.rol == 'admin' && !this.paciente){
        throw new Error('Debe seleccionar un paciente.');
      }  
      if(this.doctorElegido && this.especialidadElegida && this.diaElegido && this.horarioElegido && this.usuario.rol == 'paciente' || 'admin'){
        const nuevoTurno = <Turno>{
          id: '',
          uid_doctor: this.doctorElegido.uid,
          uid_paciente: this.usuario.rol == 'paciente'? this.usuario.uid : this.paciente.uid,
          especialidad: this.especialidadElegida?.especialidad,
          fecha: this.horarioElegido.toString(),
          dia: getDate(this.horarioElegido),
          mes: getMonth(this.horarioElegido) + 1,
          anio: getYear(this.horarioElegido),
          hora: format(this.horarioElegido, 'HH:mm'),
          estado: 'Esperando confirmación',
          calificacion: null,
          resenia: null,
          encuesta: null,
          comentario: null
        }
        this.turnoServ.setTurno(nuevoTurno).then( () => {
          this.toastServ.showCustomToast('success', "Turno agendado", "El turno fue asignado exitosamente")
          this.router.navigateByUrl('/home');
        });
      }
    }
    catch(error:any){
      this.toastServ.showCustomToast('error', "Turno no asignado", "Favor de ingresar al paciente")
    }
  }

  private _filter(value: string): Usuario[] {
    const filterValue = value.toLowerCase();
    return this.listaPacientes.filter( (user:Usuario) => 
      user.apellido.toLowerCase().includes(filterValue) || user.nombre.toLowerCase().includes(filterValue) || user.dni.toLowerCase().includes(filterValue));
  }
  
  _showPaciente(value: Usuario | null){
    return value ? value!.apellido + ' ' + value!.nombre + ' - ' + value!.dni : '';
  }

  _selectPaciente(){
    const pac = this.myControl.value;
    this.paciente = pac as Usuario;
    console.log(this.paciente);
  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario')!);
    this.userServ.getUsuariosPorRol('paciente').subscribe( data => {
      this.listaPacientes = data;
      this.listaFiltradaPacientes = this.myControl.valueChanges.pipe( //VER
        startWith(''),
        map((value:any) => {
          const name = typeof value === 'string' ? value : value!.apellido + ' ' + value!.nombre + ' - ' + value!.dni;
          return name ? this._filter(name as string) : this.listaPacientes.slice();
        }),
      );
    });    
  }
}
