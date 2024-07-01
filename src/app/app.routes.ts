import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { adminValidationGuard } from './guards/admin-validation.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'bienvenido', pathMatch: 'full' },
    { path:'bienvenido', 
        loadComponent: () => import('./pages/bienvenido/bienvenido.component').then(mod => mod.BienvenidoComponent)
    },
    { path:'home', 
        loadComponent: () => import('./pages/home/home.component').then(mod => mod.HomeComponent),
        // canActivate: [adminValidationGuard] 
    },
    { path:'login', 
        loadComponent: () => import('./pages/login/login.component').then(mod => mod.LoginComponent),
        // canActivate: [adminGuard]         
    },
    { path:'register', 
        loadComponent: () => import('./pages/registro/registro.component').then(mod => mod.RegistroComponent),
        // canActivate: [adminGuard] 
    },
    { path:'seccion_usuarios', 
        loadComponent: () => import('./pages/seccion-usuarios/seccion-usuarios.component').then(mod => mod.SeccionUsuariosComponent),
        // canActivate: [adminValidationGuard] 
        // canActivate: [adminGuard] 
    },
    { path:'mi-perfil', 
        loadComponent: () => import('./pages/mi-perfil/mi-perfil.component').then(mod => mod.MiPerfilComponent),
        // canActivate: [adminValidationGuard] 
        // canActivate: [adminGuard] 
    },
    { path:'solicitar-turno', 
        loadComponent: () => import('./pages/solicitar-turno/solicitar-turno.component').then(mod => mod.SolicitarTurnoComponent),
        // canActivate: [adminValidationGuard] 
        // canActivate: [adminGuard] 
    },
    { path:'turnos', 
        loadComponent: () => import('./pages/turnos/turnos.component').then(mod => mod.TurnosComponent),
        // canActivate: [adminValidationGuard] 
        // canActivate: [adminGuard] 
    },
    { path:'mis-turnos', 
        loadComponent: () => import('./pages/mis-turnos/mis-turnos.component').then(mod => mod.MisTurnosComponent),
        // canActivate: [adminValidationGuard] 
        // canActivate: [adminGuard] 
    },
    { path:'pacientes', 
        loadComponent: () => import('./pages/pacientes/pacientes.component').then(mod => mod.PacientesComponent),
        // canActivate: [adminValidationGuard] 
        // canActivate: [adminGuard] 
    },
    { path:'mis-turnos', 
        loadComponent: () => import('./pages/graficos-y-estadisticas/graficos-y-estadisticas.component').then(mod => mod.GraficosYEstadisticasComponent),
        // canActivate: [adminValidationGuard] 
        // canActivate: [adminGuard] 
    },
];
