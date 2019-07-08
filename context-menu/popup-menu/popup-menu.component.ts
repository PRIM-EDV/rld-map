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
    
    private _title: string = "";

    constructor(private _menuService: ContextMenuService) {
        this._menuService.popupMenu = this;
    }

    ngAfterContentInit() {
        this._popupMenu = document.getElementById('popup-menu') as HTMLDivElement;
        this._popupMenu.style.display = 'none';
    }

    public close() {
        this._activeContext.close();
        this._popupMenu.style.display = 'none';
    }

    public open() {
        this._popupMenu.style.display = 'block';
    }

    public setContext(ctx: PopupContext) {
        this._activeContext = ctx;
        this._title = this._activeContext.title;
    }

    public setPosition(position: {x: number, y: number}){
        this._position = position;
        this._popupMenu.style.top = (position.y - 74).toString() + 'px';
        this._popupMenu.style.left = (position.x - 74).toString() + 'px';
    }

    public setTitle(title: string) {
        this._title = title;
    }

}

