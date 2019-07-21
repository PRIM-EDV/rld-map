import { Component, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { PopupContext } from '../../core/popup-context';
import { BackendService, MapObject } from 'src/app/map/backend/backend.service';
import { ContextMenuService } from '../../../context-menu.service';
import { PopupMenuComponent } from '../../popup-menu.component';


@Component({
    selector: 'object-context',
    styleUrls: ['../popup-menu-context.scss'],
    templateUrl: 'object-context.component.html',
})
export class ObjectContextComponent extends PopupContext implements AfterViewInit{
    @Input() _backend: BackendService;

    private _inputName: HTMLInputElement;
    private _mapObject: MapObject;
    private _popupMenu: PopupMenuComponent;

    constructor(private _contextMenuService: ContextMenuService) {
        super();

        this._popupMenu = this._contextMenuService.popupMenu;
    }

    ngAfterViewInit() {
        this._inputName = document.getElementById('input-name') as HTMLInputElement;
    }

    public open(pos: {x: number, y: number}, mapObject: MapObject) {
        const popupPosition = {x: pos.x - 48, y: pos.y - 48};

        this.position = pos;
        this.title = `Object (${mapObject.id.toUpperCase().substr(0, 8)})`;

        this._mapObject = mapObject;
        this._popupMenu.setPosition(popupPosition);
        this._popupMenu.setContext(this);
        this._popupMenu.open();
    }

    public close() {

    }

    private _onCancel() {
        this._popupMenu.close();
    }

    private _onConfirm() {
        this._backend.setMapObject(this._mapObject);
        //this._backend.updateMapObject();
        this._popupMenu.close();
    };
}