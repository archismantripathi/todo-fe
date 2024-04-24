import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { uri } from '../config/uri.config';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<string>(uri + 'api/user/login', {
        username: username,
        password: password,
      })
      .pipe(
        map((data: any) => {
          if (data != null) {
            localStorage.setItem('Authorization', data.message);
            this.router.navigate(['/todo']);
            return true;
          } else {
            return false;
          }
        }),
        catchError((error: any) => {
          let errorMessage = 'Something went wrong';
          if (error.error && error.error.message) {
            errorMessage = error.error.message.substr(7);
          }
          console.log(errorMessage);
          return throwError(() => errorMessage);
        })
      );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuth(): boolean {
    if (localStorage.getItem('Authorization')) {
      return true;
    } else {
      return false;
    }
  }
}
