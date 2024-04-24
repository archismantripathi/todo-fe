import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { uri } from '../config/uri.config';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  uriForUser: string = uri + 'api/user';
  constructor(
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  getName(): Observable<string> {
    return this.http.get(this.uriForUser).pipe(
      map((data: any) => {
        if (data != null) {
          localStorage.setItem('fullName', data.message);
          return data.message;
        } else {
          return null;
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

  login(username: string, password: string): Observable<void> {
    return this.http
      .post<any>(this.uriForUser + '/login', {
        username: username,
        password: password,
      })
      .pipe(
        tap((data: any) => {
          if (data != null) {
            localStorage.setItem('Authorization', data.message);
          }
        }),
        switchMap(() => this.getName()),
        tap((fullName: string) => {
          this.openSnackBar('Welcome, ' + fullName);
        }),
        switchMap(() => {
          return of(undefined);
        }),
        catchError((error: any) => {
          let errorMessage = 'Something went wrong';
          if (error.error && error.error.message) {
            errorMessage = error.error.message.substr(7);
          }
          console.error(errorMessage);
          this.openSnackBar(errorMessage);
          return throwError(() => errorMessage);
        })
      );
  }

  register(username: string, fullName: string, password: string): Observable<void> {
    return this.http
      .post<any>(this.uriForUser, {
        username: username,
        fullName: fullName,
        password: password,
      })
      .pipe(
        tap((data: any) => {
          if (data != null) {
            this.openSnackBar("Registration successful")
            return data;
          }
        }),
        switchMap((data: any) => {
          if (data != null) {
            return this.login(username, password);
          } else {
            return throwError(() => 'Registration failed');
          }
        }),
        catchError((error: any) => {
          let errorMessage = 'Something went wrong';
          if (error.error && error.error.message) {
            errorMessage = error.error.message.substr(7);
          }
          console.error(errorMessage);
          this.openSnackBar(errorMessage);
          return throwError(() => errorMessage);
        })
      );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  openSnackBar(msg: string): void {
    this._snackBar.open(msg, 'Got it!', {
      horizontalPosition: this.horizontalPosition,
    });
  }
}
