import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function confirmarOSRequired(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        
        const obra_social = formGroup.get('obra_social');
        const respuestaError = { required: 'La obra_social es requerida'};

        if (obra_social?.value == '') {
            formGroup.get('obra_social')?.setErrors(respuestaError);
            return respuestaError;
        } 
        else {
            formGroup.get('obra_social')?.setErrors(null);
            return null;
        }
    };
}