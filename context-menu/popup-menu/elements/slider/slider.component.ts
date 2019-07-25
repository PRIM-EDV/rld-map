import { Component, Input, ViewChild, ElementRef, AfterContentInit } from '@angular/core';


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

    @Input()
    public max: number = 1.0;

    @Input()
    public min: number = 0.0;

    @Input()
    public steps: number = 5.0;

    private _mc: HammerManager;
    private _stepSize: number = 1.0;

    constructor() {
        
    }

    ngAfterContentInit() {
        let x = 0;
        this._mc = new Hammer(this.handle.nativeElement);

        console.log(this._stepSize)
    
        this._mc.on('panstart', (e: HammerInput) => {
            const width = this.slider.nativeElement.clientWidth;
            this._stepSize = width / this.steps;

            x = this.handle.nativeElement.offsetLeft;
        });
        this._mc.on('pan', (e: HammerInput) => {
            let displacement = Math.max(0, (x + this._stepSize * Math.round(e.deltaX / this._stepSize)))

            this.handle.nativeElement.style.left = displacement.toString() + 'px';
        });
        this._mc.on('panend', (e: HammerInput) => {
           
        });
    }



}