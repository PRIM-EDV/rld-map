import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { BackendService, MapObject, Squad, Operator } from 'src/app/map/backend/backend.service';
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

    @ViewChild('description', {static: true})
    private _description: ElementRef<HTMLTextAreaElement>;

    private _inputName: HTMLInputElement;
    private _mapObject: MapObject;
    private _popupMenu: PopupMenuComponent;

    private _nbCombatants: number = 0;
    private _nbWounded: number = 0;
    private _tickValues: Array<number> = [0, 30];

    private _squadnames: Array<string> = [];
    private _callsigns: Array<string> = [];
    private _medics: number = 0;
    private _technitians: number = 0;
    private _scientists: number = 0;

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

        this._callsigns = this._getCallsigns(this._backend.getOperators());
        this._squadnames = this._getSquadnames(this._backend.getSquads());
        this._mapObject = mapObject;
        this._squadname = mapObject.name;
        this._callsign = mapObject.meta.callsign;
        this._nbCombatants = mapObject.meta.size;
        this._nbWounded = mapObject.meta.wounded;
        this._tickValues = [0, this._nbCombatants];

        this._medics = (mapObject.meta.medics) ? mapObject.meta.medics : 0;
        this._technitians = (mapObject.meta.technitians) ? mapObject.meta.technitians : 0;
        this._scientists = (mapObject.meta.scientists) ? mapObject.meta.scientists : 0; 

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

    private _getCallsigns(operators: Array<Operator>) {
        let callsigns = [];

        operators.forEach((operator: Operator) => {
            callsigns.push(operator.callsign)
        });

        callsigns = callsigns.filter((callsign) => {
            let existingMapObject = this._backend.getMapObjects().find((mapObject) => {
                return mapObject.type == 'friend' && mapObject.meta.callsign == callsign 
            });
            
            return (existingMapObject ? false : true);
        });

        callsigns.sort();

        return callsigns;
    }

    private _getSquadnames(squads: Array<Squad>) {
        let squadnames = [];

        squads.forEach((squad: Squad) => {
            squadnames.push(squad.name)
        });
        squadnames.sort();

        return squadnames;
    }

    private _onCancel() {
        this._popupMenu.close();
    }

    private _onConfirm() {
        this._mapObject.name = this._squadname
        this._mapObject.meta.medics = this._medics;
        this._mapObject.meta.technitians = this._technitians;
        this._mapObject.meta.scientists = this._scientists;
        this._mapObject.meta.callsign = this._callsign;
        this._mapObject.meta.size = this._nbCombatants;
        this._mapObject.meta.wounded = this._nbWounded;
        this._mapObject.meta.description = this._description.nativeElement.value;

        this._backend.setMapObject(this._mapObject);
        this._popupMenu.close();
    };

    private _onCallsignChange(callsign: string) {
        this._callsign = callsign;
    }

    private _onSquadnameChange(name: string) {
        this._squadname = name;
    }
}