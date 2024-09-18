import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink, CommonModule, ReactiveFormsModule, NgbDropdownModule, TranslateModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit{
  authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);
  private translateServ:TranslateService = inject(TranslateService);

  lang:string = 'es';
  
  setLang(language:string){
    this.lang = language;
    this.translateServ.use(this.lang);
    localStorage.setItem('lang', this.lang);
    // console.log(selectedLang);
  }

  
  

  CerrarSesion(){
    this.authServ.cerrarSesionUsuario().then(() => this.router.navigateByUrl('/bienvenido'));
  }
  
  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'es';
    this.translateServ.setDefaultLang(this.lang);
    this.translateServ.use(this.lang);
  }
}
