import { SalesOverviewComponent } from './sales-overview/sales-overview.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddClientComponent } from './add-client/add-client.component';
import { ClientListComponent } from './client-list/client-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { LayoutComponent } from './layout/layout.component';
import { UsersComponent } from './users/users.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'over', component: SalesOverviewComponent },
      { path: 'add', component: AddClientComponent },
      { path: 'list', component: ClientListComponent },
      { path: 'addp', component: AddProductComponent },
      { path: 'adds', component: AddSaleComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: '**', redirectTo: '/dashboard' }, 
  { 
    path: 'users', 
    component: UsersComponent, 
    canActivate: [AuthGuard] // Protecting the route
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
