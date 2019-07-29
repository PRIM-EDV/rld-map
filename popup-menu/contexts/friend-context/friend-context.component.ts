import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { BackendService, MapObject, Squad } from 'src/app/map/backend/backend.service';
import { ContextMenuService } from '../../../shared/context-menu.service';
import { PopupMenuComponent } from '../../popup-menu.component';
import { PopupContext } from '../popup-context';


@Component({
    
    selector: 'friend-context',
    styleUrls: ['../popup-menu-context.scss'],
    templateUrl: 'friend-context.component.html',
})
export class FriendContextComponent extends PopupContext implements AfterViewInit{
    @Input() _backend: BackendService;

    @ViewChild('description')
    private _description: ElementRef<HTMLTextAreaElement>;

    private _inputName: HTMLInputElement;
    private _mapObject: MapObject;
    private _popupMenu: PopupMenuComponent;

    private _nbCombatants: number = 0;
    private _nbWounded: number = 0;
    private _tickValues: Array<number> = [0, 30];

    private _squadnames: Array<string> = [];
    private _callsigns: Array<string> = [];

    private _squadname = "Paul"
    private _callsign = "1234"

    constructor(private _contextMenuService: ContextMenuService) {
        super();

        this._popupMenu = this._contextMenuService.popupMenu;
    }

    ngAfterViewInit() {
        this._inputName = document.getElementById('input-name') as HTMLInputElement;
    }

    public open(pos: {x: number, y: number}, mapObject: MapObject) {
        const popupPosition = {x: pos.x - 48, y: pos.y - 48};

        this.position = pos;
        this.title = `Friendly unit (${mapObject.id.toUpperCase().substr(0, 8)})`;

        this._callsigns = this._getCallsigns(this._backend.getSquads());
        this._squadnames = this._getSquadnames(this._backend.getSquads());
        this._mapObject = mapObject;
        this._squadname = mapObject.name;
        this._callsign = mapObject.meta.callsign;
        this._nbCombatants = mapObject.meta.size;
        this._nbWounded = mapObject.meta.wounded;
        this._tickValues = [0, this._nbCombatants];

        if(mapObject.meta.description) {
            this._description.nativeElement.value = mapObject.meta.description;
        }
        
        this._popupMenu.setPosition(popupPosition);
        this._popupMenu.setContext(this);
        this._popupMenu.open();
    }

    public close() {

    }

    public onCombatantsChange(e: number) {
        this._nbCombatants = e;
        this._tickValues = [0, e];
    }

    public onWoundedChange(e: number) {
        this._nbWounded = e;
    }

    private _getCallsigns(squads: Array<Squad>) {
        let callsigns = [];

        squads.forEach((squad: Squad) => {
            callsigns.push(squad.callsign)
        });

        callsigns = callsigns.filter((callsign) => {
            let existingMapObject = this._backend.getMapObjects().find((mapObject) => {
                return mapObject.type == 'friend' && mapObject.meta.callsign == callsign 
            });
            
            return (existingMapObject ? false : true);
        });

        return callsigns;
    }

    private _getSquadnames(squads: Array<Squad>) {
        let squadnames = [];

        squads.forEach((squad: Squad) => {
            squadnames.push(squad.name);
        })

        squadnames = squadnames.filter((name) => {
            let existingMapObject = this._backend.getMapObjects().find((mapObject) => {
                return mapObject.type == 'friend' && mapObject.name == name 
            });
            
            return (existingMapObject ? false : true);
        });

        return squadnames;
    }

    private _onSquadnameChange(value: string) {
        const squads = this._backend.getSquads();

        squads.forEach((x) => {
            if(x.name == value) {
                this._callsign = x.callsign;
            }
        });
        this._squadname = value;
    }

    private _onCallsignChange(value: string) {
        const squads = this._backend.getSquads();

        squads.forEach((x) => {
            if(x.callsign == value) {
                this._squadname = x.name;
            }
        });
        this._callsign = value;
    }

    private _onCancel() {
        this._popupMenu.close();
    }

    private _onConfirm() {
        this._mapObject.name = this._squadname
        this._mapObject.meta.callsign = this._callsign;
        this._mapObject.meta.size = this._nbCombatants;
        this._mapObject.meta.wounded = this._nbWounded;
        this._mapObject.meta.description = this._description.nativeElement.value;

        this._backend.setMapObject(this._mapObject);
        this._popupMenu.close();
    };
}