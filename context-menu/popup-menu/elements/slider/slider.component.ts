import { Component, Input, ViewChild, ElementRef, AfterContentInit, Output, EventEmitter  } from '@angular/core';


@Component({
    selector: 'slider',
    styleUrls: ['./slider.component.scss'],
    templateUrl: './slider.component.html'
})
export class SliderComponent implements AfterContentInit {
    @ViewChild('handle')
    public handle: ElementRef<HTMLElement>;

    @ViewChild('slider')
    public slider: ElementRef<HTMLElement>;

    @ViewChild('bar')
    public bar: ElementRef<HTMLDivElement>;

    @Input()
    public max: number = 1.0;

    @Input()
    public min: number = 0.0;

    @Input()
    public steps: number = 1;

    @Input()
    public tickValues: Array<number> = [];

    @Input()
    public value: number;

    @Output()
    public valueChange: EventEmitter<number> = new EventEmitter();

    public index: number = 0;

    constructor() {
        
    }

    ngAfterContentInit() {
        let isDragged = false;

        this.value = this.getValueByIndex(this.index);
        
        this.slider.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
            const stepSize = this.slider.nativeElement.clientWidth / (this.steps -1);
            const relMouseX = e.x - this.slider.nativeElement.getBoundingClientRect().left;
            
            this.index = Math.min(Math.max(0, Math.round(relMouseX / stepSize)), this.steps - 1);
            this.value = this.getValueByIndex(this.index);
            this.valueChange.emit(this.value);
            this.update.call(this);

            isDragged = true;
        })

        window.addEventListener('mousemove', (e: MouseEvent) => {
            const stepSize = this.slider.nativeElement.clientWidth / (this.steps -1);
            const relMouseX = e.x - this.slider.nativeElement.getBoundingClientRect().left;

            if(isDragged) {
                this.index = Math.min(Math.max(0, Math.round(relMouseX / stepSize)), this.steps - 1); 
                this.value = this.getValueByIndex(this.index);
                this.valueChange.emit(this.value);
                this.update.call(this);
            }
        })

        window.addEventListener('mouseup', (e: MouseEvent) => {
            isDragged = false;
        })
    }

    public update() {
        const stepSize = this.slider.nativeElement.clientWidth / (this.steps -1);
        const offset = this.index * stepSize;

        this.handle.nativeElement.style.left = (offset - 6) + 'px';
        this.bar.nativeElement.style.width = offset + 'px';
    }

    public getValueByIndex(index: number) {
        return Math.round(((this.max - this.min) / (this.steps - 1)) * this.index + this.min)
    }

}