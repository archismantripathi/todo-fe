import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { uri } from '../config/uri.config';
import { Todo } from './model/todo.model';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  uriForTodo: string = uri + 'api/todo';
  constructor(
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  getTodoList(): Observable<Todo[]> {
    return this.http.get(this.uriForTodo).pipe(
      map((data: any) => {
        let todoList: Todo[] = [];
        if (data.message.todoList) todoList = data.message.todoList;
        return todoList;
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

  newTodo(content: string, checked: boolean = false): Observable<boolean> {
    return this.http.post(this.uriForTodo, { content, checked }).pipe(
      map((data: any) => {
        if (data != null) {
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

  updateTodo(
    index: number,
    content: string,
    checked: boolean
  ): Observable<boolean> {
    return this.http.put(this.uriForTodo, { index, content, checked }).pipe(
      map((data: any) => {
        if (data != null) {
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

  clearTodo(): Observable<boolean> {
    return this.http.delete(this.uriForTodo).pipe(
      map((data: any) => {
        if (data != null) {
          this.openSnackBar('Todo list cleared');
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

  openSnackBar(msg: string): void {
    this._snackBar.open(msg, 'Got it!', {
      horizontalPosition: this.horizontalPosition,
    });
  }
}
