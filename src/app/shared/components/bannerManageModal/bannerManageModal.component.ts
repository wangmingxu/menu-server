import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import * as _ from 'lodash';
import * as moment from 'moment';
import {UploadImageService} from '@shared/service/upload-image.service';

@Component({
    selector: 'nz-banner-manage-component',
    templateUrl: './bannerManageModal.component.html',
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
export class BannerManageModalComponent implements OnInit {
    id: number;
    loading = false;
    imageUrl: string;
    targetUrl: string;
    start_at: Date;
    end_at: Date;
    sort: number;
    articleList: any[] = [];
    article: number;

    @Input()
    set extraData(value) {
        this.id = value.id;
        this.imageUrl = value.cover_url;
        this.targetUrl = value.target_url;
        this.sort = value.sort;
        this.start_at = new Date(value.start_at);
        this.end_at = new Date(value.end_at);
        if (this.targetUrl.startsWith('https://test.dockerrepo.jasonlife.me')) {
            this.article = +this.targetUrl.split('/')[4];
        } else {
            this.article = 0;
        }
    }

    @Input() type: string;

    disheslist: any[] = [];

    handleEnsure() {
        let url;
        let httpType;
        let selfParam;
        if (this.type === 'C') {
            url = 'admin/banner';
            httpType = 'post';
            selfParam = {
            };
        } else {
            url = `admin/banner/${this.id}`;
            httpType = 'put';
            selfParam = {
            };
        }
        this.http[httpType](url, Object.assign({
            cover_url: this.imageUrl,
            target_url: this.targetUrl,
            start_at: moment(this.start_at).format('YYYY-MM-DD HH:mm:ss'),
            end_at: moment(this.end_at).format('YYYY-MM-DD HH:mm:ss'),
            sort: this.sort
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

    onArticleChange(e) {
        if (e !== 0) {
            this.targetUrl = `https://test.dockerrepo.jasonlife.me/article/${e}/preview`;
        } else {
            this.targetUrl = '';
        }
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

    loadArticle() {
        this.http.get('admin/article', {
            page_size: 999
        })
        .toPromise()
        .then((rst: any) => {
            const {items} = rst.data;
            this.articleList = items;
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
        this.loadArticle();
    }
}
