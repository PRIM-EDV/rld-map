import {Component, AfterContentInit, Input} from '@angular/core';
import { PopupContext } from './contexts/popup-context';

@Component({
    selector: 'popup-menu',
    styleUrls: ['./popup-menu.component.scss'],
    templateUrl: 'popup-menu.component.html',
})
export class PopupMenuComponent implements AfterContentInit{
    public context: PopupContext;

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

    public open(position: {x: number, y: number}): void {
        this._position = position;
        this._popupMenu.style.top = (position.y).toString() + 'px';
        this._popupMenu.style.left = (position.x).toString() + 'px';
        this._popupMenu.hidden = false;
    }
}

