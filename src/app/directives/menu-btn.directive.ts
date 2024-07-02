import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appMenuBtn]',
  standalone: true
})
export class MenuBtnDirective {
  constructor(private el: ElementRef) {
  }  

  @HostListener("mouseenter") onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = '#22cbd1';
    this.el.nativeElement.style.cursor = 'pointer';
    this.el.nativeElement.style.color = 'white';
  }
  
  @HostListener("mouseleave") onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '#fea43dcc';
    this.el.nativeElement.style.cursor = 'pointer';
    this.el.nativeElement.style.color = 'black';
  }
}
