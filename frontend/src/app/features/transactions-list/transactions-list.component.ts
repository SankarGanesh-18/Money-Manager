import {

  Component,

  OnInit,

  computed,

  signal,

  effect

} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';

import { TransactionService } from '../../core/services/transaction.service';

import { CATEGORIES } from '../../core/constants/categories';

@Component({

  selector:'app-transactions-list',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    RouterLink

  ],

  templateUrl:'./transactions-list.component.html',

  styleUrl:'./transactions-list.component.css'

})

export class TransactionsListComponent implements OnInit{

  constructor(

    public transactionService:TransactionService

  ){

    effect(()=>{

      this.transactionService.getTransactions({

        q:this.search(),

        category:this.category(),

        type:this.type()

      });

    });

  }

  search = signal('');

  category = signal('');

  type = signal('');

  categories = CATEGORIES;

  transactions = computed(

    ()=>this.transactionService.transactions()

  );

  ngOnInit(){

    this.transactionService.getTransactions();

  }

  delete(id:string){

    if(!confirm(

      'Delete Transaction?'

    )){

      return;

    }

    this.transactionService

    .deleteTransaction(id)

    .subscribe({

      error:(err)=>{

        console.error(err);

      }

    });

  }

}