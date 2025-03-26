import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appMoveNextByEnter]'
})
export class MoveNextByEnterDirective {
    @Input() appMoveNextByEnter: string; // Optional: pass next field ID

    constructor(private el: ElementRef) { }

    @HostListener('keydown.enter', ['$event'])
    onEnter(event: KeyboardEvent) {
        event.preventDefault();

        const form = this.el.nativeElement.form;
        const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
        const index = inputs.indexOf(this.el.nativeElement);

        if (index < inputs.length - 1) {
            const nextInput = inputs[index + 1] as HTMLElement;
            nextInput.focus();
        }
    }
}