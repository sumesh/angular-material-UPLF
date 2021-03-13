import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Role, Serviceline } from '../_models';

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

const servicelinesArr:Serviceline[]=[
    {horzid:8,HorzName:'QEA'},{horzid:85,HorzName:'ADM'},{horzid:25,HorzName:'CIS'},{horzid:88,HorzName:'EAS'},
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