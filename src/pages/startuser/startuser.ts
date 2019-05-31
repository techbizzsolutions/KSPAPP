import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';
import {Validators, FormBuilder} from '@angular/forms';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-startuser',
  templateUrl: 'startuser.html',
})
export class StartuserPage {
  information:any;
  isdisable:boolean = false;
  time :any;
  runTimer:any;
  hasStarted:any;
  hasFinished:any=true;
  remainingTime:any;
  timeInSeconds:any;
  displayTime:any;
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

  initTimer() {
    // Pomodoro is usually for 25 minutes
   if (!this.timeInSeconds) { 
     this.timeInSeconds = 60; 
   }
 
   this.time = this.timeInSeconds;
   this.runTimer = false;
   this.hasStarted = false;
   this.hasFinished = true;
   this.remainingTime = this.timeInSeconds;
   this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
 }
 
 startTimer() {
   this.runTimer = true;
   this.hasStarted = true;
   this.hasFinished = false;
   this.timerTick();
 }
 
 pauseTimer() {
   this.runTimer = false;
 }
 
 resumeTimer() {
   this.startTimer();
 }
 
 timerTick() {
   setTimeout(() => {
 
     if (!this.runTimer) { return; }
     this.remainingTime--;
     this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
     if (this.remainingTime > 0) {
       this.timerTick();
     }
     else {
       this.hasFinished = true;
     }
   }, 1000);
 }
 
 getSecondsAsDigitalClock(inputSeconds: number) {
   var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
   var hours = Math.floor(sec_num / 3600);
   var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
   var seconds = sec_num - (hours * 3600) - (minutes * 60);
   var hoursString = '';
   var minutesString = '';
   var secondsString = '';
   hoursString = (hours < 10) ? "0" + hours : hours.toString();
   minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
   secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
   return hoursString + ':' + minutesString + ':' + secondsString;
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartuserPage');
    this.initTimer();
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
    this.api.auth('bib_start_entry', {
      "bib_no":this.information.value.BIB
    }).subscribe(res => {
      this.loader.Hide();
      console.log('this.bib_start_entry',res);
      if(res.authorization)
      {
        let toast = this.toastCtrl.create({
          message: res.message, 
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.initTimer();
        this.startTimer();
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
