import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Usuario } from '../../models/usuario';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'btn-inicio-rapido',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './btn-inicio-rapido.component.html',
  styleUrl: './btn-inicio-rapido.component.scss'
})
export class BtnInicioRapidoComponent implements OnInit{
  private storeServ:StoreService = inject(StoreService);
  usuarios:Usuario[] = [];
  user!:Usuario

  @Input() email!:string;
  @Input() clave!:Usuario;
  @Output() onClick = new EventEmitter<{}>(); 
  
  enviar(user:any){
    return this.onClick.emit({
      email: user.email,
      clave: user.password
    });
  }

  ngOnInit(): void {
    this.storeServ.getUsuarioInicioRapido().subscribe( (data) => {
      this.usuarios = data
    })
  }
}
