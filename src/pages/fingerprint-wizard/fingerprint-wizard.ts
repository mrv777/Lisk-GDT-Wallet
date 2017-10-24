import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AccountDataProvider } from '../../providers/account-data/account-data';

@IonicPage()
@Component({
  selector: 'page-fingerprint-wizard',
  templateUrl: 'fingerprint-wizard.html',
})
export class FingerprintWizardPage {
  private loginForm : FormGroup;
  password: string;
  savePassphrase: boolean = false;
  accountName: string = "";
  account: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public accountData: AccountDataProvider, private formBuilder: FormBuilder, private barcodeScanner: BarcodeScanner) {
  	this.loginForm = this.formBuilder.group({
      accountForm: ['', Validators.required],
      passwordForm: [''],
      typeForm: [''],
      accountNumForm: [''],
      saveForm: [''],
      accountNameForm: ['']
    });
  }

  ionViewDidLoad() {

  }

  openBarcodeScannerAccount() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.account = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  openBarcodeScannerPassword() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.password = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  saveLogin() {
  	this.accountData.saveSavedPassword(this.password, this.account, this.accountName, this.savePassphrase);
  	this.closeModal();
  }

  closeModal() {
    this.viewCtrl.dismiss(this.password);
  }

}
