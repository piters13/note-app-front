import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Note {
  noteID: number;
  title: string;
  content: string;
  authorID: number;
  creationDate: string;
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  step = 0;
  notes: Note[];

  constructor(public dialog: MatDialog,
              public http: HttpClient,
              private snackBar: MatSnackBar,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.http.get('http://localhost:8080/notes').subscribe((notes: Note[]) => {
      this.notes = notes;
    });
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  remove(id: number) {
    this.http.delete(`http://localhost:8080/notes/${id}`).subscribe(() => {
      this.snackBar.open('Deleted successfully', '', {
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.fetchData();
    });
  }

  edit(id: number) {
    const note = this.notes.find((x) => x.noteID === id);

    const dialogRef = this.dialog.open(NewNoteDialogComponent, {
      width: '500px',
      data: {title: note.title, content: note.content}
    });

    dialogRef.afterClosed().subscribe(
      data => data && this.http.put(`http://localhost:8080/notes/${id}`, {...data}).subscribe(() => {
        this.snackBar.open('Saved successfully', '', {
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.fetchData();
      }),
    );
  }

  addNote(): void {
    const dialogRef = this.dialog.open(NewNoteDialogComponent, {
      width: '500px',
      data: {title: '', content: ''}
    });

    dialogRef.afterClosed().subscribe(
      data => data && this.http.post('http://localhost:8080/notes', {...data}).subscribe(() => {
        this.snackBar.open('Added successfully', '', {
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.fetchData();
      }),
    );
  }

  logout() {
    this.userService.logout();
  }

}

export interface DialogData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-new-note-dialog-component',
  templateUrl: 'new-note-dialog.html',
})
export class NewNoteDialogComponent implements OnInit {
  newNoteForm: FormGroup;
  dialogTitle: string;
  submitButtonLabel: string;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<NewNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit() {
    this.initializeDialogData();
  }

  initializeDialogData() {
    if (this.data.title || this.data.content) {
      this.dialogTitle = 'Aktualizuj notatkę';
      this.submitButtonLabel = 'Aktualizuj';
    } else {
      this.dialogTitle = 'Dodaj nową notatkę';
      this.submitButtonLabel = 'Dodaj';
    }

    this.newNoteForm = this.fb.group({
      title: this.data ? this.data.title : '',
      content: this.data ? this.data.content : '',
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.newNoteForm.value);
  }

}
