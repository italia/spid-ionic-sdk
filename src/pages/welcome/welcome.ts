import { Component } from '@angular/core';
import {IonicPage, NavController, LoadingController, AlertController} from 'ionic-angular';
import {ActionSheet, ActionSheetOptions} from "@ionic-native/action-sheet";
import {IdentityProvider} from "../../models/IdentityProvider";
import {Observable} from "rxjs";
import {IdentityProviders} from "../../providers/IdentityProviders/IdentityProviders";
import {AuthSpidProviders} from "../../providers/AuthSpid/AuthSpidProviders";
import {AuthSpid} from "../../models/AuthSpid";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {ProfilePage} from "../profile/profile";
import {
  LABEL_LOADING_GENERIC, LABEL_ALERT_ERROR_BROWSER, LABEL_ALERT_ERROR,
  LABEL_OK_BUTTON, LABEL_ALERT_ERROR_REST, MOCK_ENABLED, LABEL_ALERT_ERROR_SPID_LOGIN, MOCK_ONLY_POSTEID
} from "../../models/Costants";
import {UserSpid} from "../../models/UserSpid";

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  private identityProviders: Array<IdentityProvider> = [];
  private loading;

  constructor(public navCtrl: NavController, private actionSheet: ActionSheet,
              private _identityProviders: IdentityProviders, private _authSpidProviders: AuthSpidProviders,
              private iab: InAppBrowser, private _loading: LoadingController,private alertCtrl: AlertController) { }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {

    this._identityProviders.query().catch((error:any)=>Observable.throw(error.json().error || 'Server error')).subscribe(
      response => {

        console.log(response);
        let data = response;


        if(data.identityProviders && data.identityProviders.length > 0) {
          for (let i=0; i<data.identityProviders.length; i++) {
            let identityProvider: IdentityProvider = data.identityProviders[i];
            this.identityProviders.push(identityProvider);
          }
        }

        console.log(this.identityProviders);

      },
      err => {
        console.error("Error: "+err);
        //this.loading.dismiss();
      },
      () => {
        console.log('IdentityProviders completed!');
        //this.loading.dismiss();
      }

    );

    /* */

  }

  /**
   * Open Alert message (used for errore message)
   */
  presentAlert(title:string,description:string,button:string) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: description,
      buttons: [button]
    });
    alert.present();
  }

  openActionSheet() {

    let buttonLabels: Array<string> = [];

    for (let i=0; i<this.identityProviders.length; i++) {
      buttonLabels.push(this.identityProviders[i].name);
    }

    const options: ActionSheetOptions = {
      title: 'ENTRA CON SPID',
      subtitle: 'Choose an provider',
      buttonLabels: buttonLabels,
      addCancelButtonWithLabel: 'Cancel',
      //addDestructiveButtonWithLabel: 'Delete',
      androidTheme: this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
      destructiveButtonLast: true
    };

    // Open Action Scheet to select identity provider
    this.actionSheet.show(options).then((buttonIndex: number) => {

      //call rest service to get the request that the provider needed
      this._authSpidProviders.query(this.identityProviders[(buttonIndex-1)].entityId,{entityId:this.identityProviders[buttonIndex].entityId}).catch((error:any)=>Observable.throw(error.json().error || 'Server error')).subscribe(
        response => {

          console.log(response);
          let authSpid:AuthSpid = response;
          let checkFirstPost = true;

          //open spid login page for provider selected
          const browser = this.iab.create(authSpid.destinationUrl,"_self",{location:'no'});
          browser.on('loadstart').subscribe(
            response => {

              if(checkFirstPost) {
                console.log(response);
                browser.executeScript({code: "(function() { var form = document.createElement('form');form.setAttribute('method','post');form.setAttribute('action', '" + authSpid.destinationUrl + "');var hiddenField = document.createElement('input');hiddenField.setAttribute('type', 'text');hiddenField.setAttribute('name', 'xmlAuthRequest'); hiddenField.setAttribute('value', '" + authSpid.xmlAuthRequest + "');form.appendChild(hiddenField);document.body.appendChild(form);form.submit();})()"}).then(
                  (a:any)=>(checkFirstPost = false)
                );

              }
            },
            err => {
              console.error("Error: "+err);
              this.presentAlert(LABEL_ALERT_ERROR,LABEL_ALERT_ERROR_BROWSER,LABEL_OK_BUTTON);
            },
            () => {
              console.log('IdentityProviders completed!');

            }

          )

          var objJson:UserSpid;

            //{file: "<script>xhr.open('POST' "+authSpid.xmlAuthRequest+", true);xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');xhr.send("+authSpid.xmlAuthRequest+");alert('fatto')</script>"});
          browser.on('loadstop').catch((error:any)=>Observable.throw(error.json().error || 'Server error')).subscribe(
            response => {

              console.log(response);

              browser.executeScript({code: "document.body.innerHTML"}).then(function (response) {

                if (/^[\],:{}\s]*$/.test(response.replace(/\\["\\\/bfnrtu]/g, '@').
                  replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                  replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                  //the json is ok
                  objJson = JSON.parse(response);

                  this.loading = this._loading.create({
                    content: LABEL_LOADING_GENERIC
                  });

                  this.loading.present();

                  browser.close();
                  this.loading.dismiss();

                  //navigate into profile page
                  this.navigatoToProfile(objJson);

                }else{

                  //the json is not ok
                  if(MOCK_ENABLED) {

                    if(MOCK_ONLY_POSTEID) {
                      //check the url request (it works only for POSTE ID)
                      let url = response.url.split("/");
                      for (let i = 0; i < url.length; i++) {
                        if (url[i] == 'private') {

                          this.loading = this._loading.create({
                            content: LABEL_LOADING_GENERIC
                          });

                          this.loading.present();

                          browser.close();
                          this.loading.dismiss();

                          //navigate into profile page
                          this.navigatoToProfile(objJson);

                        }
                      }
                    } else {
                      browser.close();
                      this.navigatoToProfile(objJson);
                    }


                  } else {
                    this.presentAlert(LABEL_ALERT_ERROR,LABEL_ALERT_ERROR_SPID_LOGIN,LABEL_OK_BUTTON);
                  }

                }


              });

              //@TODO
              //check the url request (it works only for POSTE ID)
              /*let url = response.url.split("/");
              for(let i=0; i<url.length; i++) {
                if(url[i] == 'private') {

                  this.loading = this._loading.create({
                    content: LABEL_LOADING_GENERIC
                  });

                  this.loading.present();

                  browser.close();
                  this.loading.dismiss();

                  //navigate into profile page
                  this.navigatoToProfile(objJson);

                }
              } */

            },
            err => {
              console.error("Error: "+err);
              this.presentAlert(LABEL_ALERT_ERROR,LABEL_ALERT_ERROR_BROWSER,LABEL_OK_BUTTON);
            },
            () => {
              console.log('IdentityProviders completed!');

            }
          );

        },
        err => {
          console.error("Error: "+err);
          this.presentAlert(LABEL_ALERT_ERROR,LABEL_ALERT_ERROR_REST,LABEL_OK_BUTTON);
        },
        () => {
          console.log('IdentityProviders completed!');

        }

      );

    });



  }

  /**
   * Navigate to Profile Page
   */
  navigatoToProfile(objJson:UserSpid) {
    this.navCtrl.setRoot('ProfilePage',{user:objJson});
  }

}
