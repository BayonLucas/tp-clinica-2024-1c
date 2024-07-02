import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../models/turno';
import { FiltroService } from '../../services/filtro.service';
import { FavbuttonUsuarioComponent } from '../../components/favbutton-usuario/favbutton-usuario.component';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FavbuttonUsuarioComponent
  ],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent implements OnInit {
  private userServ:UsuarioService = inject(UsuarioService);
  private turnoServ:TurnoService = inject(TurnoService);
  private filtroServ:FiltroService = inject(FiltroService);
  private authServ:AuthService = inject(AuthService);

  usuarioLogueado!:Usuario | null;;
  pacientes:Usuario[] = [];
  turnos:Turno[] = [];

  constructor(){}

  
  obtenerTurnos(){
    this.turnoServ.getTurnosPorEspecialista(this.usuarioLogueado?.uid!).subscribe( (data) => {
      this.turnos = data;
      if(this.turnos && this.turnos.length > 0){  
        this.userServ.getPacientesSegunEspecialistas(this.filtroServ.obtenerUidDeOpuestosSegunRol(this.usuarioLogueado?.rol!, this.turnos)).subscribe( (res) => {
          this.pacientes = res;
        }); 
      }
    });
  }

    
  ngOnInit(): void {
    this.authServ.user$.subscribe((user: any) => {
      this.userServ.getUsuarioPorUid(user.uid).subscribe((data) => {
        this.usuarioLogueado = data;
        this.obtenerTurnos();
      });
    });
  } 
}
