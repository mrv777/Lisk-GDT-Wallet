import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditContactModalPage } from './edit-contact-modal';

@NgModule({
  declarations: [
    EditContactModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditContactModalPage),
  ],
})
export class EditContactModalPageModule {}
