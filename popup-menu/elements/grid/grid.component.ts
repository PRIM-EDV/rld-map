import { Component, Input, ViewChild, ElementRef, AfterContentInit, Output, EventEmitter  } from '@angular/core';


@Component({
    selector: 'grid',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html'
})
export class GridComponent implements AfterContentInit {
    @Input()
    public entries: Array<any> = []

    @Input()
    public activeEntry: string;

    constructor() {
        
    }

    ngAfterContentInit() {

    }

}