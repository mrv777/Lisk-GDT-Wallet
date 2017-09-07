import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FingerprintWizardPage } from './fingerprint-wizard';

@NgModule({
  declarations: [
    FingerprintWizardPage,
  ],
  imports: [
    IonicPageModule.forChild(FingerprintWizardPage),
  ],
})
export class FingerprintWizardPageModule {}
