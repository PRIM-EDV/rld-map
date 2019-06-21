
import { Button } from '../elements/button.element';
import { WheelMenuComponent } from '../wheel-menu.component';
import { WheelMenuContext } from './wheel-menu-context';
import { ContextMenuService } from '../../context-menu.service';

export class ObjectContext extends WheelMenuContext{
    private _contextMenuService: ContextMenuService;
    
    constructor(contextMenuService: ContextMenuService) {
        super();
        this._contextMenuService = contextMenuService;
        
        this.buttons.push(new Button('New marker: Foe', 'btn_foe.png', 7, this.placeEnemy.bind(this)));
        this.buttons.push(new Button('New marker: Object', 'btn_object.png', 6, this.placeEnemy.bind(this)));
        this.buttons.push(new Button('New marker: Ally', 'btn_ally.png', 5, this.placeEnemy.bind(this)));
    }
    
    public placeEnemy(position: {x: number, y: number}) {
        const backend = this._contextMenuService.backend;
        const popupMenu = this._contextMenuService.popupMenu;
        const wheelMenu = this._contextMenuService.wheelMenu;

        backend.setMapObject();
        popupMenu.editObject("", position);
        wheelMenu.close();
    }
}