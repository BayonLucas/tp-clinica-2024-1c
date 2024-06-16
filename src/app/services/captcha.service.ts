import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { captchaBackend } from "../../../environment";


@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private http:HttpClient = inject(HttpClient);
  private back_tocken = captchaBackend.token;

  constructor() { }

  resolveCaptcha(userToken:any){
    return this.http.post('https://www.google.com/recaptcha/api/siteverify', {
      secret: this.back_tocken,
      response: userToken
    });
  }


}
