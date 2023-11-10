import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  fgPass!: FormGroup;
  disable: boolean = true;
  emailBool: boolean = false;
  comfirmPasswordMatchBool: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private _snackBar: MatSnackBar
  ) {}

  createFgpForm() {
    this.fgPass = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
          ),
        ],
      ],
      confirmPassword: [''],
    });
  }

  onResetPass() {
    if (this.fgPass.value.password !== this.fgPass.value.confirmPassword) {
      this.comfirmPasswordMatchBool = true;
    } else {
      this.comfirmPasswordMatchBool = false;
    }
    // Rest of your signup logic
    if (!this.comfirmPasswordMatchBool) {
      // Retrieve the existing user data from local storage
      let storedData = localStorage.getItem('Users');
      let users = storedData ? JSON.parse(storedData) : [];
      if (users.length > 0) {
        users.forEach((element: any) => {
          if (element.email == this.fgPass.value.email) {
            element.password = this.fgPass.value.password;
          }
        });
        // users.push(this.fgPass.value);
        localStorage.setItem('Users', JSON.stringify(users));
        // this.addUser(users);
        this.route.navigate(['/signup']);
        this.emailBool = false;
      }
    }
  }

  emailValid() {
    let storedData = localStorage.getItem('Users');
    let users = storedData ? JSON.parse(storedData) : [];
    if (users) {
      var abc = users.filter(
        (val: any) => val.email === this.fgPass.value.email
      );
    }
    if (abc.length != 0) {
      this.disable = false;
    } else {
      alert("Email is invalid or Account doesn't exist on this email.");
    }
  }
  confirmToSend() {
    if (this.fgPass.valid) {
      this.disable = false;
      console.log(this.fgPass.value);
    } else {
      this.disable = true;
    }
  }

  openSnackBar() {
    this._snackBar.open('Reset link has been sent to your email', 'Done', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  onfgPass() {}

  // passwordMatch() {
  //   if (
  //     this.fgPass.value.password != '' &&
  //     this.fgPass.value.confirmPassword != ''
  //   ) {
  //     if (
  //       this.fgPass.value.password != this.fgPass.value.confirmPassword
  //     ) {
  //       this.comfirmPasswordMatchBool = true;
  //     } else {
  //       this.comfirmPasswordMatchBool = false;
  //     }
  //   }
  // }

  get l() {
    return this.fgPass.controls;
  }

  ngOnInit(): void {
    this.createFgpForm();
  }
}
// export class SnackBarPositionExample {
//   horizontalPosition: MatSnackBarHorizontalPosition = 'start';
//   verticalPosition: MatSnackBarVerticalPosition = 'bottom';

//   constructor(private _snackBar: MatSnackBar) {}

// }
