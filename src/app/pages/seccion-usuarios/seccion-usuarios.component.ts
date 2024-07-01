import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormAdminComponent } from '../../components/form-admin/form-admin.component';
import { FormPacienteComponent } from '../../components/form-paciente/form-paciente.component';
import { FormEspecialistaComponent } from '../../components/form-especialista/form-especialista.component';
import { StoreService } from '../../services/store.service';
import { Usuario } from '../../models/usuario';
import { CardUsuarioComponent } from '../../components/card-usuario/card-usuario.component';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-seccion-usuarios',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, FormAdminComponent, FormPacienteComponent, FormEspecialistaComponent, CardUsuarioComponent, RouterLink, MatFormFieldModule, MatSelectModule
  ],
  templateUrl: './seccion-usuarios.component.html',
  styleUrl: './seccion-usuarios.component.scss'
})
export class SeccionUsuariosComponent implements OnInit{
  private storeServ:StoreService = inject(StoreService);
  private authServ:AuthService = inject(AuthService);
  
  usuarioLogueado:string = '';
  opcionSelecta:string = '';
  
  usuarios:Usuario[] = [];
  usuariosfiltrados:Usuario[] = [];
  filtro:string = 'Todos';


  elegirOpcion(op:string){
    this.opcionSelecta = op;
    // this.usuarios = []; 
  }
  
  aplicarFiltro(event:any){
    if(event == 'todos'){
      this.usuariosfiltrados = this.usuarios;
    }
    else{
      this.usuariosfiltrados = this.usuarios.filter( (user) => {
        return user.rol == event; 
      });
    }
  }
  
  ngOnInit(): void {
    this.storeServ.getUsuarios().subscribe( (data) => {
      this.usuarios = data;
      this.usuariosfiltrados = this.usuarios;
    });
    this.authServ.user$.subscribe( (data) => {
      this.usuarioLogueado = data?.email!;
    });
  }

}
