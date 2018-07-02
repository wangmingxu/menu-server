import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import {
    map,
    groupBy,
    concatMap,
    mergeMap,
    flatMap,
    delay,
    tap,
    toArray,
    switchMap,
    race,
    pairwise
} from 'rxjs/operators';
import * as moment from 'moment';
import { NoticeItem } from '@delon/abc';
import { SettingsService } from '@delon/theme';
import { timer } from 'rxjs/observable/timer';
import { forkJoin } from 'rxjs/observable/forkJoin';
import * as _ from 'lodash';

/**
 * 菜单通知
 */
@Component({
    selector: 'header-notify',
    template: `
    <notice-icon
        [data]="data"
        [count]="count"
        [loading]="loading"
        (select)="select($event)"
        (clear)="clear($event)"
        [popoverVisible]="expand"
        (popoverVisibleChange)="toggleExpand($event)"></notice-icon>
    `
})
export class HeaderNotifyComponent implements OnInit, OnDestroy {
    combineTotal$: Subscription;

    data: NoticeItem[] = [
        {
            title: '通知',
            list: [],
            emptyText: '你已查看所有通知',
            emptyImage:
                'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg'
        },
        // { title: '消息', list: [], emptyText: '您已读完所有消息', emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg' },
        // { title: '待办', list: [], emptyText: '你已完成所有待办', emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg' }
    ];
    count = 0;
    loading = false;
    expand = true;

    constructor(
        private msg: NzMessageService,
        private settings: SettingsService,
        private http: HttpClient,
        private _notification: NzNotificationService
    ) {}

    ngOnInit() {
        // mock data
        // this.count = this.settings.user.notifyCount || 12;
        this.loadData();
        setTimeout(() => {
            this.expand = false;
        }, 50);
    }
    ngOnDestroy() {
        console.log('ngOnDestroy');
        this.combineTotal$.unsubscribe();
    }
    toggleExpand(status) {
        this.expand = status;
    }
    private parseGroup(data: Observable<any[]>) {
        data
            .pipe(
                concatMap((i: any) => i),
                map((i: any) => {
                    if (i.datetime) i.datetime = moment(i.datetime).fromNow();
                    // change to color
                    if (i.status) {
                        i.color = {
                            todo: '',
                            processing: 'blue',
                            urgent: 'red',
                            doing: 'gold'
                        }[i.status];
                    }
                    return i;
                }),
                groupBy((x: any) => x.type),
                mergeMap(g => g.pipe(toArray())),
                tap((ls: any) => {
                    this.data.find(w => w.title === ls[0].type).list = ls;
                })
            )
            .subscribe(res => (this.loading = false));
    }

    loadData() {
        const $source1 = this.http
            .get<any>('admin/order-change-log', {
                params: {
                    start_at: moment().format('YYYY-MM-DD 00:00:00'),
                    end_at: moment().format('YYYY-MM-DD 23:59:59')
                }
            })
            .pipe(
                map((rst: any) => {
                    return rst.data.items.map(item => {
                        return { ...item, type: 1, sign: `o${item.id}` };
                    });
                })
            );
        const $source2 = this.http.get('admin/reserve-meal-log', {
            params: {
                start_at: moment().format('YYYY-MM-DD 00:00:00'),
                end_at: moment().format('YYYY-MM-DD 23:59:59')
            }
        }).pipe(
            map((rst: any) => {
                return rst.data.items.map(item => {
                    return { ...item, type: 2, sign: `r${item.id}` };
                });
            })
        );
        this.combineTotal$ = timer(500, 10000)
            .pipe(
                switchMap(() => {
                    return forkJoin($source1, $source2);
                }),
                map(itemList => {
                    const items = [].concat(...itemList).sort((a, b) => {
                        return (
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                        );
                    });
                    return items;
                }),
                pairwise()
            )
            .subscribe(([oldItems, newItems]) => {
                const oldSigns = oldItems.map(item => item.sign);
                const newSigns = newItems.map(item => item.sign);
                const diffSigns = _.without(newSigns, ...oldSigns);
                if (oldItems.length > 0 && diffSigns.length > 0) {
                    newItems.forEach(item => {
                        if (diffSigns.includes(item.sign)) {
                            console.log('item.type', item.type);
                            if (item.sign.startsWith('o')) {
                                this._notification.create(
                                    'info',
                                    '加减餐提醒',
                                    `${item.user_name}发起了${
                                        item.quantity > 0 ? '加餐' : '减餐'
                                    }申请,${
                                        item.quantity > 0 ? '加' : '减'
                                    }餐数量:${Math.abs(item.quantity)}`,
                                    {
                                        nzDuration: 60000
                                    }
                                );
                            } else {
                                this._notification.create(
                                    'info',
                                    '留饭提醒',
                                    `${
                                        item.user_name
                                    }发起了留饭申请,留饭数量:${Math.abs(
                                        item.quantity
                                    )}`,
                                    {
                                        nzDuration: 60000
                                    }
                                );
                            }
                        }
                    });
                }
                this.loading = false;
                this.count = newItems.length;
                this.data[0].list = newItems.map(item => {
                    return {
                        id: item.id,
                        avatar:
                            item.type === 1
                                ? 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png'
                                : 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
                        title:
                            item.type === 1
                                ? `${item.user_name}发起了${
                                      item.quantity > 0 ? '加餐' : '减餐'
                                  }申请,${
                                      item.quantity > 0 ? '加' : '减'
                                  }餐数量:${Math.abs(item.quantity)}`
                                : `${
                                      item.user_name
                                  }发起了留饭申请,留饭数量:${Math.abs(
                                      item.quantity
                                  )}`,
                        description: `备注:${item.remark}`,
                        datetime: moment(item.created_at).fromNow()
                    };
                });
            });
    }

    clear(type: string) {
        this.msg.success(`清空了 ${type}`);
    }

    select(res: any) {
        this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
    }
}
