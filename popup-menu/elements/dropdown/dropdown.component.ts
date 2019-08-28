import { Component, Input, ViewChild, ElementRef, AfterContentInit, Output, EventEmitter  } from '@angular/core';
import { DropdownService } from './dropdown.service';


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

    private _opened: boolean = false;

    constructor(private _dropdownService: DropdownService) {
        
    }

    ngAfterContentInit() {
        window.addEventListener('click', this._handleOutsideCLick.bind(this));
        window.addEventListener('keydown', this._handleKey.bind(this))
    }

    public open() {
        this.ddlist.nativeElement.style.height = "auto";
        this._opened = true;
    }

    public close() {
        this.ddlist.nativeElement.style.height = "0px";
        this._opened = false;
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

    private _handleKey(e: KeyboardEvent) {
        const regx = /^[A-Za-z]+$/;

        if (this._opened && e.key.match(regx)) {
            const idx = this.entries.findIndex(entry => entry.toLowerCase().startsWith(e.key))

            if (idx > 0) {
                this.ddlist.nativeElement.scrollTo({top: idx * 24 - 48});
            }

        }
    }

}