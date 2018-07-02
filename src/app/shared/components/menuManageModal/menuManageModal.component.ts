import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import * as moment from 'moment';
import {MealRange, RangeType} from '../../helpers';

@Component({
    selector: 'nz-menu-manage-component',
    templateUrl: './menuManageModal.component.html',
    styles: [
        `
      :host ::ng-deep .customize-footer {
        border-top: 1px solid #e9e9e9;
        padding: 10px 18px 0 10px;
        text-align: right;
        border-radius: 0 0 0px 0px;
        margin: 15px -16px -5px -16px;
      }
    `
    ]
})
export class MenuManageModalComponent implements OnInit {
    id: number;

    // day: number;

    _date: Date;

    rangeType: number;

    menu_ids: any[];

    menu_id: number;

    _disabledDate(current: Date): boolean {
        return current && moment(current).isBefore(moment(), 'date');
    }

    @Input()
    set extraData(value) {
        // this.day = moment(value).get('day');
        this._date = new Date(value);
        const hour = moment(value).get('hour');
        if (hour >= MealRange.breakfast[0] && hour <= MealRange.breakfast[1]) {
            this.rangeType = 1;
        }else if (hour >= MealRange.lunch[0] && hour <= MealRange.lunch[1]) {
            this.rangeType = 2;
        }else if (hour >= MealRange.dinner[0] && hour <= MealRange.dinner[1]) {
            this.rangeType = 3;
        }
    }

    @Input() type: string;

    daylist: any[] = [
        {
            label: '星期一',
            value: 1,
        },
        {
            label: '星期二',
            value: 2,
        },
        {
            label: '星期三',
            value: 3,
        },
        {
            label: '星期四',
            value: 4,
        },
        {
            label: '星期五',
            value: 5,
        }
    ];

    timelist: any[] = [
        {
            label: '早上',
            value: 1,
        },
        {
            label: '中午',
            value: 2,
        },
        {
            label: '晚上',
            value: 3,
        },
    ];

    disheslist: any[] = [];

    handleEnsure() {
        let url;
        let httpType;
        let selfParam;
        // const range = genTimeRange(this.day, this.rangeType);
        if (this.type === 'C') {
            url = 'admin/menu-valid-period/multi-create';
            httpType = 'post';
            selfParam = {
                start_at: moment(this._date).set('hours', MealRange[RangeType[this.rangeType]][0]).format('YYYY-MM-DD HH:00:00'),
                end_at: moment(this._date).set('hours', MealRange[RangeType[this.rangeType]][1]).format('YYYY-MM-DD HH:00:00'),
                // start_at: range[0].format('YYYY-MM-DD HH:mm:ss'),
                // end_at: range[1].format('YYYY-MM-DD HH:mm:ss'),
                menu_ids: this.menu_ids,
            };
        } else {
            url = `admin/menu-valid-period`;
            httpType = 'post';
            selfParam = {
                menu_id: this.menu_id,
                // start_at: range[0].format('YYYY-MM-DD HH:mm:ss'),
                // end_at: range[1].format('YYYY-MM-DD HH:mm:ss'),
                start_at: moment(this._date).set('hours', MealRange[RangeType[this.rangeType]][0]).format('YYYY-MM-DD HH:00:00'),
                end_at: moment(this._date).set('hours', MealRange[RangeType[this.rangeType]][1]).format('YYYY-MM-DD HH:00:00'),
            };
        }
        this.http[httpType](url, Object.assign({}, selfParam))
            .subscribe(rst => {
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

    loadCategory() {
        this.http.get('admin/menu', {
            page_size: 999,
        })
        .toPromise()
        .then((rst: any) => {
            const {items} = rst.data;
            this.disheslist = items;
        });
    }

    constructor(
        private subject: NzModalSubject,
        private http: _HttpClient,
        private _message: NzMessageService
    ) {
        this.subject.on('onDestory', () => {
            console.log('destroy');
        });
    }

    ngOnInit() {
        this.loadCategory();
    }
}
