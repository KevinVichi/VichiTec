import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateProductComponent } from './components/add-update-product/add-update-product.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    AddUpdateProductComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    AddUpdateProductComponent,
    ReactiveFormsModule,
    FormsModule    
  ]
})
export class SharedModule { }
