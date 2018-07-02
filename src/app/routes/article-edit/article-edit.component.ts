import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { map } from 'rxjs/operators';
import { UploadImageService } from '@shared/service/upload-image.service';

interface Article {
    title: string;
    content: string;
}

@Component({
    selector: 'app-article-edit',
    templateUrl: './article-edit.component.html'
})
export class ArticleEditComponent implements OnInit {
    id: number;
    editor;
    editorOptions = {
        placeholder: '请输入内容...'
    };
    params: Article = {
        title: '',
        content: ''
    };
    url = `admin/article`;

    public get type(): string {
        return this.id === 0 ? 'C' : 'U';
    }

    imageUpload(image, callback) {
        const Imageinput = document.createElement('input');
        Imageinput.setAttribute('type', 'file');
        Imageinput.setAttribute(
            'accept',
            'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
        );
        Imageinput.classList.add('ql-image');

        Imageinput.addEventListener('change', () => {
            const file = Imageinput.files[0];
            if (Imageinput.files != null && Imageinput.files[0] != null) {
                this.uploadServ.upload(file).subscribe((url: string) => {
                    this.pushImageToEditor(url);
                });
            }
        });

        Imageinput.click();
    }

    pushImageToEditor(url) {
        const range = this.editor.getSelection(true);
        const index = range.index + range.length;
        this.editor.insertEmbed(range.index, 'image', url);
    }

    loadData() {
        this.http
            .get<any>(`${this.url}/${this.id}`)
            .toPromise()
            .then(rst => {
                const { title, content } = rst.data;
                this.params.title = title;
                this.params.content = content;
            });
    }

    submit(id) {
        let url;
        let httpType;
        if (this.type === 'C') {
            url = this.url;
            httpType = 'post';
        } else {
            url = `${this.url}/${this.id}`;
            httpType = 'put';
        }
        this.http[httpType](url, this.params).subscribe((rst: any) => {
            if (rst.code === 0) {
                this.messageServ.create('success', '提交成功');
                this.router.navigate(['/article']);
            } else {
                this.messageServ.create('error', rst.msg);
            }
        });
    }

    onEditorBlured(quill) {
        console.log('editor blur!', quill);
    }

    onEditorFocused(quill) {
        console.log('editor focus!', quill);
    }

    onEditorCreated(quill) {
        this.editor = quill;
        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', this.imageUpload.bind(this));
    }

    onContentChanged({ quill, html, text }) {
        // console.log('quill content is changed!', quill, html, text);
    }

    constructor(
        public http: _HttpClient,
        private messageServ: NzMessageService,
        private modalServ: NzModalService,
        private route: ActivatedRoute,
        private router: Router,
        private uploadServ: UploadImageService
    ) {}

    ngOnInit() {
        this.route.params.pipe(map(p => p.id)).subscribe(id => {
            this.id = +id;
            if (this.id > 0) {
                this.loadData();
            }
        });
    }
}
