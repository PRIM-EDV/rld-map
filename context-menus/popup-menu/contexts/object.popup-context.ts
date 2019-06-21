import { PopupContext } from './popup-context';
import { MapObject, BackendService } from '../../../backend/backend.service';
import { InputPopupElement } from '../elements/input.popup-element';

export class ObjectPopupContext extends PopupContext {
    private _backend: BackendService;
    private _mapObjectId: string;

    constructor(backend: BackendService, mapObjectId: string) {
        super();

        this._mapObjectId = mapObjectId;
        this._backend = backend
        this.title = "Edit: Object"

        const mapObject = this._backend.getMapObject(mapObjectId);

        if(mapObject != null) {
            this.elements.push(new InputPopupElement('Name', mapObject.name));
        }else{
            this.elements.push(new InputPopupElement('Name'));
        }
    }

    
}