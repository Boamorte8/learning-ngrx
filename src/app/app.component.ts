import {Component, OnInit} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import { logout, login } from './auth/auth.actions';
import { isLoggedIn } from './auth/auth.selectors';
import { AppState } from './reducers/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    loading = true;
    isLoggedIn$: Observable<boolean>;

    constructor(private router: Router, private store: Store<AppState>) {

    }

    ngOnInit() {

      const userProfile = localStorage.getItem('user');

      if (userProfile) {
        this.store.dispatch(login({user: JSON.parse(userProfile)}));
      }

      this.router.events.subscribe(event  => {
        switch (true) {
          case event instanceof NavigationStart: {
            this.loading = true;
            break;
          }

          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            this.loading = false;
            break;
          }
          default: {
            break;
          }
        }
      });

      this.isLoggedIn$ = this.store.pipe(select(isLoggedIn));
    }

    logout() {
      this.store.dispatch(logout());
    }

}
