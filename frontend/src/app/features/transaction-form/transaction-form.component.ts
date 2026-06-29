import { Component, OnInit } from '@angular/core';

import {

  ReactiveFormsModule,

  FormBuilder,

  Validators,

  FormGroup

} from '@angular/forms';

import { CommonModule } from '@angular/common';

import {

  ActivatedRoute,

  Router,

  RouterLink

} from '@angular/router';

import { TransactionService } from '../../core/services/transaction.service';

import { CATEGORIES } from '../../core/constants/categories';

@Component({

  selector:'app-transaction-form',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    RouterLink

  ],

  templateUrl:'./transaction-form.component.html',

  styleUrl:'./transaction-form.component.css'

})

export class TransactionFormComponent implements OnInit{

  form:FormGroup;

  categories=CATEGORIES;

  editId='';

  constructor(

    private fb:FormBuilder,

    private service:TransactionService,

    private route:ActivatedRoute,

    private router:Router

  ){

    this.form=this.fb.group({

      type:[

        'expense',

        Validators.required

      ],

      amount:[

        '',

        Validators.required

      ],

      category:[

        '',

        Validators.required

      ],

      description:[

        ''

      ],

      date:[

        '',

        Validators.required

      ]

    });

  }

  ngOnInit(){

    this.editId =

    this.route.snapshot.paramMap.get('id') || '';

    if(this.editId){

      const transaction =

      this.service.transactions()

      .find(

        t => t._id === this.editId

      );

      if(transaction){

        this.form.patchValue({

          type: transaction.type,

          amount: transaction.amount,

          category: transaction.category,

          description: transaction.description,

          date: transaction.date.substring(0,10)

        });

      }

    }

  }

  save(){

    if(this.form.invalid){

      return;

    }

    const request = this.editId

      ? this.service.updateTransaction(

          this.editId,

          this.form.value

        )

      : this.service.addTransaction(

          this.form.value

        );

    request.subscribe({

      next: () => {

        this.router.navigate([

          '/transactions'

        ]);

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

}