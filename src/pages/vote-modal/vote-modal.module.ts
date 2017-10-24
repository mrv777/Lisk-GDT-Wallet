import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoteModalPage } from './vote-modal';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    VoteModalPage,
  ],
  imports: [
    IonicPageModule.forChild(VoteModalPage),
    TranslateModule.forChild(),
  ],
})
export class VoteModalPageModule {}
