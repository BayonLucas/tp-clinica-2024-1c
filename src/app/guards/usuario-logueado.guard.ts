import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { UsuarioService } from '../services/usuario.service';
import { firstValueFrom, take } from 'rxjs';

export const usuarioLogueadoGuard: CanActivateFn = async (route, state) => {
  const customToastServ:ToastService = inject(ToastService)
  const router:Router = inject(Router);
  const userServ:UsuarioService = inject(UsuarioService);

  const usuario = JSON.parse(localStorage.getItem('usuario')!);
  // const usuario = await firstValueFrom(userServ.getUsuarioPorUid(usuario_id!).pipe(take(1)))
  
  if(!usuario){
    customToastServ.showCustomToast('info', 'Acceso denegado', 'Debe iniciar sesión para acceder.');
    router.navigateByUrl('/bienvenido')
    return false
  }

  return true;
};
