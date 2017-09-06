import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { AccountDataProvider } from '../../providers/account-data/account-data';

/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  logout() {
    this.accountData.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
