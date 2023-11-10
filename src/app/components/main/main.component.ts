import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogRef } from '@angular/cdk/dialog';
import { EmpAddEditComponent } from '../emp-add-edit/emp-add-edit.component';
import { CoreService } from '../../services/core/core.service';
import { EmployeeService } from '../../services/employee.service';
import { LoginComponent } from '../login/login.component';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  router = inject(Router)
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'dob',
    'gender',
    'education',
    'company',
    'experience',
    'salary',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _empService: EmployeeService,
    private _coreService:CoreService,
  ) {}
  ngOnInit(): void {
    this.getEmployeeList();
  }

  openAddEditForm(type:string) {
    if(type == 'addEmploye'){
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }else{
    const dialogRef = this._dialog.open(ChangePasswordComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }
  }
  openLoginForm(){
    const dialogRef= this._dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) =>{
        if(val){
          this. getEmployeeList();
        }
      }
    })
  }

  getEmployeeList() { 
    this._empService.getEmployeeList().subscribe({
      next: (res:any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteEmployee(id: number) {
    this._empService.deleteEmployee(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Employee Deleted', 'done');
        this.getEmployeeList();
      },
      error: console.log,
    });
  }

  openEditForm(data: any) {
    const dialogRef= this._dialog.open(EmpAddEditComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }
  LogOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/signup'])
    
  }
}
