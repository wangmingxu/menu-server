import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema } from 'nz-schema-form';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import {DishesManageModalComponent} from '../../shared/components/dishesManageModal/dishesManageModal.component';
import * as moment from 'moment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
    _current = 1;
    _total = 0;
    _pageSize = 20;
    date = moment().format('YYYY-MM-DD');
    params: any = {};
    url = `admin/order/`;
    dataSet: any[] = [];
    summary: any;
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

    loadData(reset = false) {
        if (reset) {
            this._current = 1;
        }
        this.http.get<any>(this.url, {
            page: this._current,
            page_size: this._pageSize,
            start_at: moment(this.date).format('YYYY-MM-DD 00:00:00'),
            end_at: moment(this.date).format('YYYY-MM-DD 23:59:59')
        })
        .toPromise()
        .then(rst => {
                const {items, page, total} = rst.data;
                this.dataSet = items;
                this._total = total;
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

    constructor(
        public http: _HttpClient,
        private messageServ: NzMessageService,
        private modalServ: NzModalService
    ) { }

    ngOnInit() { 
        this.loadData();
    }

}
