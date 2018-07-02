import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import * as _ from 'lodash';
import {UploadImageService} from '@shared/service/upload-image.service';

@Component({
    selector: 'nz-dishes-manage-component',
    templateUrl: './dishesManageModal.component.html',
    styles: [
        `
        :host ::ng-deep .customize-footer {
            border-top: 1px solid #e9e9e9;
            padding: 10px 18px 0 10px;
            text-align: right;
            border-radius: 0 0 0px 0px;
            margin: 15px -16px -5px -16px;
        }
        :host ::ng-deep .image-uploader,
        :host ::ng-deep .image-uploader-trigger,
        :host ::ng-deep .image {
            width: 150px;
            height: 150px;
            display: block;
        }

        :host ::ng-deep .image-uploader {
            display: block;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
        }

        :host ::ng-deep .image-uploader-trigger {
            display: table-cell;
            vertical-align: middle;
            font-size: 28px;
            color: #999;
        }
    `
    ]
})
export class DishesManageModalComponent implements OnInit {
    id: number;
    loading = false;
    categoryList: any[] = [];
    name: string;
    imageUrl: string;
    category_ids: any[] = [];
    temp_category_ids: any[] = [];

    @Input()
    set extraData(value) {
        this.id = value.id;
        this.name = value.name;
        this.imageUrl = value.image_url;
        this.category_ids = value.categories.map(item => item.id);
        this.temp_category_ids = value.categories.map(item => item.id);
    }

    @Input() type: string;

    daylist: any[] = [
        {
            label: '星期一',
            value: 1
        },
        {
            label: '星期二',
            value: 2
        },
        {
            label: '星期三',
            value: 3
        },
        {
            label: '星期四',
            value: 4
        },
        {
            label: '星期五',
            value: 5
        }
    ];

    timelist: any[] = [
        {
            label: '早上',
            value: 1
        },
        {
            label: '中午',
            value: 2
        },
        {
            label: '晚上',
            value: 3
        }
    ];

    disheslist: any[] = [];

    handleEnsure() {
        let url;
        let httpType;
        let selfParam;
        if (this.type === 'C') {
            url = 'admin/menu';
            httpType = 'post';
            selfParam = {
                category_ids: this.category_ids
            };
        } else {
            url = `admin/menu/${this.id}`;
            httpType = 'put';
            selfParam = {
                add_category_ids: _.difference(this.category_ids, this.temp_category_ids),
                remove_category_ids: _.difference(this.temp_category_ids, this.category_ids),
            };
        }
        this.http[httpType](url, Object.assign({
            name: this.name,
            image_url: this.imageUrl,
        }, selfParam)).subscribe((rst: any) => {
            if (rst.code === 0) {
                this.subject.next({ success: true });
                this.subject.destroy('onOk');
            } else {
                this._message.create('error', rst.msg);
            }
        });
    }

    handleCancel() {
        this.subject.destroy('onCancel');
    }

    private getBase64(img: File, callback: (img: any) => void) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChange(info) {
        if (info.file.status === 'uploading') {
            this.loading = true;
            this.uploadServ.upload(info.file.originFileObj)
                .subscribe((url: any) => {
                    this.loading = false;
                    this.imageUrl = url;
                });
        }
    }

    loadCategory() {
        this.http.get('admin/menu-category', {
            page_size: 999
        })
        .toPromise()
        .then((rst: any) => {
            const {items} = rst.data;
            this.categoryList = items;
        });
    }

    constructor(
        private subject: NzModalSubject,
        private http: _HttpClient,
        private _message: NzMessageService,
        private uploadServ: UploadImageService
    ) {
        this.subject.on('onDestory', () => {
            console.log('destroy');
        });
    }

    ngOnInit() {
        this.loadCategory();
    }
}
