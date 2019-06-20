import {Component, AfterContentInit, Input} from '@angular/core';
import { ObjectContext } from './contexts/objects.context';
import { Context } from './contexts/context';
import { BackendService } from '../backend/backend.service';

@Component({
    selector: 'wheel-menu',
    styleUrls: ['./wheel-menu.component.scss'],
    templateUrl: 'wheel-menu.component.html',
})
export class WheelMenuComponent implements AfterContentInit {
    @Input() _backend: BackendService;
    @Input() _test: string;
    
    public activeContext: Context;
    public contexts = {
        objects: new ObjectContext(this._backend),
    }

    private _wheelMenu: HTMLDivElement;
    private _position: {x: number, y: number};

    constructor() {
        this.activeContext = this.contexts.objects;
    }

    ngAfterContentInit() {
        console.log(this._backend);
        this._wheelMenu = document.getElementById('wheel-menu') as HTMLDivElement;
    }

    public close(): void {
        this._wheelMenu.hidden = true;
    }

    public open(position: {x: number, y: number}): void {
        this._position = position;
        this._wheelMenu.style.top = (position.y - 74).toString() + 'px';
        this._wheelMenu.style.left = (position.x - 74).toString() + 'px';
        this._wheelMenu.hidden = false;
    }

    public click(callback) {
        callback(this._position, this);
    }

    public changeContext() {

    }
}

