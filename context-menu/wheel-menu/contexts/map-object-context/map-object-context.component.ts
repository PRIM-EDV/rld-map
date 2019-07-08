import { Component, Input } from '@angular/core';
import { WheelMenuContext } from '../../../popup-menu/core/wheel-menu-context';
import { BackendService } from 'src/app/map/backend/backend.service';
import { ContextMenuService } from '../../../context-menu.service';

@Component({
    selector: 'map-object-context',
    styleUrls: ['../wheel-menu-context.scss'],
    templateUrl: 'map-object-context.component.html',
})
export class MapObjectContextComponent extends WheelMenuContext {
    @Input() _backend: BackendService;

    constructor(private _contextMenuService: ContextMenuService) {
        super();
    }

    public open(pos: {x: number, y: number}) {
        const wheelMenu = this._contextMenuService.wheelMenu;

        this.position = pos;
        wheelMenu.setPosition(pos);
        wheelMenu.setContext(this);
        wheelMenu.open();
    }

    public placeEnemy() {
        const popupMenu = this._contextMenuService.popupMenu;
        const wheelMenu = this._contextMenuService.wheelMenu;

        this._backend.createMapObject().then(
            (res) => {
                // popupMenu.objectContext.open('abc');
                wheelMenu.close();
            },
            (err) => {
                wheelMenu.close();
            }
        );
    }

    public placeObject() {
        const popupMenu = this._contextMenuService.popupMenu;
        const wheelMenu = this._contextMenuService.wheelMenu;

        this._backend.createMapObject().then(
            (res) => {
                popupMenu.objectContext.open(this.position, 'abc');
                wheelMenu.close();
            },
            (err) => {
                wheelMenu.close();
            }
        );
    }
}