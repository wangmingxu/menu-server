import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import {MealRange} from '../helpers';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'timeRange'})
export class TimeRangePipe implements PipeTransform {
  transform(value: any[]): string {
    const hour = moment(value).get('hour');
    if (hour >= MealRange.breakfast[0] && hour <= MealRange.breakfast[1]) {
        return '早餐';
    }else if (hour >= MealRange.lunch[0] && hour <= MealRange.lunch[1]) {
        return '午餐';
    }else if (hour >= MealRange.dinner[0] && hour <= MealRange.dinner[1]) {
        return '晚餐';
    }else {
        return '未知';
    }
  }
}
