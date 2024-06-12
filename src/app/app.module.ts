import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { LightboxComponent } from './components/lightbox/lightbox.component';
import { PhotoComponent } from './components/photo/photo.component';

import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports:      [ BrowserModule, BrowserAnimationsModule, FormsModule, OverlayModule ],
  declarations: [ AppComponent, HelloComponent, LightboxComponent, PhotoComponent ],
  bootstrap:    [ AppComponent ],
  entryComponents: [ LightboxComponent ],
})
export class AppModule { }
