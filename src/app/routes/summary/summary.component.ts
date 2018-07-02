import {
    Component,
    OnInit,
    ViewChild,
    DoCheck,
    KeyValueDiffers,
    KeyValueDiffer
} from '@angular/core';
import { SFSchema } from 'nz-schema-form';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-summary-list',
    templateUrl: './summary.component.html'
})
export class SummaryComponent implements OnInit {
    params: any = {};
    url = `admin/order/summary-in-today`;
    dataSet: any = {
        total: 0,
        user_total: 0,
        menu_summary: []
    };
    reserveNum = 0;
    baseTotal = 0;
    changeTotal = 0;
    currentTotal = 0;

    loadData() {
        this.http.get<any>(this.url)
        .toPromise()
        .then(rst => {
            this.dataSet = rst.data;
        });
        this.http.get<any>('admin/reserve-meal-log/total-in-today')
        .toPromise()
        .then(rst => {
            this.reserveNum = rst.data.total;
        });
        this.http.get<any>('admin/order-change-log/total-in-today')
        .toPromise()
        .then(rst => {
            const {baseTotal, changeTotal, currentTotal} = rst.data;
            this.baseTotal = baseTotal;
            this.changeTotal = changeTotal;
            this.currentTotal = currentTotal;
        });
    }

    constructor(
        private http: _HttpClient,
        private messageServ: NzMessageService,
    ) {
    }

    ngOnInit() {
        this.loadData();
    }
}
