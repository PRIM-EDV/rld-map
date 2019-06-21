import { PopupElement } from './popup-element';

export class InputPopupElement extends PopupElement{
    public content: string;

    constructor(label: string, content?: string) {
        super();

        this.label = label;
        this.type = 'input';

        if(content != null) this.content = content;
    }
}