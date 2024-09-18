import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [
    CommonModule, RouterLink, TranslateModule
  ],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.scss'
})
export class BienvenidoComponent{
}
