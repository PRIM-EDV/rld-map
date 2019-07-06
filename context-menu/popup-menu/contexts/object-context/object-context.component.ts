import { Component, Input } from '@angular/core';
import { PopupContext } from '../../core/popup-context';
import { BackendService } from 'src/app/map/backend/backend.service';
import { PopupMenuComponent } from '../../popup-menu.component';


@Component({
    selector: 'object-context',
    // styleUrls: ['./popup-menu.component.scss'],
    // templateUrl: 'popup-menu.component.html',
})
export class ObjectContextComponent extends PopupContext {
    @Input() _backend: BackendService;
    @Input() _popupMenu: PopupMenuComponent;

    private _mapObjectId: string;

    constructor() {
        super();
    }

    public open(id: string) {
        
    }
}