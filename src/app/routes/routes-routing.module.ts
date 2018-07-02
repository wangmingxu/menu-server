import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
// import { DashboardComponent } from './dashboard/dashboard.component';
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
import { BannerComponent } from './banner/banner.component';
import { SummaryComponent } from './summary/summary.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleListComponent } from './article/article.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutDefaultComponent,
        children: [
            { path: '', redirectTo: 'summary', pathMatch: 'full' },
            {
                path: 'categorylist',
                component: CategoryListComponent,
                data: { title: '分类管理' }
            },
            {
                path: 'disheslist',
                component: DishesListComponent,
                data: { title: '菜式管理' }
            },
            {
                path: 'menulist',
                component: MenuListComponent,
                data: { title: '每日菜单管理' }
            },
            {
                path: 'orderlist',
                component: OrderListComponent,
                data: { title: '订单管理' }
            },
            {
                path: 'userlist',
                component: UserListComponent,
                data: { title: '员工管理' }
            },
            {
                path: 'banner',
                component: BannerComponent,
                data: {title: 'banner管理'}
            },
            {
                path: 'callback',
                component: CallbackComponent,
                data: {title: '意见反馈'}
            },
            {
                path: 'summary',
                component: SummaryComponent,
                data: {title: '订单总览'}
            },
            {
                path: 'article-edit/:id',
                component: ArticleEditComponent,
                data: {title: '文章编辑'}
            },
            {
                path: 'article',
                component: ArticleListComponent,
                data: {title: '文章管理'}
            }
            // { path: 'dashboard', component: DashboardComponent, data: { title: '仪表盘' } },
            // 业务子模块
            // { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' }
        ]
    },
    // 全屏布局
    // {
    //     path: 'fullscreen',
    //     component: LayoutFullScreenComponent,
    //     children: [
    //     ]
    // },
    // passport
    {
        path: 'passport',
        component: LayoutPassportComponent,
        children: [
            { path: 'login', component: UserLoginComponent },
            { path: 'register', component: UserRegisterComponent },
            { path: 'register-result', component: UserRegisterResultComponent }
        ]
    },
    // 单页不包裹Layout
    // { path: 'callback/:type', component: CallbackComponent },
    { path: '403', component: Exception403Component },
    { path: '404', component: Exception404Component },
    { path: '500', component: Exception500Component },
    { path: '**', redirectTo: 'passport/login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
    exports: [RouterModule]
})
export class RouteRoutingModule {}
