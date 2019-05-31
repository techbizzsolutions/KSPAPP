import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { File } from '@ionic-native/file';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ApiProvider } from '../providers/api/api';
import { LoaderServiceProvider } from '../providers/loader-service/loader-service';
import { Network } from '@ionic-native/network';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DatePicker } from '@ionic-native/date-picker';
import { FilterPage } from '../pages/filter/filter';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileOpener } from '@ionic-native/file-opener';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    FilterPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    FilterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    File,
    FileTransfer,
    FileChooser,
    DatePicker,
    AndroidPermissions,
    FileOpener,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    LoaderServiceProvider
  ]
})
export class AppModule {}
