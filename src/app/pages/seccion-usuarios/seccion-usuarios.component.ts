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

@Component({
  selector: 'app-seccion-usuarios',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, FormAdminComponent, FormPacienteComponent, FormEspecialistaComponent, CardUsuarioComponent, RouterLink
  ],
  templateUrl: './seccion-usuarios.component.html',
  styleUrl: './seccion-usuarios.component.scss'
})
export class SeccionUsuariosComponent implements OnInit{
  private storeServ:StoreService = inject(StoreService);
  private authServ:AuthService = inject(AuthService);
  
  usuarioLogueado:string = '';
  usuarios:Usuario[] = [];
  opcionSelecta:string = '';
  
  
  elegirOpcion(op:string){
    this.opcionSelecta = op;
    // this.usuarios = []; 
  }
  
  
  ngOnInit(): void {
    this.storeServ.getUsuarios().subscribe( (data) => {
      this.usuarios = data;
      console.log(data)
    });
    this.authServ.user$.subscribe( (data) => {
      this.usuarioLogueado = data?.email!;
    });
  }

}
