import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { inject } from '@angular/core';

export const usuarioLogueadoDenegadoGuard: CanActivateFn = (route, state) => {
  const customToastServ:ToastService = inject(ToastService)
  const router:Router = inject(Router);
  
  const usuario = JSON.parse(localStorage.getItem('usuario')!);
  
  if(usuario){
    customToastServ.showCustomToast('info', 'Acceso denegado', 'Debe cerrar sesión para acceder.');
    router.navigateByUrl('/home')
    return false;
  }

  return true;};
