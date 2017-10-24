import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AccountDataProvider } from '../../providers/account-data/account-data';

/**
 * Generated class for the DelegatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-delegate',
  templateUrl: 'delegate.html',
})
export class DelegatePage {
  delegateInfo: object;

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountDataProvider) {
  }

  ionViewDidLoad() {
    this.accountData.getDelegate().then((delegateData) => { console.log(delegateData);
	    if (delegateData['success'] == true) {
	    	this.delegateInfo = delegateData['delegate'];
	    }
	});
  }

}
