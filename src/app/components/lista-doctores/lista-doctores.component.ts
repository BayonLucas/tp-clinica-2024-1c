import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SizeOptionDirective } from '../../directives/size-option.directive';

@Component({
  selector: 'lista-doctores',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule, SizeOptionDirective
  ],
  templateUrl: './lista-doctores.component.html',
  styleUrl: './lista-doctores.component.scss'
})
export class ListaDoctoresComponent implements OnInit{
  private userServ:UsuarioService = inject(UsuarioService);
  @Output() enviarUsuario = new EventEmitter();
  
  doctores:Usuario[] = [];

  onClickEnviarUsuario(usuarioSelecto:Usuario){
    this.enviarUsuario.emit(usuarioSelecto);
  }
  
  ngOnInit(): void {
    this.userServ.getUsuariosAdmitidosPorRol('especialista').subscribe( (data) => {
      this.doctores = data;
    })
  }
}
