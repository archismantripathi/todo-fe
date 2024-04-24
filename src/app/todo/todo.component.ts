import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '../services/user.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';
import { TodoService } from '../services/todo.service';
import { Todo } from '../services/model/todo.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TextFieldModule,
    MatMenuModule,
    RouterLink,
    NgClass,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit, OnDestroy {
  dateText = signal('--');
  nameText = signal('--');
  todoList = signal<Todo[]>([]);
  intervalId: any = 0;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';

  constructor(
    private userService: UserService,
    private todoService: TodoService,
    private _snackBar: MatSnackBar
  ) {}

  async updateDate() {
    let currentDate = new Date();

    this.dateText.set(
      currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    );
  }

  newTodo(todo: string): void {
    if(todo && todo.length == 0) return;

    this.todoService.newTodo("content").subscribe((success: boolean) => {
      if(success) {
        this.todoList.set([{content: todo, checked: false},...this.todoList()]);
      }
    });
  }

  updateTodo(): void {
    throw new Error('Method not implemented.');
  }

  logout(): void {
    this.userService.logout();
    this.openSnackBar('Logout Successful!');
  }

  clearTodo(): void {
    this.todoService.clearTodo().subscribe((success: boolean) => {
      if(success) {
        this.todoList.set([]);
      }
    });
  }

  editPassword(): void {
    throw new Error('Method not implemented.');
  }

  editName(): void {
    throw new Error('Method not implemented.');
  }

  deleteUser(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.todoService.getTodoList().subscribe((todoList: Todo[]) => {
      this.todoList.set(todoList);
    });

    const fullName = localStorage.getItem('fullName');
    if (fullName) this.nameText.set(fullName);

    this.userService.getName().subscribe((fullName: string) => {
      if (fullName) this.nameText.set(fullName);
    });

    this.updateDate();

    this.intervalId = setInterval(() => {
      this.updateDate();
    }, 900000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.intervalId);
  }

  openSnackBar(msg: string): void {
    this._snackBar.open(msg, 'Got it!', {
      horizontalPosition: this.horizontalPosition,
    });
  }
}
