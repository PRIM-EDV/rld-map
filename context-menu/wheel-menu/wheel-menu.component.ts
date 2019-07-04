import {Component, AfterContentInit, Input, ViewChild} from '@angular/core';

import { BackendService } from '../../backend/backend.service';
import { ContextMenuService } from '../context-menu.service';
import { WheelMenuContext } from '../popup-menu/core/wheel-menu-context';
import { MapObjectContextComponent } from './contexts/map-object-context/map-object-context.component';

@Component({
    selector: 'wheel-menu',
    styleUrls: ['./wheel-menu.component.scss'],
    templateUrl: 'wheel-menu.component.html',
})
export class WheelMenuComponent implements AfterContentInit {
    @Input() _backend: BackendService;

    public activeContext: WheelMenuContext;
    
    @ViewChild(MapObjectContextComponent)
    public mapObjectContext: MapObjectContextComponent; 

    private _wheelMenu: HTMLDivElement;
    private _position: {x: number, y: number};

    constructor(private _menuService: ContextMenuService) {
        this._menuService.wheelMenu = this;
        //this.activeContext = this.getObjectContext();     
    }

    ngAfterContentInit() {
        this._wheelMenu = document.getElementById('wheel-menu') as HTMLDivElement;
    }


    public close(): void {
        this._wheelMenu.hidden = true;
    }

    public onContextOpen(ctx: WheelMenuContext){
        this.activeContext = ctx;
        this._setPosition(this.activeContext.position)
        
        this._wheelMenu.hidden = false;
    }

    private _setPosition(position: {x: number, y: number}){
        this._position = position;
        this._wheelMenu.style.top = (position.y - 74).toString() + 'px';
        this._wheelMenu.style.left = (position.x - 74).toString() + 'px';
    }

    // public open(position: {x: number, y: number}): void {
    //     
    // }

    // public click(callback) {
    //     callback(this._position, this);
    // }

    // public changeContext() {

    // }

}

