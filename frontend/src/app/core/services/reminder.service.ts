import { Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Reminder } from '../models/reminder.model';

@Injectable({

  providedIn: 'root'

})

export class ReminderService {

  apiUrl =
  'http://localhost:5000/api/reminders';

  reminders =
  signal<Reminder[]>([]);

  constructor(

    private http: HttpClient

  ) {}



  getReminders() {

    this.http.get<Reminder[]>(

      this.apiUrl

    ).subscribe(res => {

      this.reminders.set(res);

    });

  }



  addReminder(data: Reminder) {

    return this.http.post(

      this.apiUrl,

      data

    );

  }



  updateReminder(

    id: string,

    data: Reminder

  ) {

    return this.http.put(

      `${this.apiUrl}/${id}`,

      data

    );

  }



  deleteReminder(id: string) {

    return this.http.delete(

      `${this.apiUrl}/${id}`

    );

  }

}