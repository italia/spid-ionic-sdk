import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { WelcomePage } from './welcome';
import {ActionSheet} from "@ionic-native/action-sheet";
import {IdentityProviders} from "../../providers/IdentityProviders/IdentityProviders";
import {AuthSpidProviders} from "../../providers/AuthSpid/AuthSpidProviders";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {ProfilePage} from "../profile/profile";
import {ProfilePageModule} from "../profile/profile.module";

@NgModule({
  declarations: [
    WelcomePage
  ],
  imports: [
    ProfilePageModule,
    IonicPageModule.forChild(WelcomePage),
    TranslateModule.forChild()
  ],
  providers: [
    ActionSheet,
    IdentityProviders,
    AuthSpidProviders,
    InAppBrowser
  ],
  exports: [
    WelcomePage
  ]
})
export class WelcomePageModule { }
