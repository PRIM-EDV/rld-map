import { Component, Input, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PopupContext } from '../popup-context';
import { PopupMenuComponent } from '../../popup-menu.component';
import { ContextMenuService } from '../../../shared/context-menu.service';
import { BackendService, MapObject } from 'src/app/map/backend/backend.service';

@Component({
    selector: 'object-context',
    styleUrls: ['../popup-menu-context.scss'],
    templateUrl: 'object-context.component.html',
})
export class ObjectContextComponent extends PopupContext {
    @Input() _backend: BackendService;

    @ViewChild('name') public inputName: ElementRef<HTMLInputElement>;

    private _mapObject: MapObject;
    public objectTypes: Array<{icon: string, type: string}> = [];
    private _popupMenu: PopupMenuComponent;

    constructor(private _contextMenuService: ContextMenuService) {
        super();

        this._popupMenu = this._contextMenuService.popupMenu;
        this.objectTypes.push({icon: "assets/icons/object_subtype/obj_default.png", type: "Salavage"});
        this.objectTypes.push({icon: "assets/icons/object_subtype/obj_deliver.png", type: "Salavage"});
        this.objectTypes.push({icon: "assets/icons/object_subtype/obj_science.png", type: "Salavage"});
        this.objectTypes.push({icon: "assets/icons/object_subtype/obj_static.png", type: "Salavage"});
        this.objectTypes.push({icon: "assets/icons/object_subtype/obj_target.png", type: "Salavage"});
        this.objectTypes.push({icon: "assets/icons/object_subtype/obj_unknown.png", type: "Salavage"});
    }

    public open(pos: {x: number, y: number}, mapObject: MapObject) {
        const popupPosition = {x: pos.x - 48, y: pos.y - 48};

        this.position = pos;
        this.title = `Object (${mapObject.id.toUpperCase().substr(0, 8)})`;

        this._mapObject = mapObject;
        this.inputName.nativeElement.value = mapObject.name;
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
        this._mapObject.name = this.inputName.nativeElement.value;
        this._backend.setMapObject(this._mapObject);
        
        this._popupMenu.close();
    };
}