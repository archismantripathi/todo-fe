import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { uri } from '../config/uri.config';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private uriForUser: string = uri + 'api/user';
  constructor(
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  getName(): Observable<string> {
    return this.http.get(this.uriForUser).pipe(
      map((data: any) => {
        if (data != null) {
          localStorage.setItem('fullName', data.message.fullName);
          return data.message.fullName;
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

  updateUser(
    fullName: string,
    oldPassword: string,
    newPassword: string
  ): Observable<{fullName: boolean, password: boolean}> {
    let req: {
      fullName?: string;
      oldPassword?: string;
      newPassword?: string;
    } = {};

    if (!(fullName||newPassword)) throw new Error("Can not update");
    if (fullName) req.fullName = fullName;
    if (newPassword && oldPassword) {
      req.oldPassword = oldPassword;
      req.newPassword = newPassword;
    }
    return this.http
      .put(this.uriForUser, req)
      .pipe(
        map((data: any) => {
          if (data != null) {
            if (data.message.fullName)
              localStorage.setItem('fullName', fullName);
            else if (!data.message.password) {
              this.openSnackBar('Wrong password');
            }
          }
          return data.message;
        }),
        catchError((error: any) => {
          let errorMessage = 'Something went wrong';
          if (error.error && error.error.message) {
            errorMessage = error.error.message.substr(7);
          }
          this.openSnackBar(errorMessage);
          console.log(errorMessage);
          return throwError(() => errorMessage);
        })
      );
  }

  deleteUser(): Observable<boolean> {
    return this.http.delete(this.uriForUser).pipe(
      map((data: any) => {
        if (data != null) {
          this.openSnackBar('Account deleted from the server');
          this.logout();
          return true;
        }
        return false;
      }),
      catchError((error: any) => {
        let errorMessage = 'Something went wrong';
        if (error.error && error.error.message) {
          errorMessage = error.error.message.substr(7);
        }
        this.openSnackBar(errorMessage);
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
          this.router.navigate(['todo']);
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

  register(
    username: string,
    fullName: string,
    password: string
  ): Observable<void> {
    return this.http
      .post<any>(this.uriForUser, {
        username: username,
        fullName: fullName,
        password: password,
      })
      .pipe(
        tap((data: any) => {
          if (data != null) {
            this.openSnackBar('Registration successful');
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
