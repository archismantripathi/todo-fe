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
import { FormsModule, ReactiveFormsModule,FormBuilder, Validators } from '@angular/forms';

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
    FormsModule,
    ReactiveFormsModule,
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
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
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

  todoForm = this.formBuilder.group({
    todo: ['', [
      Validators.required,
    ]]
  });
  get form() { return this.todoForm.controls; };

  onSubmit(): void {
    if(this.form.todo.value)
      this.newTodo(this.form.todo.value);
    return;
  }

  newTodo(todo: string): void {
    if(todo.length == 0) return;

    this.todoService.newTodo(todo).subscribe((success: boolean) => {
      if(success) {
        this.todoList.set([{content: todo, checked: false},...this.todoList()]);
      }
    });
  }

  updateTodo(index: number, content: string, checked: boolean): void {
    if(content.length==0) return;
    this.todoService.updateTodo(index, content, checked).subscribe((success: boolean) => {
      let newTodoList: Todo[] = [...this.todoList()];
      newTodoList[index] = {content, checked}
      if(success)
        this.todoList.set(newTodoList);
    });
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
    this.openSnackBar('Method not implemented.');
  }

  editName(): void {
    this.openSnackBar('Method not implemented.');
  }

  deleteUser(): void {
    this.userService.deleteUser().subscribe();
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
