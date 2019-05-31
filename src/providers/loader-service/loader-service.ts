
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';

@Injectable()
export class LoaderServiceProvider {
  public Loader: any;
  constructor(public loading: LoadingController,private datePicker: DatePicker) { }

  Show(content: string): void {
    this.Loader = this.loading.create({
      content: content
    });
    this.Loader.present();
  }

  Hide(): void {
    if (this.Loader) {
      this.Loader.dismiss();
    }
  }

  getDate():Promise<any>
  {
     return this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => {
        console.log('Got date: ', date)
        let mnth = date.getMonth() + 1;
        return date.getFullYear()+"-"+ mnth +"-"+date.getDate();
      },
      err => 
      {
        console.log('Error occurred while getting date: ', err);
        var date = new Date();
        let mnth = date.getMonth() + 1;
        return date.getFullYear()+"-"+ mnth +"-"+date.getDate();
      })
      .catch(err=>{
        var date = new Date();
        let mnth = date.getMonth() + 1;
        return date.getFullYear()+"-"+ mnth +"-"+date.getDate();
      });
  }

  getTime():Promise<any>
  {
     return this.datePicker.show({
      date: new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => {
        console.log('Got date: ', date)
        return date.getHours()+":"+ date.getMinutes();
      },
      err => 
      {
        console.log('Error occurred while getting date: ', err);
        var date = new Date();
        return date.getHours()+":"+ date.getMinutes();
      })
      .catch(err=>{
        var date = new Date();
        return date.getHours()+":"+ date.getMinutes();
      });
  }
}