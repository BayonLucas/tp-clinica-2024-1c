import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink, CommonModule, ReactiveFormsModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent{
  authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);

  CerrarSesion(){
    this.authServ.cerrarSesionUsuario().then(() => this.router.navigateByUrl('/bienvenido'));
  }

}
