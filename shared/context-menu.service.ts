import { Injectable } from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { WheelMenuComponent } from '../wheel-menu/wheel-menu.component';
import { PopupMenuComponent } from '../popup-menu/popup-menu.component';

@Injectable({providedIn: 'root'})
export class ContextMenuService {
    public wheelMenu: WheelMenuComponent;
    public popupMenu: PopupMenuComponent;
    public backend: BackendService;

    constructor(){}
}