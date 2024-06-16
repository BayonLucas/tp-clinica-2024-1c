import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function confirmarEspecialidadRequired(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        
        const especialidad = formGroup.get('especialidad');
        const respuestaError = { required: 'La especialidad es requerida'};

        if (especialidad?.value == '') {
            formGroup.get('especialidad')?.setErrors(respuestaError);
            return respuestaError;
        } 
        else {
            formGroup.get('especialidad')?.setErrors(null);
            return null;
        }
    };
}