import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit{
  authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);

  CerrarSesion(){
    this.authServ.singOutUser().then(() => this.router.navigateByUrl('/home'));
  }

  ngOnInit(): void {
    this.authServ.user$.subscribe( user => {
      if(user){
        this.authServ.currentUser!.set({
          uid: user.uid,
          email: user.email!,
        });
      }
      else{
        this.authServ.currentUser!.set(null);
      }
    });
  
  }
}
