import React from 'react';
import moment from 'moment';
import NewNotes from './NewNotes';
import EditNotes from './EditNotes';
import NotesList from './ListNotes';
import { Route, Link } from 'react-router-dom';


class NotesApp extends React.Component {
        constructor(props) {
        super(props);
        const notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
        this.state = {
            notes: notes,
            selectedNote: null,
            editMode: false
        };
        this.getNotesNextId = this.getNotesNextId.bind(this);
        this.addNote = this.addNote.bind(this);
        this.viewNote = this.viewNote.bind(this);
        this.openEditNote = this.openEditNote.bind(this);
        this.saveEditedNote = this.saveEditedNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
    }

    getNotesNextId() {
        return this.state.notes.length > 0 ? this.state.notes[this.state.notes.length - 1].id + 1 : 0;
    }

    persistNotes(notes) {
        localStorage.setItem('notes', JSON.stringify(notes));
        this.setState({notes: notes});
    }

    addNote(note) {
        note.id = this.getNotesNextId();
        note.date = moment();
        const notes = this.state.notes;
        notes.push(note);
        this.persistNotes(notes);
        this.setState({selectedNote: null, editMode: false});
    }

    viewNote(id) {
        const notePosition = this.state.notes.findIndex((n) => n.id === id);
        if (notePosition >= 0) {
            this.setState({
                selectedNote: this.state.notes[notePosition], 
                editMode: false
            });
        } 
        else {
            console.warn('A anotação de id ' + id + ' não foi encontrada.');
        }
    }


    openEditNote(id) {
        const notePosition = this.state.notes.findIndex((n) => n.id === id);
        if (notePosition >= 0) {
            this.setState({
                selectedNote: this.state.notes[notePosition], 
                editMode: true
            });
        } 
        else {
            console.warn('A anotação de id ' + id + ' não foi encontrada.');
        }
    }

    saveEditedNote(note) {
        const notes = this.state.notes;
        const notePosition = notes.findIndex((n)=> n.id === note.id);
        if (notePosition >= 0) {
            note.date = moment();
            notes[notePosition] = note;
            this.persistNotes(notes);
        } 
        else {
            console.warn('A anotação de id ' + note.id + ' não foi encontrada.');
        }
        this.setState({
            selectedNote: note, 
            editMode: false
        });
    }

    deleteNote(id) {
        const notes = this.state.notes;
        const notePosition = notes.findIndex((n)=> n.id === id);
        if (notePosition >= 0) {
            if (window.confirm('Tem certeza que quer deletar essa anotação?')) {
                notes.splice(notePosition, 1);
                this.persistNotes(notes);
                this.setState({selectedNote: null, editMode: false});
            }
        } 
        else {
            console.warn('A anotação de id ' + id + ' não foi encontrada.');
        }
    }

    getEmptyNote() {
        return {
            title: "",
            description: "",
            image: ""
        };
    }

    renderMenu () {
        return (
            <div className="card">
                {this.renderHeader()}
                <div className="card-body">
                    <NotesList notes={this.state.notes} viewNote={this.viewNote}/>   
                </div>
            </div>
        )
    }

    renderHeader() {
        return (
            <div className="card-header">

                <Route exact path="/note" render={routeProps => 
                    <Link to="/">
                        <button type="button" className="btn btn-danger">Cancelar</button>
                    </Link> }/>
                {["/", "/note/:id"].map(path =>
                <Route key={path} exact path={path} render={routeProps => 
                    <Link to="/note">
                        <button type="button" className="btn btn-success">Adicionar</button>
                    </Link>}/>
                )}
            </div>
        )
    }

    setMainAreaRoutes() {
        const editMode = this.state.editMode;
        return (<div>

            {editMode ? (
                <Route exact path="/note/:id"
                       render={routeProps => <NewNotes persistNote={this.saveEditedNote} deleteNote={this.deleteNote} note={this.state.selectedNote}/>}
                    />
                ) : (
                <Route exact path="/note/:id" render={routeProps =>     
                    <EditNotes editNote={this.openEditNote} deleteNote={this.deleteNote} note={this.state.selectedNote}/>}
                />
            )}
            <Route exact path="/note"
                   render={routeProps =>  <NewNotes persistNote={this.addNote} note={this.getEmptyNote()}/>}
                />
        </div>)
    }

    render() {
        return (
            <div className="notesApp container-fluid">
                 <div className="card-notes-header">
                    <h2> Notas </h2>
                </div>
                <div className="row">
                    <div className="col-12">
                        {this.renderMenu()}  
                    </div>
                    <div className="col-12">
                        {this.setMainAreaRoutes()}
                    </div>
                    </div>
            </div>
        );
    }
}

export default NotesApp;