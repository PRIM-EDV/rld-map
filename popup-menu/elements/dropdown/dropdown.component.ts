import { Component, Input, ViewChild, ElementRef, AfterContentInit, Output, EventEmitter  } from '@angular/core';


@Component({
    selector: 'dropdown',
    styleUrls: ['./dropdown.component.scss'],
    templateUrl: './dropdown.component.html'
})
export class DropdownComponent implements AfterContentInit {
    @Input()
    public entries: Array<string> = [];

    @ViewChild('ddlist', {static: true})
    public ddlist: ElementRef<HTMLDivElement>;

    @ViewChild('ddbox', {static: true})
    public ddbox: ElementRef<HTMLDivElement>;

    @Input()
    public value: string = "Test";

    @Output()
    public onValueChange: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
        
    }

    ngAfterContentInit() {
        window.addEventListener('click', this._handleOutsideCLick.bind(this));
    }

    public open() {
        this.ddlist.nativeElement.style.height = "auto";
    }

    public close() {
        this.ddlist.nativeElement.style.height = "0px";
    }

    public onItemClick(value: string) {
        this.value = value;
        this.onValueChange.emit(value);
    }

    public toggle(e: MouseEvent) {
        if (this.ddlist.nativeElement.offsetHeight > 0) {
            this.close();
        } else {
            this.open();
        }
    }

    private _handleOutsideCLick(e: MouseEvent) {
        if(e.target != this.ddbox.nativeElement){
            this.close();
        }
    }

}