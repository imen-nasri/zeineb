import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientListComponent } from './client-list/client-list.component';
import { SalesOverviewComponent } from './sales-overview/sales-overview.component';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddClientComponent } from './add-client/add-client.component';
import { BestSellerComponent } from './best-seller/best-seller.component';
import { Chart } from 'chart.js';
import { LayoutComponent } from './layout/layout.component';
import { UsersComponent } from './users/users.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DashboardComponent,
    ClientListComponent,
    SalesOverviewComponent,
    AddSaleComponent,
    AddProductComponent,
    AddClientComponent,
    BestSellerComponent,
    LayoutComponent,
    UsersComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    
   
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
