import { Component, Input, EventEmitter, Output } from '@angular/core';
import { PopupContext } from '../../core/popup-context';
import { BackendService } from 'src/app/map/backend/backend.service';
import { ContextMenuService } from '../../../context-menu.service';


@Component({
    selector: 'object-context',
    // styleUrls: ['./popup-menu.component.scss'],
    templateUrl: 'object-context.component.html',
})
export class ObjectContextComponent extends PopupContext {
    @Input() _backend: BackendService;

    private _mapObjectId: string;

    constructor(private _contextMenuService: ContextMenuService) {
        super();
    }

    public open(pos: {x: number, y: number}, id: string) {
        const popupMenu = this._contextMenuService.popupMenu;

        this.position = pos;
        popupMenu.setPosition(pos);
        popupMenu.setContext(this);
        popupMenu.open();
    }
}