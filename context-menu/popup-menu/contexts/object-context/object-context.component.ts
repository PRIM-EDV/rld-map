import { Component, Input, EventEmitter, Output } from '@angular/core';
import { PopupContext } from '../../core/popup-context';
import { BackendService } from 'src/app/map/backend/backend.service';
import { PopupMenuComponent } from '../../popup-menu.component';


@Component({
    selector: 'object-context',
    // styleUrls: ['./popup-menu.component.scss'],
    templateUrl: 'object-context.component.html',
})
export class ObjectContextComponent extends PopupContext {
    @Input() _backend: BackendService;
    @Output() onOpen = new EventEmitter();

    private _mapObjectId: string;

    constructor() {
        super();
    }

    public open(pos: {x: number, y: number}, id: string) {
        this.onOpen.emit(this);
    }
}