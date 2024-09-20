import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { usuarioLogueadoGuard } from './guards/usuario-logueado.guard';
import { especialistaGuard } from './guards/especialista.guard';
import { usuarioLogueadoDenegadoGuard } from './guards/usuario-logueado-denegado.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'bienvenido', pathMatch: 'full' },
    { path:'bienvenido', 
        loadComponent: () => import('./pages/bienvenido/bienvenido.component').then(mod => mod.BienvenidoComponent),
        canActivate: [usuarioLogueadoDenegadoGuard]
    },
    { path:'login', 
        loadComponent: () => import('./pages/login/login.component').then(mod => mod.LoginComponent),
        canActivate: [usuarioLogueadoDenegadoGuard]
    },
    { path:'register', 
        loadComponent: () => import('./pages/registro/registro.component').then(mod => mod.RegistroComponent),
        canActivate: [usuarioLogueadoDenegadoGuard]
    },
    { path:'home', 
        loadComponent: () => import('./pages/home/home.component').then(mod => mod.HomeComponent),
        canActivate: [usuarioLogueadoGuard]
    },
    { path:'seccion_usuarios', 
        loadComponent: () => import('./pages/seccion-usuarios/seccion-usuarios.component').then(mod => mod.SeccionUsuariosComponent),
        canMatch: [usuarioLogueadoGuard, adminGuard]
    },
    { path:'mi-perfil', 
        loadComponent: () => import('./pages/mi-perfil/mi-perfil.component').then(mod => mod.MiPerfilComponent),
        canActivate: [usuarioLogueadoGuard]
    },
    { path:'solicitar-turno', 
        loadComponent: () => import('./pages/solicitar-turno/solicitar-turno.component').then(mod => mod.SolicitarTurnoComponent),
        canActivate: [usuarioLogueadoGuard]
    },
    { path:'turnos', 
        loadComponent: () => import('./pages/turnos/turnos.component').then(mod => mod.TurnosComponent),
        canMatch: [usuarioLogueadoGuard, adminGuard]
    },
    { path:'mis-turnos', 
        loadComponent: () => import('./pages/mis-turnos/mis-turnos.component').then(mod => mod.MisTurnosComponent),
        canActivate: [usuarioLogueadoGuard]
    },
    { path:'pacientes', 
        loadComponent: () => import('./pages/pacientes/pacientes.component').then(mod => mod.PacientesComponent),
        canMatch: [usuarioLogueadoGuard, especialistaGuard]
    },
    { path:'graficos-y-estadisticas', 
        loadComponent: () => import('./pages/graficos-y-estadisticas/graficos-y-estadisticas.component').then(mod => mod.GraficosYEstadisticasComponent),
        canMatch: [usuarioLogueadoGuard, adminGuard]
    },
    { path:'data', 
        loadComponent: () => import('./pages/data/data.component').then(mod => mod.DataComponent),
        canMatch: [usuarioLogueadoGuard, adminGuard]
    },
];
