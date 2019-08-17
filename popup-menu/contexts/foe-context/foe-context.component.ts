import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BackendService, MapObject } from 'src/app/map/backend/backend.service';
import { ContextMenuService } from '../../../shared/context-menu.service';
import { PopupMenuComponent } from '../../popup-menu.component';
import { PopupContext } from '../popup-context';


@Component({
    selector: 'foe-context',
    styleUrls: ['../popup-menu-context.scss'],
    templateUrl: 'foe-context.component.html',
})
export class FoeContextComponent extends PopupContext implements AfterViewInit{
    @Input() _backend: BackendService;

    @ViewChild('description', {static: true})
    private _description: ElementRef<HTMLTextAreaElement>;

    private _mapObject: MapObject;
    private _popupMenu: PopupMenuComponent;

    private _size: number = 0;

    constructor(private _contextMenuService: ContextMenuService) {
        super();

        this._popupMenu = this._contextMenuService.popupMenu;
    }

    ngAfterViewInit() {

    }

    public open(pos: {x: number, y: number}, mapObject: MapObject) {
        const popupPosition = {x: pos.x - 48, y: pos.y - 48};

        this.position = pos;
        this.title = `Enemy unit (${mapObject.id.toUpperCase().substr(0, 8)})`;

        this._mapObject = mapObject;
        this._size = (mapObject.meta.size) ? mapObject.meta.size : 0;
        this._description.nativeElement.value = (mapObject.meta.description) ? mapObject.meta.description : '';
        
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
        this._mapObject.meta.size = this._size;
        this._mapObject.meta.description = this._description.nativeElement.value;
        this._backend.setMapObject(this._mapObject);
        this._popupMenu.close();
    }
}
