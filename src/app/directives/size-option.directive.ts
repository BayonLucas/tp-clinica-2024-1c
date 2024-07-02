import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSizeOption]',
  standalone: true
})
export class SizeOptionDirective {

  constructor(private el: ElementRef) {
  }  
  @HostListener("mouseenter") onMouseEnter() {
    this.el.nativeElement.style.cursor = 'pointer';
    this.el.nativeElement.style.width = '300px'
    this.el.nativeElement.style.height = '300px'
  }
  
  @HostListener("mouseleave") onMouseLeave() {
    this.el.nativeElement.style.cursor = 'pointer';
    this.el.nativeElement.style.height = '250px'
  }
}
