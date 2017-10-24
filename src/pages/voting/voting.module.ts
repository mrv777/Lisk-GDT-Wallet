import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VotingPage } from './voting';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    VotingPage,
  ],
  imports: [
    IonicPageModule.forChild(VotingPage),
    TranslateModule.forChild(),
  ],
})
export class VotingPageModule {}
