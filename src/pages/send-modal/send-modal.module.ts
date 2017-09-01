import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendModalPage } from './send-modal';

@NgModule({
  declarations: [
    SendModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SendModalPage),
  ],
})
export class SendModalPageModule {}
