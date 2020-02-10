import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '@services/data.service';

import {
  MatToolbarModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatSnackBarModule } from '@angular/material';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { MessageService } from '@services/message.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ProductAddComponent,
    ProductViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSnackBarModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [DataService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
