import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  private translateServ:TranslateService = inject(TranslateService);

  title = 'tp-clinica-2024-1c';
  lang:string = '';



  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'es';
    this.translateServ.setDefaultLang(this.lang);
    this.translateServ.use(this.lang);
  }
}
