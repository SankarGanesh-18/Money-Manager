import { Component } from '@angular/core';

import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({

  selector:'app-register',

  standalone:true,

  imports:[
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl:'./register.component.html',

  styleUrl:'./register.component.css'

})

export class RegisterComponent{

  form:FormGroup;

  error='';

  constructor(

    private fb:FormBuilder,

    private auth:AuthService,

    private router:Router

  ){

    this.form=this.fb.group({

      firstName:[
        '',
        Validators.required
      ],

      lastName:[
        '',
        Validators.required
      ],

      phone:[
        '',
        Validators.required
      ],

      email:[
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password:[
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }

  register(){

    if(this.form.invalid){

      return;

    }
    console.log(this.form.value);
    this.auth.register(

      this.form.value

    ).subscribe({

      next:()=>{

        alert(

          'Registration Successful'

        );

        this.router.navigate([

          '/login'

        ]);
        

      },

      error:()=>{

        this.error='Registration Failed';

      }

    });

  }

}