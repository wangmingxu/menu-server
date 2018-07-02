import axios from 'axios';
import { map, switchMap } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/observable';
import { environment } from '@env/environment';
import {Injectable} from '@angular/core';

@Injectable()
export class UploadImageService {
    constructor(
        public http: _HttpClient
    ) {}

    upload(file) {
        return this.http
            .get('admin/upload/qiniu/token')
            .pipe(
                map((res: any) => res.data.token),
                switchMap(token => {
                    const formData = new FormData();
                    formData.append('token', token);
                    formData.append('file', file);
                    return Observable.create(observer => {
                        axios
                            .post('https://up-z2.qiniup.com/', formData)
                            .then(rst => {
                                observer.next(rst.data);
                            })
                            .catch(e => {
                                observer.error(e);
                            });
                    });
                    // return this.http.post('https://up-z2.qiniup.com/', formData);
                }),
                map((rst: any) => `${environment.qiniuDomain}/${rst.key}`)
            );
    }
}
