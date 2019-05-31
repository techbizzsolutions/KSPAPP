import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';
import {Validators, FormBuilder} from '@angular/forms';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-centeruser',
  templateUrl: 'centeruser.html',
})
export class CenteruserPage {

  information:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider, public formBuilder : FormBuilder, public toastCtrl : ToastController,
     public navParams: NavParams) {
    this.information = this
    .formBuilder
    .group({
      BIB: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartuserPage');
  }

  logout() {
    localStorage.clear();
    this
      .navCtrl
      .setRoot(LoginPage);
  }
  create()
  {
    this.loader.Show("Loading...");
    this.api.auth('bib_center_entry', {
      "bib_no":this.information.value.BIB
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.bib_center_entry',res);
      if(res.authorization)
      {
        let toast = this.toastCtrl.create({
          message: res.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.information.reset();
      }
      else{
        let toast = this.toastCtrl.create({
          message: res.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
      }
      
    }, err => {
      this.loader.Hide();
      console.log('login err',err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again', 
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

}

