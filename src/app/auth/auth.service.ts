import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { uri } from '../config/uri.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): boolean {
    let noErr: boolean = false
    this.http
      .post<string>(uri + 'api/user/login', {
        username: username,
        password: password,
      })
      .subscribe((data: any) => {
        if (data != null) {
          localStorage.setItem('Authorization', data.token);
          this.router.navigate(['/todo']);
          noErr=true;
        }
      });
    return noErr;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuth() {
    if (localStorage.getItem('Authorization')) {
      return true;
    } else {
      return false;
    }
  }
}
