import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path:'home', 
        loadComponent: () => import('./pages/home/home.component').then(mod => mod.HomeComponent)
    },
    { path:'login', 
        loadComponent: () => import('./pages/login/login.component').then(mod => mod.LoginComponent) 
    },
    { path:'register', 
        loadComponent: () => import('./pages/registro/registro.component').then(mod => mod.RegistroComponent) 
    },
    { path:'seccion_usuarios', 
        loadComponent: () => import('./pages/seccion-usuarios/seccion-usuarios.component').then(mod => mod.SeccionUsuariosComponent),
        // canActivate: [adminGuard] 
    },
    { path:'mi-perfil', 
        loadComponent: () => import('./pages/mi-perfil/mi-perfil.component').then(mod => mod.MiPerfilComponent),
    },
];
