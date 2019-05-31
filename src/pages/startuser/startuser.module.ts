import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartuserPage } from './startuser';

@NgModule({
  declarations: [
    StartuserPage,
  ],
  imports: [
    IonicPageModule.forChild(StartuserPage),
  ],
})
export class StartuserPageModule {}
