import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

import { AccountDataProvider } from '../../providers/account-data/account-data';
import { HomePage } from '../home/home';
import { NewAccountPage } from '../new-account/new-account';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private loginForm : FormGroup;
  password: string = '';
  hideCustom: boolean;
  disableLogin: boolean = false;
  node: string;
  nodeSelect: string;
  savePassword: boolean = false;
  fingerAvailable: boolean = true;
  message: string;
  accountNum: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountDataProvider, private barcodeScanner: BarcodeScanner, private formBuilder: FormBuilder, private faio: FingerprintAIO, public modalCtrl: ModalController, public platform: Platform) {
    this.loginForm = this.formBuilder.group({
      passwordForm: ['', Validators.required],
      nodeForm: ['', Validators.required],
      nodeSelectForm: [''],
      savePasswordForm: [''],
      accountNumForm: [''],
    });

    if (this.platform.is('cordova')) {
      this.faio.isAvailable().then((available) => {
        if (available == 'OK' || available == 'Available') {
          this.fingerAvailable = true;
        } else {
          this.fingerAvailable = false;
        }
      });
    }

    this.accountData.getNode().then((node) => {
      if (node == null) {
        this.node = "mainnet/";
        this.nodeSelect = "mainnet/";
        this.hideCustom = true;
      } else {
	    this.node = node;
	    if (this.node == "mainnet/" || this.node == "testnet/") {
	    	this.hideCustom = true;
	    	this.nodeSelect = node;
	    } else {
	    	this.hideCustom = false;
	    	this.nodeSelect = '';
	    }
      }
    });
  }

  onLogin() {
    this.disableLogin = true;
    this.accountData.setNode(this.node).then(() => {  
    	this.accountData.login(this.password, this.savePassword, this.accountNum-1);
    	this.navCtrl.setRoot(HomePage);
    });
  }

  changeNode() {
    if (this.nodeSelect == "") {
      this.hideCustom = false;
    } else {
      this.hideCustom = true;
    }
    this.node = this.nodeSelect;
  }

  openBarcodeScanner() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.password = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  openModal() {
    let myModal = this.modalCtrl.create(NewAccountPage);
    myModal.present();
    myModal.onDidDismiss(data => {
      this.password = data;
    });
  }

  showFingerprint() {
    this.faio.show({
      clientId: 'Lisk-GDT',
      clientSecret: 'gDtLisk2o17Wal!et', //Only necessary for Android
      disableBackup: false  //Only for Android(optional)
    })
    .then((result: any) => { console.log(result.withFingerprint); this.password = this.accountData.getSavedPassword(this.accountNum-1); } )
    .catch((error: any) => console.log(error));
  }

}
