import {Component, AfterContentInit} from '@angular/core';

@Component({
    selector: 'wheel-menu',
    styleUrls: ['./wheel-menu.component.scss'],
    templateUrl: 'wheel-menu.component.html',

})
export class WheelMenuComponent implements AfterContentInit {
    private _wheelMenu: HTMLDivElement;

    ngAfterContentInit() {
        this._wheelMenu = document.getElementById('wheel-menu') as HTMLDivElement;
    }

    public close(): void {
        this._wheelMenu.hidden = true;
    }

    public open(position: {x: number, y: number}): void {
        this._wheelMenu.style.top = position.y.toString() + 'px';
        this._wheelMenu.style.left = position.x.toString() + 'px';
        this._wheelMenu.hidden = false;
    }
}

