import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMiCaptchaReveled]',
  standalone: true
})
export class MiCaptchaReveledDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.setOpacity(0);  // Ajusta la opacidad inicial
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.setOpacity(1);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setOpacity(0);  // Ajusta la opacidad cuando el ratón sale
  }

  private setOpacity(opacity: number) {
    this.renderer.setStyle(this.el.nativeElement, 'opacity', opacity);
  }
}
