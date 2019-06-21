import {Component, AfterContentInit, Input} from '@angular/core';
import { PopupContext } from './contexts/popup-context';
import { BackendService } from '../backend/backend.service';
import { ObjectPopupContext } from './contexts/object.popup-context';

@Component({
    selector: 'popup-menu',
    styleUrls: ['./popup-menu.component.scss'],
    templateUrl: 'popup-menu.component.html',
})
export class PopupMenuComponent implements AfterContentInit{
    @Input() _backend: BackendService;

    public activeContext: PopupContext;
    public contexts = {
        editObject: this.getEditObjectContext.bind(this),
    }

    private _popupMenu: HTMLDivElement;
    private _position: {x: number, y: number};

    constructor() {

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

    private getEditObjectContext(id: string): ObjectPopupContext {
        return new ObjectPopupContext(this._backend, id)
    }
}

