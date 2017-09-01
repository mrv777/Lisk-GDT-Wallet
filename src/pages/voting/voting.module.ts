import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VotingPage } from './voting';

@NgModule({
  declarations: [
    VotingPage,
  ],
  imports: [
    IonicPageModule.forChild(VotingPage),
  ],
})
export class VotingPageModule {}
