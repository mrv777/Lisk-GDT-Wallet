import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiveModalPage } from './receive-modal';

@NgModule({
  declarations: [
    ReceiveModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiveModalPage),
  ],
})
export class ReceiveModalPageModule {}
