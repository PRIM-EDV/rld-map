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

    @ViewChild('name', {static: true}) public inputName: ElementRef<HTMLInputElement>;
    @ViewChild('description', {static: true}) public inputDescription: ElementRef<HTMLTextAreaElement>;

    public objectTypes: Array<{icon: string, type: number}> = [];

    private _mapObject: MapObject;
    private _popupMenu: PopupMenuComponent;
    private _subtype: number;

    constructor(private _contextMenuService: ContextMenuService) {
        super();

        this._popupMenu = this._contextMenuService.popupMenu;
        this.objectTypes.push({icon: "assets/icons/object_subtype/st0.png", type: 0});
        this.objectTypes.push({icon: "assets/icons/object_subtype/st1.png", type: 1});
        this.objectTypes.push({icon: "assets/icons/object_subtype/st2.png", type: 2});
        this.objectTypes.push({icon: "assets/icons/object_subtype/st3.png", type: 3});
        this.objectTypes.push({icon: "assets/icons/object_subtype/st4.png", type: 4});
        this.objectTypes.push({icon: "assets/icons/object_subtype/st5.png", type: 5});
    }

    public open(pos: {x: number, y: number}, mapObject: MapObject) {
        const popupPosition = {x: pos.x - 48, y: pos.y - 48};

        this.position = pos;
        this.title = `Object (${mapObject.id.toUpperCase().substr(0, 8)})`;

        this._mapObject = mapObject;
        this.inputName.nativeElement.value = mapObject.name;

        if (mapObject.meta.subtype) {
            this._subtype = mapObject.meta.subtype;
        } else {
            this._subtype = 0;
        }

        if (mapObject.meta.description) {
            this.inputDescription.nativeElement.value = mapObject.meta.description;
        }

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
        this._mapObject.meta.description = this.inputDescription.nativeElement.value;
        this._mapObject.meta.subtype = this._subtype;

        this._backend.setMapObject(this._mapObject);
        this._popupMenu.close();
    };
}