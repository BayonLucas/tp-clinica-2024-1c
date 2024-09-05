import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../models/turno';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastService } from '../../services/toast.service';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-modal-encuesta',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatSliderModule, MatSlideToggleModule, MatButtonModule, NgbRatingModule, MatRadioModule, MatCheckboxModule, NgbModule
],
  templateUrl: './modal-encuesta.component.html',
  styleUrl: './modal-encuesta.component.scss'
})
export class ModalEncuestaComponent {
	private turnoServ:TurnoService = inject(TurnoService);
  private toastServ:ToastService = inject(ToastService);
  rating = 0;
  activeModal = inject(NgbActiveModal);
  @Input() turno!:Turno;
    
  form: FormGroup = new FormGroup({
    comentario: new FormControl('', [Validators.required]),
    calificacion: new FormControl('', [Validators.required]),
    recomendable: new FormControl('', [Validators.required]),
    destacables: new FormArray([], []),
    satisf_Atencion: new FormControl('0', [Validators.required]),
  });

  get calificacion(): string {
    return this.form.get('calificacion')?.value;
  }
  get comentario() {
    return this.form.get('comentario')?.value;
  }
  get recomendable() {
    return this.form.get('recomendable')?.value;
  }
  get destacables() {
    return this.form.get('destacables') as FormArray;
  }
  get satisf_Atencion() {
    return this.form.get('satisf_Atencion')?.value;
  }

  onCheckboxChange(e: any) {
    const destacables: FormArray = this.form.get('destacables') as FormArray;
  
    if (e.checked) {
      destacables.push(new FormControl(e.source.name));
    } else {
      const index = destacables.controls.findIndex(x => x.value === e.source.name);
      destacables.removeAt(index);
    }
  }

  async finalizarEncuesta(){
    if(this.form.valid){
      this.turno.encuesta = JSON.stringify(this.form.value);
      this.turnoServ.updateTurno(this.turno);
      this.toastServ.showCustomToast('success', 'Encuesta terminada', 'Gracias por su opinión. Es muy valiosa para nosotros.')
      this.activeModal.close('Close click');
    }
    else{
        this.form.markAllAsTouched()
        this.toastServ.showCustomToast('error', 'Encuesta incompleta', 'Favor de completar todos los campos.')
    }
  }  

  ngOnInit(): void {
  }
}
