import { Component, OnInit, ViewChild, AnimationKeyframesSequenceMetadata } from '@angular/core';
import { SFSchema } from 'nz-schema-form';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
    params: any = {};
    url = `/category`;
    @ViewChild('st') st: SimpleTableComponent;
    searchSchema: SFSchema = {
        properties: {
            q: {
                type: 'string',
                title: '查找'
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
    // columns: SimpleTableColumn[] = [
    //     { title: '编号', index: 'id', className: 'text-center' },
    //     { title: '分类名称', index: 'name', className: 'text-center' },
    // ];
    searchValue: string;

    users: any[] = Array(10).fill({}).map((item: any, idx: number) => {
        return {
            id: idx + 1,
            name: `name ${idx + 1}`,
            age: Math.ceil(Math.random() * 10) + 20
        };
    });
    columns: SimpleTableColumn[] = [
        { title: '编号', index: 'id' },
        { title: '姓名', index: 'name' },
        { title: '年龄', index: 'age' },
        {
            title: '自定义',
            render: 'custom'
        }
    ];

    constructor(private http: _HttpClient) {}

    ngOnInit() {}
}
