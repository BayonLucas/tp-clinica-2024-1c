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
import { ToastService } from '../../services/toast.service';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'modal-finalizar-turno',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatSliderModule, MatSlideToggleModule, MatButtonModule
  ],
  templateUrl: './modal-finalizar-turno.component.html',
  styleUrl: './modal-finalizar-turno.component.scss'
})
export class ModalFinalizarTurnoComponent {
	private turnoServ:TurnoService = inject(TurnoService);
  private fb:FormBuilder = inject(FormBuilder);
  private toastServ:ToastService = inject(ToastService);

  activeModal = inject(NgbActiveModal);

  inputsEspeciales:string[] = ['range', 'numeric', 'boolean']
  inputsEspecialesBack:string[] = []

  @Input() turno!:Turno;
    
  form: FormGroup = new FormGroup({
    resenia: new FormControl('', [Validators.required]),
    altura: new FormControl('', [Validators.required]),
    peso: new FormControl('', [Validators.required]),
    temperatura: new FormControl('', [Validators.required]),
    presion: new FormControl('', [Validators.required]),
    dinamicos: this.fb.array([]),
    dinamicosEspeciales: this.fb.array([]),
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
  get dinamicosEspeciales() {
    return this.form.get('dinamicosEspeciales') as FormArray;
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
  
  agregarDatoDinamicoEspecial() {
    if (this.dinamicosEspeciales.length == 0) {
      const tipos = ['range', 'numeric', 'boolean'];
      tipos.forEach((tipo, index) => {
        if (!this.dinamicosEspeciales.controls[index]) {
          this.dinamicosEspeciales.push(this.fb.group({
            clave: ['', Validators.required],
            valor: [tipo == 'boolean' ? false : '', Validators.required],
            tipo: [tipo]
          }));
        }
      });
    }
    else{
      this.inputsEspecialesBack.forEach( (tipo, index) => {
        this.dinamicosEspeciales.push(this.fb.group({
          clave: ['', Validators.required],
          valor: [tipo == 'boolean' ? false : 0, Validators.required],
          tipo: [tipo]
        }));
      });
      this.inputsEspecialesBack = [];
    }
  }

  eliminarDatoDinamicoEspecial(index: number) {
    const input = this.dinamicosEspeciales.controls[index]
    console.log(input);

    this.inputsEspecialesBack.push(input.get('tipo')!.value)
    
    if (this.dinamicosEspeciales.length > 0) {
      this.dinamicosEspeciales.removeAt(index);
    }
  }

  async finalizar(){
    const especiales:any[] = this.dinamicosEspeciales.value;
    especiales.map( (item) => {
      console.log("clave", item.clave)
      console.log("valor", item.valor)
      item.clave = item.clave.toString();
      item.valor = item.valor.toString();
    });
    const dinamicosTotal = especiales.concat(this.dinamicos.value);
    if(this.form.valid){

      const nuevaHistoriaClinica = <HistorialClinico>{
        altura: this.altura,
        peso: this.peso,
        temperatura: this.temperatura,
        presion: this.presion,
        dinamicos: dinamicosTotal
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
    else{
      this.form.markAllAsTouched()
      this.toastServ.showCustomToast('error', 'Formulario incompleto', 'Favor de completar todos los campos o eliminar lo que no necesitan ser utilizados')
    }
  }  




}
