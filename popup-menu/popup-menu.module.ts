import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupMenuComponent } from './popup-menu.component';
import { ObjectContextComponent } from './contexts/object-context/object-context.component';
import { FriendContextComponent } from './contexts/friend-context/friend-context.component';
import { SliderComponent } from './elements/slider/slider.component';
import { GridComponent } from './elements/grid/grid.component';
import { DropdownComponent } from './elements/dropdown/dropdown.component';
import { FoeContextComponent } from './contexts/foe-context/foe-context.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PopupMenuComponent, SliderComponent, GridComponent, DropdownComponent, ObjectContextComponent, FriendContextComponent, FoeContextComponent],
    exports: [PopupMenuComponent],
})
export class PopupMenuModule {}

