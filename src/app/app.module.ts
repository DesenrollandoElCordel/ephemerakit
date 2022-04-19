import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';


import { environment } from '../environments/environment';
import { HomeComponent } from './pages/home/home.component';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { SettingsFormComponent } from './components/settings-form/settings-form.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DialogComponent } from './components/dialog/dialog.component';
import { HelpComponent } from './components/help/help.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    BottomSheetComponent,
    DialogComponent,
    SettingsFormComponent,
    HelpComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
