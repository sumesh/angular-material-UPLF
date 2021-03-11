import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 
  loading = false;
  submitted = false;
  returnUrl?: string;
  error = '';

  constructor( 
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
) { 
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) { 
        this.router.navigate(['/']);
    }
}


  ngOnInit() {
     // get return url from route parameters or default to '/'
     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  onLogin() {
    //localStorage.setItem('isLoggedin', 'true');
    //this.router.navigate(['/dashboard']);

    this.authenticationService.login('admin','admin')
    .pipe(first())
    .subscribe(
        data => {
          console.log(data);
            this.router.navigate([this.returnUrl]);
        },
        error => {
           console.log(error);
        });
  }
}
