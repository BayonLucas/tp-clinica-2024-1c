import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { StoreService } from '../services/store.service';
import { Usuario } from '../models/usuario';
import { firstValueFrom, map } from 'rxjs';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authServ:AuthService = inject(AuthService);
  const usuario:Usuario | null = authServ.usuario
  
  debugger;
  console.log(usuario);
  if(usuario && usuario.rol == 'admin'){
    return true
  }

  return false;
};
