import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormPacienteComponent } from "../../components/form-paciente/form-paciente.component";
import { FormEspecialistaComponent } from "../../components/form-especialista/form-especialista.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-registro',
    standalone: true,
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.scss',
    imports: [
        ReactiveFormsModule, CommonModule,
        FormPacienteComponent,
        FormEspecialistaComponent, TranslateModule
    ]
})
export class RegistroComponent implements OnInit{
  formElegido:string = '';

  elegirForm(rol:string){
    this.formElegido = rol
  }

  async ngOnInit(){
  }
}
