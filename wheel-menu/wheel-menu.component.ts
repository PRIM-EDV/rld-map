import {Component, AfterContentInit, Input, ViewChild} from '@angular/core';

import { BackendService } from '../backend/backend.service';
import { ContextMenuService } from '../shared/context-menu.service';
import { WheelMenuContext } from './contexts/wheel-menu-context';
import { MapObjectContextComponent } from './contexts/map-object-context/map-object-context.component';
import { EditObjectContextComponent } from './contexts/edit-object-context/edit-object-context.component';

@Component({
    selector: 'wheel-menu',
    styleUrls: ['./wheel-menu.component.scss'],
    templateUrl: 'wheel-menu.component.html',
})
export class WheelMenuComponent implements AfterContentInit {
    @Input() _backend: BackendService;

    @ViewChild(MapObjectContextComponent, {static: true})
    public mapObjectContext: MapObjectContextComponent;

    @ViewChild(EditObjectContextComponent, {static: true})
    public editObjectContext: EditObjectContextComponent;

    private _activeContext: WheelMenuContext;
    private _position: {x: number, y: number};
    private _wheelMenu: HTMLDivElement;

    constructor(private _menuService: ContextMenuService) {
        this._menuService.wheelMenu = this;
    }

    ngAfterContentInit() {
        this._wheelMenu = document.getElementById('wheel-menu') as HTMLDivElement;
    }


    public close(): void {
        if (this._activeContext != null) {
            this._activeContext.close();
            this._activeContext = null;
        }

        this._wheelMenu.style.visibility = "hidden";
    }

    public getContext(): WheelMenuContext {
        return this._activeContext;
    }

    public open(): void {
        this._wheelMenu.style.visibility = "initial";
    }

    public setContext(ctx: WheelMenuContext) {
        this._activeContext = ctx;
    }

    public setPosition(position: {x: number, y: number}){
        this._position = position;
        this._wheelMenu.style.top = (position.y - 74).toString() + 'px';
        this._wheelMenu.style.left = (position.x - 74).toString() + 'px';
    }
}

