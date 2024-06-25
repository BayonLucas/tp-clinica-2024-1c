import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { EspecialidadService } from '../../services/especialidad.service';
import { EspecialidadModel } from '../../models/especialidad';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'lista-especialidades',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './lista-especialidades.component.html',
  styleUrl: './lista-especialidades.component.scss'
})
export class ListaEspecialidadesComponent implements OnInit{
  private espServ:EspecialidadService = inject(EspecialidadService);
  @Input() doctor!:Usuario;
  @Output() enviarEspecialidadSelecta = new EventEmitter();

  especialidades:EspecialidadModel[] = [];
  

  onEnviarEspecialidadSelecta(esp:any){
    this.enviarEspecialidadSelecta.emit(esp);
  }

  ngOnInit(): void {
    this.espServ.getEspecialidadesconImagenes().subscribe( (data) => {
      this.especialidades = data;
    });
  }
}
