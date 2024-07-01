import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { Turno } from '../../models/turno';
import { TurnoService } from '../../services/turno.service';
import { TurnoComponent } from '../../components/turno/turno.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FiltroService } from '../../services/filtro.service';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule, TurnoComponent, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.scss'
})
export class TurnosComponent implements OnInit{
  private authServ:AuthService = inject(AuthService);
  private userServ:UsuarioService = inject(UsuarioService);
  private turnoServ:TurnoService = inject(TurnoService);
  private filtroServ:FiltroService = inject(FiltroService);

  usuario:Usuario | null;
  turnos:Turno[] = [];
  turnosFiltrados:Turno[] = [];
  filtro:string='';
  usuario$:Observable<Usuario | null>;
  
  constructor(){
    this.usuario = this.authServ.usuario;
    this.usuario$ = new BehaviorSubject<Usuario | null>(this.usuario).asObservable(); 
  }
  
  ngOnInit(): void {
    this.usuario$.subscribe((usuario: Usuario | null) => {
      if (usuario === null) {
        this.authServ.user$.subscribe((user: any) => {
          this.userServ.getUsuarioPorUid(user.uid).subscribe((data) => {
            this.usuario = data;
            this.fetchTurnosForUser(this.usuario);
          });
        });
      } else {
        this.usuario = usuario;
        this.fetchTurnosForUser(this.usuario);
      }
    });
  }

  private fetchTurnosForUser(usuario: Usuario | null): void {
    if (usuario && usuario.rol === 'admin') {
      this.turnoServ.getTurnos().subscribe((data) => {
        this.turnos = this.filtroServ.ordenarPorFecha(data);
        this.turnosFiltrados = this.turnos;
      });
    }
  }

  ordenarSegunFiltro(){
    this.turnosFiltrados = this.filtroServ.filtrarTurnosPorSujeto_Especialiadad(this.turnos, this.filtro, this.usuario?.rol!)
  }

}
