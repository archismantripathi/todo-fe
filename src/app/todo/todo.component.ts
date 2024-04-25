import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import {
  Dialog,
  DialogRef,
  DIALOG_DATA,
  DialogModule,
} from '@angular/cdk/dialog';
import { UserService } from '../services/user.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';
import { TodoService } from '../services/todo.service';
import { Todo } from '../services/model/todo.model';
import { NgClass } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';

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
    DialogModule,
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
    private formBuilder: FormBuilder,
    public dialog: Dialog
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
    todo: ['', [Validators.required]],
  });
  get form() {
    return this.todoForm.controls;
  }

  onSubmit(): void {
    const todo = this.form.todo.value;
    if (!todo || todo.length == 0) return;

    this.todoService.newTodo(todo).subscribe((success: boolean) => {
      if (success) {
        this.todoList.set([
          { content: todo, checked: false },
          ...this.todoList(),
        ]);
        this.form.todo.reset();
      }
    });
  }

  updateTodo(index: number, content: string, checked: boolean): void {
    if (content.length == 0) return;
    this.todoService
      .updateTodo(index, content, checked)
      .subscribe((success: boolean) => {
        let newTodoList: Todo[] = [...this.todoList()];
        newTodoList[index] = { content, checked };
        if (success) this.todoList.set(newTodoList);
      });
  }

  logout(): void {
    this.userService.logout();
    this.openSnackBar('Logout Successful!');
  }

  clearTodo(): void {
    const dialogRef = this.dialog.open<boolean>(ConfirmDialog, {
      data: 'Your todo list will be cleared.',
      backdropClass:'dialog-backdrop'
    });

    dialogRef.closed.subscribe((confirm) => {
      if (confirm)
        this.todoService.clearTodo().subscribe((success: boolean) => {
          if (success) {
            this.todoList.set([]);
          }
        });
    });
  }

  manageAccount(): void {
    const dialogRef = this.dialog.open<void>(ManageAccountDialog, {backdropClass:'dialog-backdrop'});
    dialogRef.closed.subscribe(() => {
      const fullName = localStorage.getItem('fullName');
      if (fullName) this.nameText.set(fullName);
    });
    this.openSnackBar('Feature is not implemented');
  }

  deleteUser(): void {
    const dialogRef = this.dialog.open<boolean>(ConfirmDialog, {
      data: "Your account and all it's data will be permanently deleted.",
      backdropClass:'dialog-backdrop'
    });

    dialogRef.closed.subscribe((confirm) => {
      if (confirm) this.userService.deleteUser().subscribe();
    });
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

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog/confirm.dialog.html',
  styleUrl: './confirm-dialog/confirm.dialog.scss',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatIconModule, MatRippleModule],
})
export class ConfirmDialog {
  constructor(
    public dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public data: string
  ) {}
}

@Component({
  selector: 'manage-account-dialog',
  templateUrl: './manage-account-dialog/manage-account.dialog.html',
  styleUrl: './manage-account-dialog/manage-account.dialog.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ManageAccountDialog {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  constructor(
    public dialogRef: DialogRef<boolean>,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  nameForm = this.formBuilder.group({
    name: ['', [Validators.required]],
  });
  get form() {
    return this.nameForm.controls;
  }

  onUpdateName(): void {}

  onUpdatePassword(): void {}

  updateAccount(): void {}

  openSnackBar(msg: string): void {
    this._snackBar.open(msg, 'Got it!', {
      horizontalPosition: this.horizontalPosition,
    });
  }
}
