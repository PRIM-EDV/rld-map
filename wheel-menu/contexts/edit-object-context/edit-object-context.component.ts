
import { v4 as uuid } from 'uuid';

import { Component, Input } from '@angular/core';
import { WheelMenuContext } from '../wheel-menu-context';
import { ContextMenuService } from '../../../shared/context-menu.service';
import { PopupMenuComponent } from '../../../popup-menu/popup-menu.component';
import { WheelMenuComponent } from '../../wheel-menu.component';
import { BackendService, MapObject } from 'src/app/map/backend/backend.service';


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

    private _editMapObject() {
        switch(this._object.type) {
            case 'friend': {
                this._popupMenu.friendContext.open(this.position, this._object);
                break;
            }
            case 'foe': {
                this._popupMenu.foeContext.open(this.position, this._object);
                break;
            }
            case 'object': {
                this._popupMenu.objectContext.open(this.position, this._object);
                break;
            }
        }

        this._wheelMenu.close();
    }

    private _deleteMapObject() {
        this._backend.deleteMapObject(this._object.id).then(
            (res) => {
                this._wheelMenu.close();
            },
            (err) => {
                this._wheelMenu.close();
            }
        );
    }

    private _togglePinned() {
        this._object.pinned = !this._object.pinned;
        this._backend.setMapObject(this._object).then(
            (res) => {
                this._wheelMenu.close();
            },
            (err) => {
                this._wheelMenu.close();
            }
        )
    }
}