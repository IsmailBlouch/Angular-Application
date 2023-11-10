import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';



@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit{
  cpForm!: FormGroup;
  disable: boolean=true;
  passBool: boolean = false;
  comfirmPasswordMatchBool: boolean=false;
  horizontalPosition: MatSnackBarHorizontalPosition='center';
  verticalPosition: MatSnackBarVerticalPosition='top';

constructor(
  private _fb: FormBuilder,
  private route: Router, 
  private _snackBar: MatSnackBar,
  private _dialogRef: MatDialogRef<ChangePasswordComponent>,
  private _dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any
){ }


craeteCPForm(){
  this.cpForm = this._fb.group({
  currentPassword: ['', [Validators.required]],
  newPassword: ['', [Validators.required,Validators.minLength(8),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
  confirmPassword: ['', [Validators.required]],
})
}



passwordMatch() {
  if (
    this.cpForm.value.newPassword != '' &&
    this.cpForm.value.confirmPassword != ''
  ) {
    if (
      this.cpForm.value.newPassword != this.cpForm.value.confirmPassword
    ) {
      this.comfirmPasswordMatchBool = true;
    } else {
      this.comfirmPasswordMatchBool = false;
    }
  }
}



openSnackBar() {
  this._snackBar.open('Password Updated Successfully!', 'Done', {
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
  });
}



get l() {
  return this.cpForm.controls;
}

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
this.craeteCPForm();
}


currentPassValid(){
  let storedData = localStorage.getItem('Users');
  let users = storedData ? JSON.parse(storedData) : [];
  if (users) {
    var abc = users.filter(
      (val: any) =>
        val.password === this.cpForm.value.currentPassword
    );
  }
  if (abc.length != 0) {
    this.disable=false;
  } else {
    alert("Enter a correct current Password.");
  }

}



onUpdatePassword(){
  
  if (
    this.cpForm.value.newPassword !== this.cpForm.value.confirmPassword
  ) {
    this.comfirmPasswordMatchBool = true;
  } else {
    this.comfirmPasswordMatchBool = false;
  }
  // Rest of your signup logic
  if (!this.comfirmPasswordMatchBool) {
    // Retrieve the existing user data from local storage
    let storedData = localStorage.getItem('Users');
    let users = storedData ? JSON.parse(storedData) : [];
if(users.length > 0){
      users.forEach((element:any) => {
        if(element.password == this.cpForm.value.currentPassword){
          element.password = this.cpForm.value.newPassword
        }
      });
      // users.push(this.cpForm.value);
      localStorage.setItem('Users', JSON.stringify(users));
      // this.addUser(users);
      // this.cpForm.reset();
       this._dialog.closeAll();
      this.route.navigate(['/signup']);
      this.passBool = false;
    }
  }
}

}
