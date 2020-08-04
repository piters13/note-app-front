import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CustomValidator } from '../utils/custom-validators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public router: Router,
    public userService: UserService) {
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: CustomValidator('password', 'confirmPassword')
    });
  }

  register(){
    if (this.registerForm.valid) {
      this.http.post('http://localhost:8080/register', this.registerForm.value).subscribe(() => {
        this.snackBar.open('Registered successfully', '', {
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.router.navigate(['/login']);
      });
    }
  }

}
