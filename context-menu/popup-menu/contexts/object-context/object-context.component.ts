import { Component } from '@angular/core';
import { PopupContext } from '../../popup-context';
import { MapObject, BackendService } from '../../../backend/backend.service';
import { InputElement } from '../elements/input-element';


@Component({
    selector: 'popup-menu',
    styleUrls: ['./popup-menu.component.scss'],
    templateUrl: 'popup-menu.component.html',
})
export class ObjectContextComponent extends PopupContext {
    private _backend: BackendService;
    private _mapObjectId: string;

    constructor(backend: BackendService, mapObjectId: string) {
        super();

        this._mapObjectId = mapObjectId;
        this._backend = backend
        this.title = "Edit: Object"

        const mapObject = this._backend.getMapObject(mapObjectId);

        if(mapObject != null) {
            this.elements.push(new InputElement('Name', mapObject.name));
        }else{
            this.elements.push(new InputElement('Name'));
        }
    }

    
}