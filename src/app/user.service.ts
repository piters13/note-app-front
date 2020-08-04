import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: string;
  login: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(public http: HttpClient, public router: Router) { }

  authenticate(username, password) {
    return this.http.post<any>('http://localhost:8080/authenticate', {username, password}).pipe(
     map(
       userData => {
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('token', userData.jwt);
        return userData;
       }
     )
    );
  }

  isUserLoggedIn() {
    const username = sessionStorage.getItem('username');
    return !(username === null);
  }

  logout() {
    sessionStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
