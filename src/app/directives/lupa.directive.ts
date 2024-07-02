import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLupa]',
  standalone: true
})
export class LupaDirective {

  constructor(private el:ElementRef){}

  @HostListener("mouseenter") onMouseEnter() {
    this.el.nativeElement.style.fontSize = '35px';
  }
  
  @HostListener("mouseleave") onMouseLeave() {
    this.el.nativeElement.style.fontSize = '15px';
  }

}
