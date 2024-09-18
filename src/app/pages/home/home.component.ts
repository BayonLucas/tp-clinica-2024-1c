import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { CommonModule } from '@angular/common';
import { MenuBtnDirective } from '../../directives/menu-btn.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MenuBtnDirective, TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  private authServ:AuthService = inject(AuthService);
  private storeServ: StoreService = inject(StoreService);
  usuarioLogueado!:Usuario;
  

  


  ngOnInit(): void {
  //   this.authServ.user$.subscribe((user) => {
  //     if(user?.email){
  //       let usuarioLogueado$ = this.storeServ.getUsuarioPorEmail(user.email)
  //       usuarioLogueado$.subscribe( (data:any) => {
  //         this.usuarioLogueado = data;
  //         // console.log(this.usuarioLogueado)
  //       });
  //     }
  //   });
    this.usuarioLogueado = JSON.parse(localStorage.getItem('usuario')!);
  }
}
