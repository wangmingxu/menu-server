import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema } from 'nz-schema-form';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {

    params: any = {};
    url = `/`;
    @ViewChild('st') st: SimpleTableComponent;
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
            this.st.load(1);
        },
        reset: (form: any) => {
            form.reset({});
            this.st.reset();
        }
    };
    columns: SimpleTableColumn[] = [
        { title: '编号', index: 'id' },
        { title: '邮箱', index: 'email' }
    ];

    constructor(private http: _HttpClient) { }

    ngOnInit() { }

}
