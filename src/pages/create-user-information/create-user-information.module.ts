import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateUserInformationPage } from './create-user-information';

@NgModule({
  declarations: [
    CreateUserInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateUserInformationPage),
  ],
})
export class CreateUserInformationPageModule {}
