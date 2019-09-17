import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupMenuComponent } from './popup-menu.component';
import { ObjectContextComponent } from './object-context/object-context.component';
import { FriendContextComponent } from './friend-context/friend-context.component';
import { SliderComponent } from '../../core/ui/slider/slider.component';
import { GridComponent } from '../../core/ui/grid/grid.component';
import { DropdownComponent } from '../../core/ui/dropdown/dropdown.component';
import { FoeContextComponent } from './foe-context/foe-context.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PopupMenuComponent, SliderComponent, GridComponent, DropdownComponent, ObjectContextComponent, FriendContextComponent, FoeContextComponent],
    exports: [PopupMenuComponent],
})
export class PopupMenuModule {}

