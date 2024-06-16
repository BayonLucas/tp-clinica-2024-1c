import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function confirmarClaveValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        
        const clave = formGroup.get('password');
        const repiteClave = formGroup.get('confirmPassword');
        const respuestaError = { noCoincide: 'La clave no coincide' };

        if (clave?.value !== repiteClave?.value) {
        formGroup.get('confirmPassword')?.setErrors(respuestaError);
        return respuestaError;
        } 
        else {
        formGroup.get('confirmPassword')?.setErrors(null);
        return null;
        }
    };
}