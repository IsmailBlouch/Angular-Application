import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
// import { LoginService } from '../../login/login.service';
// import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})

export class SignupComponent implements OnInit {
  private baseUrl: string= "https://localhost:7091/api/User/";

  type: string= 'password';
  isText: boolean= false;
  eyeIcon:string='fa-eye-slash';

  show= false;
  user: any = [];
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  emailBool: boolean = false;
  comfirmPasswordMatchBool: boolean = false;
  public showPassword!: boolean;
  public showPasswordOnPress!: boolean;


  constructor(private route: Router, private fb: FormBuilder,private authService:AuthService, private http: HttpClient) {}

  signupUsers: any[] = [];

  ngOnInit(): void {
    this.createSignForm();
    this.createLoginForm();
    if(this.authService.isLoggedIn()){
      this.route.navigate(['main']);
    }
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
    this.isText ? this.type = 'text' : this.type = 'password';
  }


  createSignForm() {
    this.signupForm = this.fb.group({
      userName: [null, [Validators.required, Validators.maxLength(30)]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      password: ['', [Validators.required,Validators.minLength(8),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      confirmPassword: [''],
    });
  }

  passwordMatch() {
    if (
      this.signupForm.value.password != '' &&
      this.signupForm.value.confirmPassword != ''
    ) {
      if (
        this.signupForm.value.password != this.signupForm.value.confirmPassword
      ) {
        this.comfirmPasswordMatchBool = true;
      } else {
        this.comfirmPasswordMatchBool = false;
      }
    }
  }

   

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  get f() {
    return this.signupForm.controls;
  }
  
  onSignUp() {
    if (
      this.signupForm.value.password !== this.signupForm.value.confirmPassword
    ) {
      this.comfirmPasswordMatchBool = true;
      alert("Invalid Form");
     }
      else {
      this.comfirmPasswordMatchBool = false;
      if (this.signupForm.valid) {
      
        this.authService.signUp(this.signupForm.value)
          .subscribe({
            next: (res) => {
              alert(res.message)
              // console.log(res);
              this.signupForm.reset();
              // this.displaySuccessMessage(res.message);
            },
            error: (err) => {
              // console.log(err);
              alert(err.error.message)
              // this.displayErrorMessage(err);
            },
          });
  
    } 
  
      }}
   


  addUser(user: any) {
    let users: any[] = [];
    if (localStorage.getItem('Users')) {
      // const obj = localStorage.getItem('Users');
      users = JSON.parse(localStorage.getItem('Users') as string);
      users = [user, ...users];
    } else {
      users = [user];
    }
    localStorage.setItem('Users', JSON.stringify(users));
  }




  onLogin() {
    // let storedData = localStorage.getItem('Users');
    this.authService.login(this.loginForm.value)
    .subscribe({
      next: (res) => {
        alert(res.message)
        this.authService.setToken('abcdefghijklmnopqrstuvwxyz');

        this.route.navigate(['/main']);
    // let users = storedData ? JSON.parse(storedData) : [];
    // if (users) {
    //   var abc = users.filter(
    //     (val: any) =>
    //       val.email === this.loginForm.value.email &&
    //       val.password === this.loginForm.value.password
    //   );
    // }
    // if (abc.length != 0) {
    //   this.authService.setToken('abcdefghijklmnopqrstuvwxyz');

    //   this.route.navigate(['/main']);
    // } else {
    //   alert('Wrong Credentials!');
    // }
  },
  error: (err)=>{
    alert(err?.error.message)
  }
});
  }

  get l() {
    return this.loginForm.controls;
  }
}
