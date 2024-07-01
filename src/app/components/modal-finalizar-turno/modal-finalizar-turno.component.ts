import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Turno } from '../../models/turno';
import { TurnoService } from '../../services/turno.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HistorialClinico } from '../../models/historiaClinica';
import Swal from 'sweetalert2';

@Component({
  selector: 'modal-finalizar-turno',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule
  ],
  templateUrl: './modal-finalizar-turno.component.html',
  styleUrl: './modal-finalizar-turno.component.scss'
})
export class ModalFinalizarTurnoComponent {
	private turnoServ:TurnoService = inject(TurnoService);
  private fb:FormBuilder = inject(FormBuilder);

  activeModal = inject(NgbActiveModal);

  @Input() turno!:Turno;
    
  form: FormGroup = new FormGroup({
    resenia: new FormControl('', [Validators.required]),
    altura: new FormControl('', [Validators.required]),
    peso: new FormControl('', [Validators.required]),
    temperatura: new FormControl('', [Validators.required]),
    presion: new FormControl('', [Validators.required]),
    dinamicos: this.fb.array([])
  });

  get resenia(): string {
    return this.form.get('resenia')?.value;
  }
  get altura() {
    return this.form.get('altura')?.value;
  }
  get peso() {
    return this.form.get('peso')?.value;
  }
  get temperatura() {
    return this.form.get('temperatura')?.value;
  }
  get presion() {
    return this.form.get('presion')?.value;
  }
  get dinamicos() {
    return this.form.get('dinamicos') as FormArray;
  }

  agregarDatoDinamico() {
    if (this.dinamicos.length < 3) {
      this.dinamicos.push(this.fb.group({
        clave: ['', Validators.required],
        valor: ['', Validators.required]
      }));
    }
  }

  eliminarDatoDinamico(index: number) {
    if (this.dinamicos.length > 0) {
      this.dinamicos.removeAt(index);
    }
  }



  async finalizar(){
    if(this.form.valid){
      const nuevaHistoriaClinica = <HistorialClinico>{
        altura: this.altura,
        peso: this.peso,
        temperatura: this.temperatura,
        presion: this.presion,
        dinamicos: this.dinamicos.value
      }

      this.turno.resenia = this.resenia;
      this.turno.historiaClinica = nuevaHistoriaClinica;
      this.turno.estado = 'Realizado';

      await this.turnoServ.updateTurno(this.turno).then( () => {
        this.activeModal.close('Close click');
        Swal.fire({
          title: 'Finalizar turno',
          text: 'Turno finalizado exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          showCancelButton: false,
        });
      });
    }
  }  




}
