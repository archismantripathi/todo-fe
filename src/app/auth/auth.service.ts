import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { uri } from '../config/uri.config';
import { Observable, Subscription, catchError, map, throwError } from 'rxjs';
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
    return this.http.get(this.uriForUser)
      .pipe(
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
      .post<string>(this.uriForUser + '/login', {
        username: username,
        password: password,
      })
      .pipe(
        map((data: any) => {
          if (data != null) {
            localStorage.setItem('Authorization', data.message);
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
      )
      .pipe(
        map((success: boolean) => {
          if(success)
            this.getName().subscribe({
              next: (fullName: string)=>{
                this.openSnackBar('Welcome, ' + fullName);
                this.router.navigate(['/todo']);
              },
              error: (errorMessage: string) => {
                this.openSnackBar(errorMessage);
              }
            });
          else this.openSnackBar("Something went wrong");
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

  register(username: string, fullName: string, password: string): Observable<void> {
    return this.http
      .post<string>(this.uriForUser, {
        username: username,
        fullName: fullName,
        password: password,
      })
      .pipe(
        map((data: any) => {
          if (data != null) {
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
      )
      .pipe({
        next: (success: boolean) => {
          if(success)
            this.login(username,password);
          else this.openSnackBar("Something went wrong");
        },
        error: (errorMessage: string) => {
          this.openSnackBar(errorMessage);
        },
      });
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

  openSnackBar(msg: string): void {
    this._snackBar.open(msg, 'Got it!', {
      horizontalPosition: this.horizontalPosition,
    });
  }
}
