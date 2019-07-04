export interface Button {
    icon: string;
    position: number;

    click(): any;
}

export interface Slider {
    icon: string;
    position: number;
    
    up(): any;
    down(): any;
}