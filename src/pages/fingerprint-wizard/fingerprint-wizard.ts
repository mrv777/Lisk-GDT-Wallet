import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AccountDataProvider } from '../../providers/account-data/account-data';

/**
 * Generated class for the FingerprintWizardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fingerprint-wizard',
  templateUrl: 'fingerprint-wizard.html',
})
export class FingerprintWizardPage {
  private loginForm : FormGroup;
  loginType: string = "Account";
  password: string;
  accountNum: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public accountData: AccountDataProvider, private formBuilder: FormBuilder, private barcodeScanner: BarcodeScanner) {
  	this.loginForm = this.formBuilder.group({
      passwordForm: ['', Validators.required],
      typeForm: [''],
      accountNumForm: ['']
    });
  }

  ionViewDidLoad() {

  }

  openBarcodeScanner() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.password = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  saveLogin() {
  	this.accountData.saveSavedPassword(this.password, this.accountNum-1, this.loginType);
  	this.closeModal();
  }

  closeModal() {
    this.viewCtrl.dismiss(this.password);
  }

}
