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
import { MenuManageModalComponent } from '../../shared/components/menuManageModal/menuManageModal.component';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-menu-list',
    templateUrl: './menu-list.component.html'
})
export class MenuListComponent implements OnInit, DoCheck {
    params: any = {};
    date = moment().format('YYYY-MM-DD');
    // url = '/menulist';
    url = `admin/menu-valid-period`;
    dataSet: any[] = [];
    expandList: any[] = [];
    // @ViewChild('st') st: SimpleTableComponent;
    differ: KeyValueDiffer<string, any>;

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
        // { title: '编号', index: 'id', className: 'text-center' },
        { title: '分类名称', index: 'name', className: 'text-center' }
    ];

    collapse(key, $event) {
        if ($event === false) {
            this.expandList = this.expandList.filter(item => item !== key);
        } else {
            this.expandList = [...this.expandList, key];
        }
    }

    expandDataCache = {};

    // collapse(array, data, $event) {
    //     if ($event === false) {
    //         if (data.children) {
    //             data.children.forEach(d => {
    //                 const target = array.find(a => a.key === d.key);
    //                 target.expand = false;
    //                 this.collapse(array, target, false);
    //             });
    //         } else {
    //             return;
    //         }
    //     }
    // }

    convertTreeToList(root) {
        const stack = [],
            array = [],
            hashMap = {};
        stack.push({ ...root, level: 0, expand: false });

        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({
                        ...node.children[i],
                        level: node.level + 1,
                        expand: false,
                        parent: node
                    });
                }
            }
        }

        return array;
    }

    visitNode(node, hashMap, array) {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }

    showMenuManageModal(type, extraData?: any) {
        const subscription = this.modalServ.open({
            title: type === 'C' ? '每日菜式录入' : '每日菜式编辑', // 设置一个增删改查的映射表
            content: MenuManageModalComponent,
            onOk() {},
            onCancel() {
                console.log('Click cancel');
            },
            footer: false,
            componentParams: type === 'C' ? { type, extraData: this.date } : { type, extraData }
        });
        subscription.subscribe(result => {
            if (result.success) {
                this.loadData();
                this.messageServ.success('操作成功');
            }
        });
    }

    loadData() {
        this.http
        .get<any>(this.url, {
            page_size: 999,
            start_at: moment(this.date).format('YYYY-MM-DD 00:00:00'),
            end_at: moment(this.date).format('YYYY-MM-DD 23:59:59'),
        })
        .toPromise()
        .then(rst => {
            const { items } = rst.data;
            this.dataSet = _.groupBy(items, 'start_at');
            // this.dataSet = rst.list;
            // this.dataSet.forEach(item => {
            //     this.expandDataCache[item.key] = this.convertTreeToList(item);
            // });
            // console.log(this.expandDataCache);
        });
    }

    update(id) {
        console.log(id);
    }

    delete(id) {
        this.http.delete(`${this.url}/${id}`)
        .toPromise()
        .then(rst => {
            this.messageServ.create('success', '删除成功');
            this.loadData();
        });
    }

    clear(date) {
        this.http.get(`${this.url}/clear`, {
            start_at: moment(date).format('YYYY-MM-DD HH:mm:ss'),
            end_at: moment(date).format('YYYY-MM-DD HH:mm:ss')
        })
        .toPromise()
        .then(rst => {
            this.messageServ.create('success', '删除成功');
            this.loadData();
        });
    }

    constructor(
        private http: _HttpClient,
        private messageServ: NzMessageService,
        private differs: KeyValueDiffers,
        private modalServ: NzModalService
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
