import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Role, Serviceline, MasterDropdown } from '../_models';
import { PlSummary } from '../models';

const users: User[] = [
    {
        id: 147852, username: '147852', firstName: 'Admin', role:
            Role.Admin,
        roles: [
            { roleid: 'RH001', rolename: 'Account Manager', roletype: 'VT' },
            { roleid: 'RH002', rolename: 'SLM', roletype: 'HZ' }
        ]
    },
    {
        id: 369852, username: '369852', firstName: 'RHMS', role: Role.Admin,
        roles: [
            { roleid: 'RH003', rolename: 'Delivery Patner', roletype: 'VT' },
            { roleid: 'RH002', rolename: 'SLM', roletype: 'VT' }
        ]
    }
];

const servicelinesArr: Serviceline[] = [
    { horzid: 8, HorzName: 'QEA' }, { horzid: 85, HorzName: 'ADM' }, { horzid: 25, HorzName: 'CIS' }, { horzid: 88, HorzName: 'EAS' },
];

const pnlSummarylist: PlSummary[] = [
    {

        head: 'Total FY 2021 (A+B)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
    },
    {

        head: 'YTD Actuals (A)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
    },
    {

        head: 'Forecast (C+D)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
    },
    {

        head: 'System Predictoin (C)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
    },
    {

        head: 'Adjustment (DB)',
        showcap: true,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: 'green' }, { desc: 'Cost $', value: 11986545123.32, status: 'amber' }, { desc: 'CP %', value: 23.32, status: '' }],
        cap: [{ desc: 'Revenue', value: 30.32 }, { desc: 'Cost', value: 25.32 }]
    }
];

const ddlBucketType: MasterDropdown[] = [
    { id: '1', value: 'Most Likely ( ML+BL)', isdefault: true },
    { id: '2', value: 'Backlog (BL)', isdefault: false },
    { id: '3', value: 'upside (UP)', isdefault: false },
];

const pnlgridDatamaster = {
    filtertype: [
        { id: '1', value: 'Default', isdefault: true },
        { id: '2', value: 'Monthly', isdefault: false },
        { id: '3', value: 'Quarterly', isdefault: false },
    ],
    year: [
        { id: '2020', value: '2020', isdefault: false },
        { id: '2021', value: '2021', isdefault: true },
        { id: '2022', value: '2022', isdefault: false },
    ],
    fx: [
        { id: '1', value: 'Costant', isdefault: true },
        { id: '2', value: 'Reported', isdefault: false }
    ],
    dol: [
        { id: '1000', value: '$K', isdefault: true },
        { id: '1000000', value: 'Mn', isdefault: false },
        { id: '100000000', value: 'Bn', isdefault: false },
    ],
    header: [
        { PeriodID: 0, PeriodType: 'YTD', PeriodName: 'YTD 2021', Show: true },
        { PeriodID: 1, PeriodType: 'M', PeriodName: 'Jan 2021', Show: true },
        { PeriodID: 2, PeriodType: 'M', PeriodName: 'Feb 2021', Show: true },
        { PeriodID: 3, PeriodType: 'M', PeriodName: 'Mar 2021', Show: true },
        { PeriodID: 4, PeriodType: 'M', PeriodName: 'Apr 2021', Show: true },
        { PeriodID: 5, PeriodType: 'M', PeriodName: 'May 2021', Show: true },
        { PeriodID: 6, PeriodType: 'M', PeriodName: 'Jun 2021', Show: true },
        { PeriodID: 7, PeriodType: 'M', PeriodName: 'Jul 2021', Show: false },
        { PeriodID: 8, PeriodType: 'M', PeriodName: 'Aug 2021', Show: false },
        { PeriodID: 9, PeriodType: 'M', PeriodName: 'Sep 2021', Show: false },
        { PeriodID: 10, PeriodType: 'M', PeriodName: 'Oct 2021', Show: false },
        { PeriodID: 11, PeriodType: 'M', PeriodName: 'Nov 2021', Show: false },
        { PeriodID: 12, PeriodType: 'M', PeriodName: 'Dec 2021', Show: false },
        { PeriodID: -1, PeriodType: 'FY', PeriodName: 'FY 2021', Show: true }
    ],
    desc: [
        { DescID: 1, Desc: 'Forecast', Type: 'H', Format: '' },
        { DescID: 2, Desc: 'Rev $', Type: 'D', Format: '$' },
        { DescID: 3, Desc: 'Cost $', Type: 'D', Format: '$' },
        { DescID: 4, Desc: 'CP %', Type: 'D', Format: '%' },
        { DescID: 5, Desc: 'Adjustment', Type: 'H', Format: '' },
        { DescID: 6, Desc: 'Rev $', Type: 'D', Format: '$' },
        { DescID: 7, Desc: 'Cost $', Type: 'D', Format: '$' },
        { DescID: 8, Desc: 'CP %', Type: 'D', Format: '%' }
    ]
};

