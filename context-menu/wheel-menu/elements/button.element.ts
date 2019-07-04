import { WheelMenuComponent } from '../wheel-menu.component';

export class Button {
    public label: string;
    public icon: string;
    public position: number;


    constructor(label: string, icon: string, position: number, click: (position: {x: number, y: number}, menu: WheelMenuComponent) => any){
        this.label = label;
        this.icon = icon;
        this.position = position;
        this.click = click;
    }

    public click(position: {x: number, y: number}, menu: WheelMenuComponent) {}
}