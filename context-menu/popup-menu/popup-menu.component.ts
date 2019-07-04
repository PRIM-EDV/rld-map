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

    public activeContext: PopupContext;

    @ViewChild(ObjectContextComponent)
    public objectContext: ObjectContextComponent;


    private _popupMenu: HTMLDivElement;
    private _position: {x: number, y: number};

    constructor(private _menuService: ContextMenuService) {
        this._menuService.popupMenu = this;
    }

    ngAfterContentInit() {
        this._popupMenu = document.getElementById('popup-menu') as HTMLDivElement;
    }

    private onContextOpen(ctx: PopupContext) {
        console.log(ctx);
    }

    // public close(): void {
    //     this._popupMenu.hidden = true;
    // }

    // public open(context: PopupContext, position: {x: number, y: number}): void {
    //     this.activeContext = context;
    //     this._position = position;
    //     this._popupMenu.style.top = (position.y).toString() + 'px';
    //     this._popupMenu.style.left = (position.x).toString() + 'px';
    //     this._popupMenu.hidden = false;
    // }

    // public editObject(id: string, position: {x: number, y: number}) {
    //     const context = this.getEditObjectContext(id);
    //     this.open(context, position);
    // }

    // public getEditObjectContext(id: string): ObjectContext {
    //     return new ObjectContext(this._backend, id)
    // }
}

