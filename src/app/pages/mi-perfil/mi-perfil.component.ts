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
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalHistorialClinicoComponent } from '../../components/modal-historial-clinico/modal-historial-clinico.component';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MisHorariosComponent, ModalHistorialClinicoComponent
  ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss'
})
export class MiPerfilComponent implements OnInit {
  private authServ:AuthService = inject(AuthService);
  private userServ:UsuarioService = inject(UsuarioService);
  private modalService = inject(NgbModal);

  usuario:Usuario | null = this.authServ.usuario;

  constructor() { }






  openHistorialClinico() {
		const modalRef = this.modalService.open(ModalHistorialClinicoComponent, { centered: true, size: 'lg' });
		modalRef.componentInstance.usuario = this.usuario;
	}








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
