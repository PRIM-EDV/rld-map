
import { BackendService } from '../../backend/backend.service';
import { Context } from './context';
import { Button } from '../elements/button.element';
import { WheelMenuComponent } from '../wheel-menu.component';

export class ObjectContext extends Context{
    private _backend: BackendService;

    constructor(backend: BackendService) {
        super();

        this._backend = backend;
        
        this.buttons.push(new Button('New marker: Foe', 'btn_foe.png', 7, this.placeEnemy.bind(this)));
        this.buttons.push(new Button('New marker: Object', 'btn_object.png', 6, this.placeEnemy.bind(this)));
        this.buttons.push(new Button('New marker: Ally', 'btn_ally.png', 5, this.placeEnemy.bind(this)));
        this.sliders = [];
    }
    
    public placeEnemy(position: {x: number, y: number}, menu: WheelMenuComponent) {
        this._backend.setMapObject();

        menu.close();
    }
}