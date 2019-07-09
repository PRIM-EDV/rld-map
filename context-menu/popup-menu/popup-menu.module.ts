import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupMenuComponent } from './popup-menu.component';
import { ObjectContextComponent } from './contexts/object-context/object-context.component';
import { EditFriendContextComponent } from './contexts/edit-friend-context/edit-friend-context.component';
import { SliderComponent } from './elements/slider/slider.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PopupMenuComponent, SliderComponent, ObjectContextComponent, EditFriendContextComponent],
    exports: [PopupMenuComponent],
})
export class PopupMenuModule {}
