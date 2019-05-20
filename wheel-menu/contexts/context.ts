export interface Entry {
    icon?: any;
    action(): void;
}

export class Context {
    public entries: Array<Entry> = [];
}

