import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupMenuComponent } from './popup-menu.component';
import { ObjectContextComponent } from './contexts/object-context/object-context.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PopupMenuComponent, ObjectContextComponent],
    exports: [PopupMenuComponent],
})
export class PopupMenuModule {}
