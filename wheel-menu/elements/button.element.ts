export class Button {
    public label: string;
    public icon: string;


    constructor(label: string, icon: string, click: () => any){
        this.label = label;
        this.icon = icon;
        this.click = click;
    }

    public click() {}
}