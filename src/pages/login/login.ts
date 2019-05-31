import { Component } from '@angular/core';
import { NavController, AlertController,ToastController, Events } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private register : FormGroup;
  user:any;
  region:any;
  //"phone":"9225241212"
  //"password":"123456"
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public events: Events,
     public toastCtrl: ToastController,public formBuilder: FormBuilder,public alertCtrl: AlertController) {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
    if(this.user)
    {
      this.register = this.formBuilder.group({
        Password: ["", Validators.required],
        Mobile : [this.user.Mobile,Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(15)])]
      });
    }
    else{
      this.register = this.formBuilder.group({
        Password: ['', Validators.required],
        Mobile : ['',Validators.compose([Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$'), Validators.maxLength(15)])]
      });
    }
   
  }

  logForm()
  {
    console.log(this.register.value);
    if(!this.region)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Role',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    let role = '0';
    switch(this.region)
    {
      case 'Admin':
      role = '0';
      break;
      case 'User':
      role = '1';
      break;
      default:
      
    }
    this.loader.Show("Loading...");
      this.api.add('login', {
        "user_type":role,
        "phone":this.register.value.Mobile,
        "password":this.register.value.Password
      }).subscribe(res => {
        console.log('login',res);
        this.loader.Hide();
        if(res.authorization)
        {
          this.register.value.res = res;
          this.register.value.role = this.region;
          localStorage.setItem('user', JSON.stringify(this.register.value));
          this.events.publish('user:loggedIn');
        switch(this.region)
        {
          case 'Admin':
          this.navCtrl.setRoot('AdminHomePage');
          break;
          case 'User':
            this.checkUserType(res);
          break;
          default:
         }
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

  checkUserType(res)
  {
    switch(res.competition_user_type)
        {
          case '1':
          this.navCtrl.setRoot('StartuserPage');
          break;
          case '2':
          this.navCtrl.setRoot('CenteruserPage');
          break;
          case '3':
          this.navCtrl.setRoot('ResultuserPage');
          break;
          case '4':
          this.navCtrl.setRoot('EndStagePage');
          break;
          default:
          this.navCtrl.setRoot('StartuserPage');
         }
  }

  login()
  {
    this.navCtrl.push('ForgotMobilePage');
  }
  
}