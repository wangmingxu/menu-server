import * as moment from 'moment';

export enum RangeType {
    breakfast= 1,
    lunch= 2,
    dinner= 3
}

export const MealRange  = {
    breakfast: [0, 10],
    lunch: [11, 14],
    dinner: [15, 23]
};

export function genTimeRange(day, rangeType?: RangeType) {
    let d = moment(moment().isoWeekday(day).format('YYYY MM DD'));
    const isNextWeek = moment().isAfter(d, 'day');
    if (isNextWeek) {
        d = moment(moment().format('YYYY MM DD')).set('days', 7).add('days', day);
    }
    if (rangeType === RangeType.breakfast) {
        return [moment(d).set('hours', MealRange.breakfast[0]), moment(d).set('hours', MealRange.breakfast[1])];
    } else if (rangeType === RangeType.lunch) {
        return [moment(d).set('hours', MealRange.lunch[0]), moment(d).set('hours', MealRange.lunch[1])];
    } else if (rangeType === RangeType.dinner) {
        return [moment(d).set('hours', MealRange.dinner[0]), moment(d).set('hours', MealRange.dinner[1])];
    } else {
        return [d, d];
    } 
}
