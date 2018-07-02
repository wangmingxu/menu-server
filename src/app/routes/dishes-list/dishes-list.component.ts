import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema } from 'nz-schema-form';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import {DishesManageModalComponent} from '../../shared/components/dishesManageModal/dishesManageModal.component';
import { Lightbox } from 'angular2-lightbox';

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
})
export class DishesListComponent implements OnInit {
    _current = 1;
    _total = 0;
    _pageSize = 20;
    params: any = {};
    tempFilter: any = {};
    url = `admin/menu`;
    dataSet: any[] = [];
    categoryList: any[] = [];
    editRow: Number;
    creating = false;
    searchSchema: SFSchema = {
        properties: {
            q: {
                type: 'string',
                title: '关键词'
            }
        },
        button: {
            items: [
                {
                    label: '搜索',
                    id: 'send',
                    type: 'primary'
                },
                {
                    label: '重置',
                    id: 'reset'
                }
            ]
        }
    };
    searchActions = {
        send: (form: any) => {
            // this.st.load(1);
        },
        reset: (form: any) => {
            form.reset({});
            // this.st.reset();
        }
    };

    searchWithFilter() {
        this.loadData(true, this.tempFilter);
    }

    resetFilter() {
        this.tempFilter = {};
        this.loadData(true);
    }

    loadData(reset = false, query?: any) {
        if (reset) {
            this._current = 1;
        }
        this.http.get<any>(this.url, Object.assign({
            page: this._current,
            page_size: this._pageSize,
        }, query || {}))
        .toPromise()
        .then(rst => {
                const {items, page, total} = rst.data;
                this.dataSet = items;
                this._total = total;
        });
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

    showMenuManageModal(type, extraData?: any) {
        const subscription = this.modalServ.open({
            title: type === 'C' ? '菜式录入' : '菜式编辑', // 设置一个增删改查的映射表
            content: DishesManageModalComponent,
            onOk() {},
            onCancel() {
                console.log('Click cancel');
            },
            footer: false,
            componentParams: type === 'C' ? {type} : {type, extraData}
        });
        subscription.subscribe(result => {
            if (result.success) {
                this.loadData();
                this.messageServ.success('操作成功');
            }
        });
    }

    delete(id) {
        this.http.delete(`${this.url}/${id}`)
        .toPromise()
        .then(rst => {
            this.messageServ.create('success', '删除成功');
            this.loadData();
        });
    }

    open(url) {
        this._lightbox.open([{
            src: url,
            caption: '',
            thumb: url + '?imageView2/0/w/100/h/100',
        }], 0);
    }

    constructor(
        public http: _HttpClient,
        private messageServ: NzMessageService,
        private modalServ: NzModalService,
        private _lightbox: Lightbox
    ) { }

    ngOnInit() { 
        this.loadData();
        this.loadCategory();
    }

}
