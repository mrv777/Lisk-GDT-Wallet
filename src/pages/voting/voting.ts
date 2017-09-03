import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { AccountDataProvider } from '../../providers/account-data/account-data';
import { VoteModalPage } from '../vote-modal/vote-modal';

/**
 * Generated class for the VotingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-voting',
  templateUrl: 'voting.html',
})
export class VotingPage {

  accountID: string;
  votes: object[];
  numStandby: number = 50;
  votedDelegates: string[] = [''];
  shownDelegates: object[];
  activeDelegates: object[];
  standbyDelegates: object[];
  updateVotesArray: string[] = [''];
  updateVotesNamesArray: string[] = [''];
  gdtMembers: string[] = ['1681920f9cb83ff2590a8e5c502a7015d4834f5365cf5ed17392c9c78147f94d','9771b09041466268948626830cbfea5a043527f39174d70e11a80011f386bb57','ac09bc40c889f688f9158cca1fcfcdf6320f501242e0f7088d52a5077084ccba','120d1c3847bd272237ee712ae83de59bbeae127263196fc0f16934bcfa82d8a4','5d205eb6ee303ffaa783bcbba3c2f31239686a63af68c3fcbbdf2401727759f2','c7a0f96797a9dc3085534463650a09e1f160fecb6c0ec6c21e74ef2a222b73a4','393f73238941510379d930e674e21ca4c00ba30c0877cd3728b5bd5874588671','f91766de68f3a8859a3634c3a0fdde38ebd82dd91fc37b67ac6cf010800a3e6e','ad936990fb57f7e686763c293e9ca773d1d921888f5235189945a10029cd95b0','a0f768d6476a9cfec1a64a895064fe114b26bd3fb6aeda397ccce7ef7f3f98ef','27f7950c552f9ffa8c871940167e92257cf90625443a0183aa3f7e05e1f6cb21','5c4a92f575822b2d2deaa4bc0985ec9a57a17719bd5427af634ec1b4bf9c045b','b6de69ebd1ba0bfe2d37ea6733c64b7e3eb262bee6c9cee05034b0b4465e2678','f88b86d0a104bda71b2ff4d8234fef4e184ee771a9c2d3a298280790c185231b','2d59fbcce531fb9661cdfa8371c49b6898ce0895fe71da88ffec851c7ed60782','e0f1c6cca365cd61bbb01cfb454828a698fa4b7170e85a597dde510567f9dda5','6a01c4b86f4519ec9fa5c3288ae20e2e7a58822ebe891fb81e839588b95b242a','90ad9bfed339af2d6b4b3b7f7cdf25d927b255f9f25dbbc892ee9ca57ef67807','2f58f5b6b1e2e91a9634dfadd1d6726a5aed2875f33260b6753cb9ec7da72917','ca1285393e1848ee41ba0c5e47789e5e0c570a7b51d8e2f7f6db37417b892cf9','7fba92f4a2a510ae7301dddddf136e1f8673b54fd0ff0d92ec63f59b68bf4a8f','226e78386cb6e79aa5005c847b806da1d1d7dc995e3b76945d174b87de3b6099','677c79b243ed96a8439e8bd193d6ab966ce43c9aa18830d2b9eb8974455d79f8','b73fa499a7794c111fcd011cdc7dcc426341a28c6c2d6a32b8d7d028dcb8493f','faf9f863e704f9cf560bc7a5718a25d851666d38195cba3cacd360cd5fa96fd3','e41c426b0b79983f6f568f5fd0f0ee018aac76a48b10d06e6cde8c4c62e6f278','613e4178a65c1194192eaa29910f0ecca3737f92587dd05d58c6435da41220f6','be80ec195679920bc73583e6ec77248d3963512244eb2bbc6ebb31b147138a5f','326bff18531703385d4037e5585b001e732c4a68afb8f82efe2b46c27dcf05aa','2fc8f8048d2573529b7f37037a49724202a28a0fbee8741702bb4d96c09fcbbf','5386c93dbc76fce1e3a5ae5436ba98bb39e6a0929d038ee2118af54afd45614a','380b952cd92f11257b71cce73f51df5e0a258e54f60bb82bccd2ba8b4dff2ec9'];
  gdtMemberNames: string[] = ['bioly','cc001','corsaro','dakk','digitron','eclipsun','forrest','goldeneye','gr33ndrag0n','grumlin','hagie','hmachado','joel','kushed','liskgate','liskit','4miners.net','mrv','nerigal','ntelo','ondin','philhellmuth','punkrock','redsn0w','sgdias','slasheks','splatters','stoner19','tembo','vekexasia','vi1son','gdtpool'];

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountDataProvider, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  	this.accountID = this.accountData.getAccountID();
    this.loadVoting();
  }

  loadVoting() {
  	this.votedDelegates = [''];
  	this.accountData.getVotes(this.accountID).then((votes) => { console.log(votes);
	  	if (votes['delegates']) {
		  	this.votes = votes['delegates'];
		  	for (let i=0;i < this.votes.length; i++) {
		  		this.votedDelegates.push(this.votes[i]['publicKey']);
		  	}
		  }
	  	this.accountData.getActiveDelegates(101).then((delegates) => { console.log(delegates);
		  	this.activeDelegates = delegates['delegates'];
		  	for (let i=0;i < this.activeDelegates.length; i++) {
		  		if (this.votedDelegates.indexOf(this.activeDelegates[i]['publicKey']) != -1) {
		  			this.activeDelegates[i]['voted'] = true;
		  		} else {
		  			this.activeDelegates[i]['voted'] = false;
		  		}
		  	}
		  	this.shownDelegates = this.activeDelegates;
		  });
	  });
  }

  updateVotes(vote:object) { 
  	const index = this.updateVotesArray.indexOf(vote['publicKey']); 
  	if (index == -1) {
  		this.updateVotesArray.push(vote['publicKey']);
  		this.updateVotesNamesArray.push(vote['username']);
  	} else {
  		this.updateVotesArray.splice(index, 1);
  		this.updateVotesNamesArray.splice(index, 1);
  	}
  	console.log(this.updateVotesArray);
  }

  onScroll(event) { console.log(event);
    this.accountData.getStandbyDelegates(this.numStandby).then((delegates) => {
	  	this.standbyDelegates = delegates['delegates'];
	  	for (let i=0;i < this.standbyDelegates.length; i++) {
	  		if (this.votedDelegates.indexOf(this.standbyDelegates[i]['publicKey']) != -1) {
	  			this.standbyDelegates[i]['voted'] = true;
	  		} else {
	  			this.standbyDelegates[i]['voted'] = false;
	  		}
	  	}
	  	this.shownDelegates = this.activeDelegates.concat(this.standbyDelegates);
	  	event.complete();
	  });
    this.numStandby += 50;
  }

  voteGDT() {
  	this.updateVotesArray = [''];
  	for (let i=0;i < this.gdtMembers.length; i++) {
  		if (this.votedDelegates.indexOf(this.gdtMembers[i]) == -1) { console.log(this.votedDelegates);
  			this.updateVotesArray.push(`+${this.gdtMembers[i]}`);
  			this.updateVotesNamesArray.push(`+${this.gdtMemberNames[i]}`);
  			// let name = this.shownDelegates.filter(x => x['publicKey'] == this.gdtMembers[i]); 
  			// if (name.length > 0) {
  			// 	this.updateVotesNamesArray.push(`+${name[0]['username']}`);
  			// } else {
  			// 	this.updateVotesNamesArray.push(`+${this.gdtMembers[i]}`);
  			// }
  			
  		}
  	}
  	this.updateVotesArray.splice(0, 1);
  	this.updateVotesNamesArray.splice(0, 1);
  	console.log(this.updateVotesArray);
  	this.openModal();
  	//this.accountData.voteDelegtes(this.updateVotesArray);
  	//this.updateVotesArray = [''];
  }

  openModal() {
    let myModal = this.modalCtrl.create(VoteModalPage, { delegates: this.updateVotesArray, names: this.updateVotesNamesArray });
    myModal.present();
    myModal.onDidDismiss(data => {
      //if (data == true) {
      	this.loadVoting();
      	this.updateVotesArray = [''];
      	this.updateVotesNamesArray = [''];
      //}
    });
  }

  voteSelected() {
  	for (let i=1;i < this.updateVotesArray.length; i++) {
  		let name = this.activeDelegates.filter(x => x['publicKey'] == this.updateVotesArray[i]); 
  		if (this.votedDelegates.indexOf(this.updateVotesArray[i]) != -1) {
  			this.updateVotesArray[i] = `-${this.updateVotesArray[i]}`;
  			this.updateVotesNamesArray[i] = `-${this.updateVotesNamesArray[i]}`;
  		} else {
  			this.updateVotesArray[i] = `+${this.updateVotesArray[i]}`;
  			this.updateVotesNamesArray[i] = `+${this.updateVotesNamesArray[i]}`;
  		}
  	} 
  	this.updateVotesArray.splice(0, 1);
  	this.updateVotesNamesArray.splice(0, 1);
  	console.log(this.updateVotesArray);
  	this.openModal();
  	// this.accountData.voteDelegtes(this.updateVotesArray);
  	// this.updateVotesArray = [''];
  }

  logout() {
    this.accountData.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
