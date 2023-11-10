import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
// import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../../services/core/core.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;
  education: string[] = [
    'Matric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate',
  ];

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    private _coreService: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.empForm = this._fb.group({
      firstName: '',
      lastName: '',
      email: '',
      dob: ['', [Validators.required, this.dobValidator]],
      gender: '',
      education: '',
      company: '',
      experience: '',
      salary: '',
    });
  }


 // Custom DOB validator
 dobValidator(control: AbstractControl): ValidationErrors | null {
  const selectedDate = new Date(control.value);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - selectedDate.getFullYear();

  if (age < 18) {
    return { ageTooYoung: true };
  }

  return null;
}


  ngOnInit(): void {
    this.empForm.patchValue(this.data);
    this._empService.getEmployeeList().subscribe({
      next: (employees) => {
        console.log(employees);
      },
      error: (response) => {
        console.log(response);
        
      }
    });
  }

  onFormSubmit() {
    if (this.empForm.valid) {
      if (this.data) {
        this._empService.updateEmployee(this.data.id, this.empForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee Details Updated!', 'done');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      } else {
        this._empService.addEmployee(this.empForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee added susccessfully', 'done');
            // console.log(val);
            
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }
}

