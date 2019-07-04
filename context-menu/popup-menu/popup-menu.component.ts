import {Component, AfterContentInit, Input} from '@angular/core';
import { PopupContext } from './contexts/popup-context';
import { BackendService } from '../../backend/backend.service';
import { ObjectContext } from './contexts/object-context';
import { ContextMenuService } from '../context-menu.service';

@Component({
    selector: 'popup-menu',
    styleUrls: ['./popup-menu.component.scss'],
    templateUrl: 'popup-menu.component.html',
})
export class PopupMenuComponent implements AfterContentInit{
    @Input() _backend: BackendService;

    public activeContext: PopupContext;

    private _popupMenu: HTMLDivElement;
    private _position: {x: number, y: number};

    constructor(private _menuService: ContextMenuService) {
        this._menuService.popupMenu = this;
    }

    ngAfterContentInit() {
        this._popupMenu = document.getElementById('popup-menu') as HTMLDivElement;
    }

    public close(): void {
        this._popupMenu.hidden = true;
    }

    public open(context: PopupContext, position: {x: number, y: number}): void {
        this.activeContext = context;
        this._position = position;
        this._popupMenu.style.top = (position.y).toString() + 'px';
        this._popupMenu.style.left = (position.x).toString() + 'px';
        this._popupMenu.hidden = false;
    }

    public editObject(id: string, position: {x: number, y: number}) {
        const context = this.getEditObjectContext(id);
        this.open(context, position);
    }

    public getEditObjectContext(id: string): ObjectContext {
        return new ObjectContext(this._backend, id)
    }
}

