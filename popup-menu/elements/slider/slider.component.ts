import { Component, Input, ViewChild, ElementRef, AfterContentInit, Output, EventEmitter  } from '@angular/core';


@Component({
    selector: 'slider',
    styleUrls: ['./slider.component.scss'],
    templateUrl: './slider.component.html'
})
export class SliderComponent implements AfterContentInit {
    @ViewChild('handle', {static: true})
    public handle: ElementRef<HTMLElement>;

    @ViewChild('slider', {static: true})
    public slider: ElementRef<HTMLElement>;

    @ViewChild('bar', {static: true})
    public bar: ElementRef<HTMLDivElement>;

    @Input()
    public max: number = 0.0;

    @Input()
    public min: number = 0.0;

    @Input()
    public steps: number = 1;

    @Output()
    public valueChange: EventEmitter<number> = new EventEmitter();

    public index: number = 0;

    private _tickValues: Array<number> = [];
    private _value: number = 0;

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
        const value = Math.round(((this.max - this.min) / (this.steps - 1)) * this.index + this.min);

        if(Number.isNaN(value)) {
            return 0;
        } else {
            return value;
        }
    }

    public getIndexByValue(value: number) {
        return Math.round((value - this.min) / ((this.max - this.min) / (this.steps - 1)));
    }

    @Input()
    public set tickValues(v: Array<number>) {
        this._tickValues = v;

        if(v[1] < this._value) {
            this.value = v[1];
        } else {
            this.update();
        } 
    }

    public get tickValues(): Array<number> {
        return this._tickValues;
    }

    @Input()
    public set value(v: number) {
        this._value = v;
        this.index = this.getIndexByValue(v);
        this.update();
    };

    public get value(): number {
        return this._value;
    };

}