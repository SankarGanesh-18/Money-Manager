import {
    Component,
    OnInit,
    computed
  } from '@angular/core';
  
  import {
    CommonModule
  } from '@angular/common';
  
  import {
    ReactiveFormsModule,
    FormBuilder,
    Validators,
    FormGroup
  } from '@angular/forms';
  
  import {
    ReminderService
  } from '../../core/services/reminder.service';
  
  @Component({
  
    selector:'app-reminder',
  
    standalone:true,
  
    imports:[
      CommonModule,
      ReactiveFormsModule
    ],
  
    templateUrl:'./reminder.component.html',
  
    styleUrl:'./reminder.component.css'
  
  })
  
  export class ReminderComponent implements OnInit{
  
    showForm=false;
    form : FormGroup;
  
    constructor(
  
      private fb:FormBuilder,
  
      public reminderService:ReminderService
  
    ){
    this.form=this.fb.group({
  
      title:[
        '',
        Validators.required
      ],
  
      amount:[
        0,
        Validators.required
      ],
  
      dueDate:[
        '',
        Validators.required
      ]
  
    });
}

    reminders=computed(
  
      ()=>this.reminderService.reminders()
  
    );
  
    ngOnInit(){
        
        this.reminderService.getReminders();
        
    }
  
    addReminder(){
  
      if(this.form.invalid){
  
        return;
  
      }
  
      this.reminderService
  
      .addReminder(
  
        {
  
          ...this.form.value,
  
          completed:false
  
        } as any
  
      )
  
      .subscribe(()=>{
  
        this.form.reset();
  
        this.showForm=false;
  
        this.reminderService.getReminders();
  
      });
  
    }
  
    toggleCompleted(reminder:any){
  
      this.reminderService
  
      .updateReminder(
  
        reminder._id,
  
        {
  
          ...reminder,
  
          completed:!reminder.completed
  
        }
  
      )
  
      .subscribe(()=>{
  
        this.reminderService.getReminders();
  
      });
  
    }
  
    deleteReminder(id:string){
  
      this.reminderService
  
      .deleteReminder(id)
  
      .subscribe(()=>{
  
        this.reminderService.getReminders();
  
      });
  
    }
  
  }