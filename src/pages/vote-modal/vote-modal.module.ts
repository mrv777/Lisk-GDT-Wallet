import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoteModalPage } from './vote-modal';

@NgModule({
  declarations: [
    VoteModalPage,
  ],
  imports: [
    IonicPageModule.forChild(VoteModalPage),
  ],
})
export class VoteModalPageModule {}
