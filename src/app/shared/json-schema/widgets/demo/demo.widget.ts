import { Component, OnInit } from '@angular/core';
import { ControlWidget } from 'nz-schema-form';

@Component({
    selector: 'nz-sf-demo-widget',
    template: `
    <div nz-form-label nz-col *ngIf="schema.title" [nzSpan]="schema.span_label">
        <label nz-form-item-required [nzRequired]="required" [attr.for]="id">
            <span>
            {{ schema.title }}
            <nz-tooltip *ngIf="showDescription && description" [nzTitle]="description">
                <i nz-tooltip class="anticon anticon-question-circle-o"></i>
            </nz-tooltip>
            </span>
        </label>
    </div>
    <div nz-form-control nz-col [nzSpan]="schema.span_control" [nzOffset]="schema.offset_control">
        <nz-input-group [nzSize]="'large'" nzCompact>
            <nz-select [ngModel]="'Zhejiang'">
                <nz-option [nzLabel]="'Zhejiang'" [nzValue]="'Zhejiang'"></nz-option>
                <nz-option [nzLabel]="'Jiangsu'" [nzValue]="'Jiangsu'"></nz-option>
            </nz-select>
            <input [ngModel]="'Xihu District, Hangzhou'" style="width: 50%;" nz-input>
        </nz-input-group>
    </div>`
})
export class DemoWidgetComponent extends ControlWidget implements OnInit {
    static readonly KEY = 'demo';

    ngOnInit(): void {
    }
}
