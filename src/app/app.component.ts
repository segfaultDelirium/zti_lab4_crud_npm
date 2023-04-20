import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription, of } from 'rxjs';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { EditPersonComponent } from './dialogs/edit-person/edit-person.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddPersonComponent } from './dialogs/add-person/add-person.component';

export type Person = NewPerson & {
  id: number
}
  // fname: string,
  // lname: string,
  // city: string,
  // email: string,
  // tel: string,
  
// }

export type NewPerson = {
  fname: string,
  lname: string,
  city: string,
  email: string,
  tel: string,
}

const placeholderPerson: NewPerson = {
  fname: 'my_fname',
  lname: 'my_lname',
  city: 'my_city',
  email: 'my_email@adsf.com',
  tel: '3253453453',
}

const urlBase = 'http://localhost:31222/lab4_try_on_my_own-1.0-SNAPSHOT/api/jdbc/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lab4_crud_npm';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  addPersonSubscription?: Subscription;
  editPersonSubscription?: Subscription;
  deletePersonSubscription?: Subscription;

  persons: Observable<Person[]> = of([]);

  constructor(private http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar){

  }

  ngOnInit(){
    this.persons = this.queryUserList();
  }

  ngOnDestroy(){
    this.editPersonSubscription?.unsubscribe();
    this.deletePersonSubscription?.unsubscribe();
    this.addPersonSubscription?.unsubscribe();
  }


  queryUserList(){
    return this.http.get(`${urlBase}person`) as Observable<Person[]>;
  }


  openAddDialog(){
    const dialogRef = this.dialog.open(AddPersonComponent, {
      data: placeholderPerson
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === undefined) return;
      const person = { 
        ...result as NewPerson,
        id: -1
      }
      this.editPersonSubscription?.unsubscribe();
      this.editPersonSubscription = this.http.post(`${urlBase}person`, JSON.stringify(person), this.httpOptions).subscribe(result => {
        this._snackBar.open("User successfully added ", "ok");
      })
    });
  }

  openEditDialog(person: Person){
    const dialogRef = this.dialog.open(EditPersonComponent, {
      data: {...person}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === undefined) return;
      const person = result as Person;
      this.editPersonSubscription?.unsubscribe();
      this.editPersonSubscription = this.http.put(`${urlBase}person`, JSON.stringify(person), this.httpOptions).subscribe(result => {
        this._snackBar.open("User successfully updated", "ok");
      })
    });
  }


  deletePerson(personId: number){
    this.deletePersonSubscription = this.http.delete(`${urlBase}person/${personId}`).subscribe(result => {
      this._snackBar.open("User successfully deleted", "ok");
    })
  }


  refreshTable(){
    this.persons = this.queryUserList();
  }


}
