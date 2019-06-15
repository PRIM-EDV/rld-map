
import { BackendService } from '../../backend/backend.service';
import { Context } from './context';
import { Button } from '../elements/button.element';

export class ObjectContext extends Context{
    private _backend: BackendService;

    constructor(backend: BackendService) {
        super();

        this._backend = backend;
        
        this.buttons.push(new Button('Alien', 'enemy_button.png', this.placeEnemy.bind(this)));
        this.sliders = [];
    }
    
    public placeEnemy() {
        this._backend.setMapObject();
    }
}