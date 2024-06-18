import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Usuario } from '../../models/usuario';
import { TurnoService } from '../../services/turno.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule
  ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss'
})
export class MiPerfilComponent implements OnInit {
  private authServ:AuthService = inject(AuthService);
  private storeServ:StoreService = inject(StoreService);
  private turnoServ:TurnoService = inject(TurnoService);
  private router:Router = inject(Router);

  usuario:Usuario | null = this.authServ.usuario;
  usuarioEditable:any;
  bkp_usuario:Usuario | null = null;
  diasSelectos:string[] = [];
  editar:boolean = false;

  diasLaborables = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado',];
  horariosSemana = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00'];
  horariosSabado = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00'];
  
  // actualizarUsuario(){
  //   this.diasSelectos.forEach(element => {
  //     this.usuarioEditable?.diasLaborales?.push(element);
  //   });
  //   console.log(this.usuarioEditable);
  //   this.storeServ.updateUsuario(this.usuarioEditable);
  // }
  actualizarUsuario(){
    // this.usuario!.diasLaborales = this.diasSelectos;
    // this.storeServ.updateUsuario(this.usuario!);
    this.turnoServ.generarTurnosProximosDosMeses(this.usuario!);
  }

  elegirDiaLaboral(event:any){
    let checked = event.target.checked;
    let dia = event.target.id;
    if(checked){
      this.diasSelectos.push(dia);
    }
    else{
      this.diasSelectos.splice(this.diasSelectos.indexOf(dia), 1)
    }
  }

  elegirhorario(event:any, input:string){
    console.log(event);
    switch(input){
      case 'semanaDesde':
        this.usuario!.horarioSemanaDesde = event.value;
        break;
        case 'semanaHasta':
        this.usuario!.horarioSemanaHasta = event.value;
        break;
        case 'sabadoDesde':
        this.usuario!.horarioSabadoDesde = event.value;
        break;
        case 'sabadoHasta':
        this.usuario!.horarioSabadoHasta = event.value;
        break;
    }
  }
  // elegirhorario(event:any, input:string){
  //   switch(input){
  //     case 'semanaDesde':
  //       this.usuarioEditable.horarioSemanaDesde = event.target.value;
  //       break;
  //       case 'semanaHasta':
  //       this.usuarioEditable.horarioSemanaHasta = event.target.value;
  //       break;
  //       case 'sabadoDesde':
  //       this.usuarioEditable.horarioSabadoDesde = event.target.value;
  //       break;
  //       case 'sabadoHasta':
  //       this.usuarioEditable.horarioSabadoHasta = event.target.value;
  //       break;
  //   }
  // }


  onClickEditar(){
    this.editar = !this.editar;
    this.bkp_usuario = {...this.usuario!}
  }
  onClickConfirmar(){
    this.editar = !this.editar;
    this.actualizarUsuario()
  }
  onClickCancelar(){
    this.editar = !this.editar;
    this.usuario = this.bkp_usuario;
  }

  ngOnInit(): void {
    if(!this.usuario){
    this.authServ.user$.subscribe( (data) => {
        this.storeServ.getUsuarioPorEmail(data?.email!).subscribe( res => {
          this.usuario = res;
          this.usuarioEditable = {...this.usuario};
        });
      });
    }
  }
}
