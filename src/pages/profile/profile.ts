import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserSpid} from "../../models/UserSpid";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private user:UserSpid;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.user = navParams.get('user');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  navigateToRoot() {
    this.navCtrl.setRoot('WelcomePage');
  }

}
