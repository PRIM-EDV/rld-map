import { Injectable } from "@angular/core";
import { DropdownComponent } from './dropdown.component';

@Injectable({providedIn: 'root'})
export class DropdownService {
    constructor(){};

    public handleOutsideCLick(e: MouseEvent, dropdown: DropdownComponent) {
        
    }
}