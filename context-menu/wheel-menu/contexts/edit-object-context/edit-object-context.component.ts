
import { v4 as uuid } from 'uuid';

import { Component, Input } from '@angular/core';
import { WheelMenuContext } from '../../../popup-menu/core/wheel-menu-context';
import { BackendService, MapObject } from 'src/app/map/backend/backend.service';
import { ContextMenuService } from '../../../context-menu.service';
import { Coordinate } from 'src/app/map/backend/utils/coordinate.util';
import { PopupMenuComponent } from '../../../popup-menu/popup-menu.component';
import { WheelMenuComponent } from '../../wheel-menu.component';

@Component({
    selector: 'edit-object-context',
    styleUrls: ['../wheel-menu-context.scss'],
    templateUrl: 'edit-object-context.component.html',
})
export class EditObjectContextComponent extends WheelMenuContext {
    @Input() _backend: BackendService;

    private _popupMenu: PopupMenuComponent;
    private _wheelMenu: WheelMenuComponent;
    private _object: MapObject;

    constructor(private _contextMenuService: ContextMenuService) {
        super();

        this._popupMenu = this._contextMenuService.popupMenu;
        this._wheelMenu = this._contextMenuService.wheelMenu;
    }

    public open(pos: {x: number, y: number}, object: MapObject) {

        this.position = pos;
        this._object = object;

        this._wheelMenu.setPosition(pos);
        this._wheelMenu.setContext(this);
        this._wheelMenu.open();
    }

    private _deleteMapObject() {
        this._backend.deleteMapObject(this._object.id);
    }
}