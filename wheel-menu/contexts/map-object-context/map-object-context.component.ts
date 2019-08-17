
import { v4 as uuid } from 'uuid';

import { Component, Input } from '@angular/core';
import { WheelMenuContext } from '../wheel-menu-context';
import { ContextMenuService } from '../../../shared/context-menu.service';
import { BackendService, MapObject, Squad } from 'src/app/map/backend/backend.service';
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

    public placeFoe() {
        const mapObject = this._newFoe();

        this._popupMenu.foeContext.open(this.position, mapObject);
        this._wheelMenu.close();
    }

    public placeObject() {
        const mapObject = this._newObject();

        this._popupMenu.objectContext.open(this.position, mapObject);
        this._wheelMenu.close();
    }

    public placeFriend() {
        const operator = this._backend.getOperators().find((operator) => {
            return (this._backend.getMapObjects().find((mapObject) => {return mapObject.type == 'friend' && mapObject.meta.callsign == operator.callsign}) ? false : true);
        })

        if(operator) {
            const mapObject = this._newFriend(operator.callsign);
            this._popupMenu.friendContext.open(this.position, mapObject);
        }

        this._wheelMenu.close();
    }

    private _newFriend(callsign: string): MapObject {
        const squad = this._backend.getSquads()[0];
        const coord = new Coordinate();
        coord.inWindow = {x: this.position.x, y: this.position.y};

        return {
            id: uuid(),
            name: squad.name,
            coord: coord,
            pinned: false,
            update: true,
            type: 'friend',
            meta: {
                size: 5,
                wounded: 0,
                callsign: callsign,
                description: ''
            }
        }
    }

    private _newObject(): MapObject {
        const coord = new Coordinate();
        coord.inWindow = {x: this.position.x, y: this.position.y};

        return {
            id: uuid(),
            name: '',
            coord: coord,
            pinned: false,
            update: true,
            type: 'object',
            meta: {
                description: ''
            }
        }
    }

    private _newFoe(): MapObject {
        const coord = new Coordinate();
        coord.inWindow = {x: this.position.x, y: this.position.y};

        return {
            id: uuid(),
            name: '',
            coord: coord,
            pinned: false,
            update: true,
            type: 'foe',
            meta: {
                size: 5
            }
        }
    }
}