import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Usuario } from '../../models/usuario';
import { MisHorariosComponent } from '../../components/mis-horarios/mis-horarios.component';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MisHorariosComponent
  ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss'
})
export class MiPerfilComponent implements OnInit {
  private authServ:AuthService = inject(AuthService);
  private userServ:UsuarioService = inject(UsuarioService);
  usuario:Usuario | null = this.authServ.usuario;

  constructor() { }

  ngOnInit(): void {
    this.authServ.user$.subscribe( (data) => {
      this.usuario = this.authServ.usuario;
      if(!this.usuario){
        this.userServ.getUsuarioPorEmail(data?.email!).subscribe( res => {
          this.usuario = res;
        });
      }
    });
  }
}
