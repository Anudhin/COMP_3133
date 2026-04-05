import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[customInputFormat]',
  standalone: true
})
export class InputFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('blur')
  onBlur() {
    this.el.nativeElement.value =
      this.el.nativeElement.value.toUpperCase();
  }
}