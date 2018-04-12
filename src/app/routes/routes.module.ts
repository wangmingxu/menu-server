import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { DishesListComponent } from './dishes-list/dishes-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { MenuListComponent } from './menu-list/menu-list.component';

@NgModule({
    imports: [ SharedModule, RouteRoutingModule ],
    declarations: [
        DashboardComponent,
        // passport pages
        UserLoginComponent,
        UserRegisterComponent,
        UserRegisterResultComponent,
        // single pages
        CallbackComponent,
        Exception403Component,
        Exception404Component,
        Exception500Component,
        CategoryListComponent,
        UserListComponent,
        DishesListComponent,
        OrderListComponent,
        MenuListComponent
    ]
})
export class RoutesModule {}