import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'angular-test';
  submitted = false;
  working = false;
  complete = false;
  strongPassword = false; 

  passwordForm = new FormGroup({
    password: new FormControl(null, [
      Validators.minLength(8),
      Validators.required,
    ]),
  });

  get f() {
    return this.passwordForm.controls;
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  onSubmit() {
    this.submitted = true;

    if (this.passwordForm.invalid) {
      return;
    }

    this.working = true;
    setTimeout(() => {
      this.passwordForm.reset();
      this.working = false;
      this.complete = true;
    }, 1000);
  }
}
