import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { NgZorroAntdExtraModule } from 'ng-zorro-antd-extra';
import { AlainThemeModule } from '@delon/theme';
import { AlainACLModule } from '@delon/acl';
import { ZORROMODULES, ABCMODULES } from '../delon.module';

// custom component
import { MenuManageModalComponent } from './components/menuManageModal/menuManageModal.component';
import { DishesManageModalComponent } from './components/dishesManageModal/dishesManageModal.component';
import { BannerManageModalComponent } from './components/bannerManageModal/bannerManageModal.component';

// custom pipe
import { TimeRangePipe } from './pipe/time-range.pipe';

// custom service
import {UploadImageService} from './service/upload-image.service';

// region: third libs
import { CountdownModule } from 'ngx-countdown';
import { NzSchemaFormModule } from 'nz-schema-form';
import { LightboxModule, Lightbox } from 'angular2-lightbox';
import { QuillEditorModule } from 'ngx-quill-editor';

const THIRDMODULES = [
    CountdownModule,
    NzSchemaFormModule,
    LightboxModule,
    QuillEditorModule
];
// endregion

// region: your componets & directives & pipe
const COMPONENTS = [MenuManageModalComponent, DishesManageModalComponent, BannerManageModalComponent];
const DIRECTIVES = [];
const PIPES = [TimeRangePipe];
const SERVICES = [Lightbox, UploadImageService];
// endregion

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        ...ZORROMODULES,
        NgZorroAntdExtraModule,
        AlainThemeModule.forChild(),
        ...ABCMODULES,
        AlainACLModule,
        // third libs
        ...THIRDMODULES,
    ],
    entryComponents: [
        ...COMPONENTS,
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ...ZORROMODULES,
        NgZorroAntdExtraModule,
        AlainThemeModule,
        ...ABCMODULES,
        // third libs
        ...THIRDMODULES,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES
    ],
    providers: [...PIPES, ...SERVICES]
})
export class SharedModule { }
