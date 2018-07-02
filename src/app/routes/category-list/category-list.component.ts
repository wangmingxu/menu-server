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

interface Category {
    name: string;
    sort: number;
}

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit, DoCheck {
    _current = 1;
    _total = 0;
    _pageSize = 20;
    params: any = {};
    url = `admin/menu-category`;
    dataSet: any[] = [];
    tempEditObject: Category = {
        name: '',
        sort: 1,
    };
    editRow: Number;
    creating: Boolean;
    // @ViewChild('st') st: SimpleTableComponent;
    differ: KeyValueDiffer<string, any>;
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
            // this.st.load(1);
        },
        reset: (form: any) => {
            form.reset({});
            // this.st.reset();
        }
    };
    columns: SimpleTableColumn[] = [
        { title: '分类名称', index: 'name', className: 'text-center' },
        { title: '排序号', index: 'sort', className: 'text-center' }
    ];

    _console(msg) {
        console.log(msg);
    }

    loadData(reset = false) {
        if (reset) {
            this._current = 1;
        }
        this.http.get<any>(this.url, {
            page: this._current,
            page_size: this._pageSize
        })
        .toPromise()
        .then(rst => {
                const {items, page, total} = rst.data;
                this.dataSet = items;
                // this._current = page;
                this._total = total;
        });
    }

    add() {
        this.tempEditObject = {
            name: '',
            sort: 1
        };
        this.creating = true;
    }

    addSubmit() {
        this.http.post(this.url, {
            name: this.tempEditObject.name,
            // status: 1,
            sort: this.tempEditObject.sort,
        })
        .toPromise()
        .then(rst => {
            this.creating = false;
            this.loadData();
        });
    }

    edit(data) {
        this.tempEditObject = { ...data };
        this.editRow = data.id;
    }

    update(id) {
        this.http.put(`${this.url}/${id}`, {
            name: this.tempEditObject.name,
            sort: this.tempEditObject.sort
        })
        .toPromise()
        .then(rst => {
            this.editRow = -1;
            this.messageServ.create('success', '更新成功');
            this.loadData();
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
        private differs: KeyValueDiffers
    ) {
        this.differ = differs.find(this.params).create();
    }

    ngDoCheck() {
        const changes = this.differ.diff(this.params);
        if (changes) {
            let changeCount = 0;
            changes.forEachChangedItem(r => {
                console.log('changed ', r.key, r.currentValue);
                changeCount++;
            });
            if (changeCount > 0) {
                this.loadData();
            }
            // changes.forEachAddedItem(r => console.log('added ' + r.currentValue));
            // changes.forEachRemovedItem(r => console.log('removed ' + r.currentValue));
        } else {
            // console.log('nothing changed');
        }
    }

    ngOnInit() {
        this.loadData();
    }
}
