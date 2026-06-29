import {
  Component,
  OnInit,
  computed,
  AfterViewInit,
  effect
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { TransactionService } from '../../core/services/transaction.service';

import { ReminderComponent } from '../reminders/reminder.component';

import {
  Chart,
  PieController,
  ArcElement,
  Legend,
  Tooltip
} from 'chart.js';

Chart.register(
  PieController,
  ArcElement,
  Legend,
  Tooltip
);

@Component({

  selector:'app-dashboard',

  standalone:true,

  imports:[
    CommonModule,
    ReminderComponent
  ],

  templateUrl:'./dashboard.component.html',

  styleUrl:'./dashboard.component.css'

})

export class DashboardComponent
implements OnInit, AfterViewInit{

  chart!: Chart;

  constructor(

    public transactionService: TransactionService

  ){

    effect(()=>{

      if(this.chart){

        this.loadChart();

      }

    });

  }

  transactions = computed(

    ()=>this.transactionService.transactions()

  );

  totalIncome = computed(()=>{

    return this.transactions()

    .filter(

      t=>t.type==='income'

    )

    .reduce(

      (sum,t)=>sum+t.amount,

      0

    );

  });

  totalExpense = computed(()=>{

    return this.transactions()

    .filter(

      t=>t.type==='expense'

    )

    .reduce(

      (sum,t)=>sum+t.amount,

      0

    );

  });

  balance = computed(()=>{

    return this.totalIncome()

    -

    this.totalExpense();

  });

  ngOnInit(){

    this.transactionService.getTransactions();

  }

  ngAfterViewInit(){

    setTimeout(()=>{

      this.createChart();

    },300);

  }

  createChart(){

    const canvas =

    document.getElementById(

      'expenseChart'

    ) as HTMLCanvasElement;

    this.chart =

    new Chart(canvas,{

      type:'pie',

      data:{

        labels:[],

        datasets:[

          {

            data:[],

            backgroundColor:[],

            hoverBackgroundColor:[],

            borderColor:'#ffffff',

            borderWidth:3,

            hoverBorderColor:'#ffffff',

            hoverBorderWidth:4,

            hoverOffset:15

          }

        ]

      },

      options:{

        responsive:true,

        plugins:{

          legend:{

            position:'bottom',

            labels:{

              usePointStyle:true,

              pointStyle:'circle',

              padding:20,

              font:{

                size:13,

                weight:'bold'

              }

            }

          },

          tooltip:{

            enabled:true

          }

        }

      }

    });

    this.loadChart();

  }

  loadChart(){

    const expenses =

    this.transactions()

    .filter(

      t=>t.type==='expense'

    );

    const categoryMap:any={};

    expenses.forEach(t=>{

      categoryMap[t.category]=

      (categoryMap[t.category]||0)

      +

      t.amount;

    });

    const colorMap:any={

      Food:'#EF5350',

      Transport:'#42A5F5',

      Shopping:'#FFCA28',

      Bills:'#26A69A',

      Entertainment:'#AB47BC',

      Health:'#FFA726',

      Rent:'#8D6E63',

      Travel:'#26C6DA',

      Salary:'#66BB6A',

      Others:'#78909C'

    };

    const hoverColorMap:any={

      Food:'#E53935',

      Transport:'#1E88E5',

      Shopping:'#FBC02D',

      Bills:'#00897B',

      Entertainment:'#8E24AA',

      Health:'#FB8C00',

      Rent:'#6D4C41',

      Travel:'#00ACC1',

      Salary:'#43A047',

      Others:'#546E7A'

    };

    const labels =

    Object.keys(categoryMap);

    this.chart.data.labels = labels;

    this.chart.data.datasets[0].data =

    Object.values(categoryMap);

    (this.chart.data.datasets[0] as any).backgroundColor =

    labels.map(

      label => colorMap[label] || '#BDBDBD'

    );

    (this.chart.data.datasets[0] as any).hoverBackgroundColor =

    labels.map(

      label => hoverColorMap[label] || '#9E9E9E'

    );

    this.chart.update();

  }

}