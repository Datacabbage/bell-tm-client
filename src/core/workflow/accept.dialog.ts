import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { BaseDialog } from '../dialogs';
import { Http } from '../rest';

/**
 * options: {whoUrl: string, does: string, what: string}
 */
@Component({
    templateUrl: 'accept.dialog.html',
})
export class WorkflowAcceptDialog extends BaseDialog {
    result: { what: string, to: string, comment: string };

    constructor(private http: Http) {
        super();
        this.result = { what: null, to: null, comment: null };
    }

    protected onOpening(): Observable<any> {
        this.result.what = this.options.what;
        if (this.options.whoUrl) {
            return this.http.get(this.options.whoUrl).pipe(tap((value: any[]) => {
                if (value.length >= 1) {
                    this.result.to = value[0].id;
                }
            }));
        } else {
            return null;
        }
    }

    protected onConfirmed(): any {
        return this.result;
    }
}