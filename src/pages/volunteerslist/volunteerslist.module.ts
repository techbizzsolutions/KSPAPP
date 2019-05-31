import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VolunteerslistPage } from './volunteerslist';

@NgModule({
  declarations: [
    VolunteerslistPage,
  ],
  imports: [
    IonicPageModule.forChild(VolunteerslistPage),
  ],
})
export class VolunteerslistPageModule {}
