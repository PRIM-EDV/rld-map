import {Component, AfterContentInit, Input, ViewChild} from '@angular/core';
import { BackendService } from '../../backend/backend.service';
import { ContextMenuService } from '../context-menu.service';
import { ObjectContextComponent } from './contexts/object-context/object-context.component';
import { PopupContext } from './core/popup-context';

@Component({
    selector: 'popup-menu',
    styleUrls: ['./popup-menu.component.scss'],
    templateUrl: 'popup-menu.component.html',
})
export class PopupMenuComponent implements AfterContentInit{
    @Input() _backend: BackendService;

    @ViewChild(ObjectContextComponent)
    public objectContext: ObjectContextComponent;

    private _activeContext: PopupContext;
    private _popupMenu: HTMLDivElement;
    private _position: {x: number, y: number};

    constructor(private _menuService: ContextMenuService) {
        this._menuService.popupMenu = this;
    }

    ngAfterContentInit() {
        this._popupMenu = document.getElementById('popup-menu') as HTMLDivElement;
    }

    public close() {
        this._popupMenu.hidden = true;
    }

    public open() {
        this._popupMenu.hidden = false;
    }

    public setContext(ctx: PopupContext) {
        this._activeContext = ctx;
    }

    public setPosition(position: {x: number, y: number}){
        this._position = position;
        this._popupMenu.style.top = (position.y - 74).toString() + 'px';
        this._popupMenu.style.left = (position.x - 74).toString() + 'px';
    }

}

