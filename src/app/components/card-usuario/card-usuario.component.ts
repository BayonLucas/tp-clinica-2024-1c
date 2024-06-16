import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Usuario } from '../../models/usuario';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'card-usuario',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './card-usuario.component.html',
  styleUrl: './card-usuario.component.scss'
})
export class CardUsuarioComponent implements OnDestroy, OnInit{
  private storeServ:StoreService = inject(StoreService);
  loading:boolean = false;
  @Input() usuario!:Usuario;
  private estadoAutorizadoanterior!:boolean;
  
  async onChangeAutorizacionAdmin(event:any){
    // console.log(event.target.checked);
    // this.loading = true;
    // await this.storeServ.setAutorizAdminUsuario(this.usuario, event.target.checked)
    // setTimeout(() => {
      //   this.loading = false;
      // }, 1500)
      this.usuario.adminValidation = event.target.checked;
  }
  
  
  ngOnInit(): void {
    this.estadoAutorizadoanterior = this.usuario.adminValidation!;
  }
  ngOnDestroy(){
    if(this.estadoAutorizadoanterior != this.usuario.adminValidation){
      this.storeServ.setAutorizAdminUsuario(this.usuario, this.usuario.adminValidation!)
    }
  }
}
