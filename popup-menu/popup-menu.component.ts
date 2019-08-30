import {Component, AfterContentInit, Input, ViewChild, ElementRef} from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { ContextMenuService } from '../shared/context-menu.service';

import { PopupContext } from './contexts/popup-context';
import { ObjectContextComponent } from './contexts/object-context/object-context.component';
import { FriendContextComponent } from './contexts/friend-context/friend-context.component';
import { FoeContextComponent } from './contexts/foe-context/foe-context.component';

@Component({
    selector: 'popup-menu',
    styleUrls: ['./popup-menu.component.scss'],
    templateUrl: 'popup-menu.component.html',
})
export class PopupMenuComponent implements AfterContentInit{
    @Input() _backend: BackendService;

    @ViewChild('popupMenuTitleBar', {static: true})
    public titleBar: ElementRef;

    @ViewChild(ObjectContextComponent, {static: true})
    public objectContext: ObjectContextComponent;

    @ViewChild(FriendContextComponent, {static: true})
    public friendContext: FriendContextComponent;

    @ViewChild(FoeContextComponent, {static: true})
    public foeContext: FoeContextComponent;

    @ViewChild('menu', {static: true}) private _popupMenuRef: ElementRef<HTMLDivElement>;

    private _activeContext: PopupContext = null;
    private _popupMenu: HTMLDivElement;
    private _position: {x: number, y: number};
    private _isDragged = false;

    private _title = '';

    constructor(private _menuService: ContextMenuService) {
        this._menuService.popupMenu = this;
    }

    ngAfterContentInit() {
        this._popupMenu = this._popupMenuRef.nativeElement;
        this._popupMenu.style.display = 'none';
        this._popupMenu.addEventListener('wheel', (e: Event) => {
            e.stopPropagation();
        })

        this._startListenToDrag();
    }

    public close() {
        if (this._activeContext != null) {
            this._activeContext.close();
        }
        this._popupMenu.style.display = 'none';
    }

    public open() {
        console.log(this._activeContext);
        this._popupMenu.style.display = 'block';
    }

    public setContext(ctx: PopupContext) {
        this._activeContext = ctx;
        this._title = this._activeContext.title;
    }

    public setPosition(position: {x: number, y: number}){
        this._position = position;
        this._popupMenu.style.top = (position.y).toString() + 'px';
        this._popupMenu.style.left = (position.x).toString() + 'px';
    }

    public setTitle(title: string) {
        this._title = title;
    }

    private _startListenToDrag() {
        let offset = {x:0, y:0};
        
        this.titleBar.nativeElement.addEventListener('mousedown', (ev) => {
            this._isDragged = true;
            offset = {x: ev.x - this._position.x, y: ev.y - this._position.y};
        })

        document.addEventListener('mousemove', (ev: MouseEvent) => {
            if(this._isDragged) {
                this.setPosition({x: ev.x - offset.x, y: ev.y - offset.y});
            }
        })

        document.addEventListener('mouseup', (ev: MouseEvent) => {
            this._isDragged = false;
        })
    }

}

