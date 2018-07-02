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
import { Lightbox } from 'angular2-lightbox';
@Component({
    selector: 'app-callback-list',
    templateUrl: './callback.component.html'
})
export class CallbackComponent implements OnInit, DoCheck {
    _current = 1;
    _total = 0;
    _pageSize = 20;
    params: any = {};
    url = `admin/feedback/`;
    dataSet: any[] = [];
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

    open(index: number, data): void {
        console.log(index);
        const _albums = data.images.map((item, i) => {
            return {
                src: item.url,
                caption: data.content,
                thumb: item.url,
            };
        });
        console.log(_albums);
        // open lightbox
        this._lightbox.open(_albums, index);
      }

    constructor(
        public http: _HttpClient,
        private messageServ: NzMessageService,
        private differs: KeyValueDiffers,
        private _lightbox: Lightbox
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
