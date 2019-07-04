import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WheelMenuContext } from '../../../popup-menu/core/wheel-menu-context';
import { BackendService } from 'src/app/map/backend/backend.service';

@Component({
    selector: 'map-object-context',
    styleUrls: ['../wheel-menu-context.scss'],
    templateUrl: 'map-object-context.component.html',
})
export class MapObjectContextComponent extends WheelMenuContext {
    @Input() _backend: BackendService;
    @Output() onOpen = new EventEmitter();

    private _mapObjectId: string;

    constructor() {
        super();
    }

    public open(pos: {x: number, y: number}) {
        this.position = pos;
        this.onOpen.emit(this);
    }

    public placeEnemy(position: {x: number, y: number}) {
        const popupMenu = this._contextMenuService.popupMenu;
        const wheelMenu = this._contextMenuService.wheelMenu;

        backend.createMapObject().then(
            (res) => {
                popupMenu.objectContext.open('abc');
                wheelMenu.close();
            },
            (err) => {
                wheelMenu.close();
            }
        );
    }
}