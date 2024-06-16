import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormPacienteComponent } from "../../components/form-paciente/form-paciente.component";
import { FormEspecialistaComponent } from "../../components/form-especialista/form-especialista.component";

@Component({
    selector: 'app-registro',
    standalone: true,
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.scss',
    imports: [
        ReactiveFormsModule, CommonModule,
        FormPacienteComponent,
        FormEspecialistaComponent
    ]
})
export class RegistroComponent implements OnInit{
  private router:Router = inject(Router);
  formElegido:string = '';

  elegirForm(rol:string){
    //Podría agregarse un spinner
    this.formElegido = rol
  }

  async ngOnInit(){
  }
}
