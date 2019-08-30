

export abstract class PopupContext {
    public position: {x: number, y: number} = {x: 0, y: 0};
    public title: string;

    public abstract close();
}