const tgridableData = [
    { DescID: 2, Data: [{ PeriodID: 0, Value: 1234678.2563 }, { PeriodID: 1, Value: 1234678.2563 }, { PeriodID: 2, Value: 1234678.2563 }, { PeriodID: 5, Value: 1234678.2563 }, { PeriodID: -1, Value: 1234678.2563 }] },
    { DescID: 3, Data: [{ PeriodID: 0, Value: 1234678.2563 }, { PeriodID: 1, Value: 1234678.2563 }, { PeriodID: 2, Value: 1234678.2563 }, { PeriodID: 5, Value: 1234678.2563 }] },
    { DescID: 4, Data: [{ PeriodID: 0, Value: .2563343 }, { PeriodID: 1, Value: .32563343 }, { PeriodID: 2, Value: .52563343 }, { PeriodID: 6, Value: .62563343 }] },
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/roles') && method === 'GET':
                    return userroles();
                case url.endsWith('/master/serviceline') && method === 'GET':
                    return servicelines();
                case url.endsWith('/pandl/summary') && method === 'POST':
                    return getPandlSummary();
                case url.endsWith('/master/buckettype') && method === 'POST':
                    return getMasterBucketType();
                case url.endsWith('/pandl/gridmaster') && method === 'POST':
                    return getGridmaster();
                case url.endsWith('/pandl/griddata') && method === 'POST':
                    return getGridData();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }

        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');

            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: `fake-jwt-token.${user.id}`
            });
        }

        function userroles() {
            if (!isLoggedIn()) return unauthorized();

            // only admins can access other user records
            if (!isAdmin() && currentUser()?.id !== idFromUrl()) return unauthorized();

            const user = users.find(x => x.id === currentUser()?.id);
            return ok(user?.roles);
        }

        function servicelines() {
            if (!isLoggedIn()) return unauthorized();
            return ok(servicelinesArr);
        }

        function getPandlSummary() {
            if (!isLoggedIn()) return unauthorized();
            return ok(pnlSummarylist);
        }

        function getMasterBucketType() {
            if (!isLoggedIn()) return unauthorized();
            return ok(ddlBucketType);
        }

        function getGridmaster() {
            if (!isLoggedIn()) return unauthorized();
            return ok(pnlgridDatamaster);
        }

        function getGridData() {
            if (!isLoggedIn()) return unauthorized();
            return ok(tgridableData);
        }

        function getUsers() {
            if (!isAdmin()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            // only admins can access other user records
            if (!isAdmin() && currentUser()?.id !== idFromUrl()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(JSON.stringify(users));
        }

        // helper functions

        function ok(body: any) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } });
        }

        function error(message: string) {
            return throwError({ status: 400, error: { message } });
        }

        function isLoggedIn() {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer fake-jwt-token');
        }

        function isAdmin() {
            return isLoggedIn() && currentUser()?.role === Role.Admin;
        }

        function currentUser() {
            if (!isLoggedIn()) return;
            const id = parseInt((headers.get('Authorization') || '').split('.')[1]);
            return users.find(x => x.id === id);
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};