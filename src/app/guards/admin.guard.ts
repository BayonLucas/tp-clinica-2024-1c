import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const customToastServ:ToastService = inject(ToastService)
  const router:Router = inject(Router);

  const usuario = JSON.parse(localStorage.getItem('usuario')!);
  
  // if(!usuario){
  //   customToastServ.showCustomToast('info', 'Acceso denegado', 'Debe ser Admin para poder acceder.');
  //   router.navigateByUrl('/bienvenido')
  //   return false;
  // }

  if(usuario && usuario.rol != 'admin'){
    customToastServ.showCustomToast('info', 'Acceso denegado', 'Debe ser Admin para poder acceder.');
    router.navigateByUrl('/home')
    return false
  }

  return true;  
};
