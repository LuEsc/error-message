import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LmnErrorMessageComponent} from '../../../error-message/src/lib/components';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [LmnErrorMessageComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo';
  form!: FormGroup;
  constructor(){
    this.form = new FormGroup<any>(
      {
        email: new FormControl('', [Validators.email, Validators.required, Validators.maxLength(8)]),
        nombre: new FormControl('', Validators.required),
        calle: new FormControl('', Validators.required)
      }
    )
  }
}
