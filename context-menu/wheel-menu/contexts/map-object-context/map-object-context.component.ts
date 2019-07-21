
import { v4 as uuid } from 'uuid';

import { Component, Input } from '@angular/core';
import { WheelMenuContext } from '../../../popup-menu/core/wheel-menu-context';
import { BackendService, MapObject } from 'src/app/map/backend/backend.service';
import { ContextMenuService } from '../../../context-menu.service';
import { Coordinate } from 'src/app/map/backend/utils/coordinate.util';
import { PopupMenuComponent } from '../../../popup-menu/popup-menu.component';
import { WheelMenuComponent } from '../../wheel-menu.component';

@Component({
    selector: 'map-object-context',
    styleUrls: ['../wheel-menu-context.scss'],
    templateUrl: 'map-object-context.component.html',
})
export class MapObjectContextComponent extends WheelMenuContext {
    @Input() _backend: BackendService;

    public isActive: boolean = false;

    private _popupMenu: PopupMenuComponent;
    private _wheelMenu: WheelMenuComponent;

    constructor(private _contextMenuService: ContextMenuService) {
        super();

        this._popupMenu = this._contextMenuService.popupMenu;
        this._wheelMenu = this._contextMenuService.wheelMenu;
    }

    public open(pos: {x: number, y: number}) {
        const wheelMenu = this._contextMenuService.wheelMenu;

        this.position = pos;
        wheelMenu.setPosition(pos);
        wheelMenu.setContext(this);
        wheelMenu.open();
        this.isActive = true;
    }

    public close() {
        this.isActive = false;
    }

    public placeEnemy() {

    }

    public placeObject() {
        const mapObject = this._newObject();

        this._popupMenu.objectContext.open(this.position, mapObject);
        this._wheelMenu.close();
    }

    private _newObject(): MapObject {
        const coord = new Coordinate();
        coord.inWindow = {x: this.position.x, y: this.position.y};

        return {
            id: uuid(),
            name: '',
            coord: coord,
            update: true,
            type: 'object'
        }
    }
}