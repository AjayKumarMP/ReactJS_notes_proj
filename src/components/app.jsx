import React from 'react'

import { NotesList } from './notes-list'
import { NoteForm } from './note-form'

export class App extends React.Component {

    constructor(props) {
        super(props)

        // Notes Service Object
        this.service = this.props.service;
        this.state = {
            notes: [],
            selected: { title: '', note: '' }
        }
        // Get notes from service
        this.getAllNotes()
    }

    getAllNotes() {
        this.props.service.getNotes().then(
            notes => this.setState({
                notes
            }),
            err => console.log(err)
        )

    }

    // Select new empty note
    newNote() {
        this.onSelect({ id: '' })
    }

    // Set note as selected
    onSelect(note) {
        var selected = { title: '', note: '' }
        const notes = this.state.notes.map(data => {
            data['active'] = false
            if (data.id === note.id) {
                data['active'] = true
                selected = data
            }
            return data
        })
        this.setState({
            notes,
            selected
        })
    }

    // Save note to service
    onSubmit() {
        console.log(this.state.selected)
        if (!this.state.selected['id']) {
            this.setState({
                selected: { title: '', note: '' }
            })
        }
        this.service.saveNote(this.state.selected).then(
            response => this.getAllNotes(),
            err => console.log(err)
        )
    }

    // Unselect note
    onCancel() {
        this.onSelect({ id: '' })
    }

    stateUpdate(val, type) {
        const selected = this.state.selected
        selected[type] = val
        this.setState({
            selected
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>React notes</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <NotesList
                            notes={this.state.notes}
                            selectedNote={(note) => this.onSelect(note)}
                        />
                    </div>
                    <div className="col-md-8">
                        <NoteForm
                            selectedNote={this.state.selected}
                            saveNote={() => this.onSubmit()}
                            onChange={(data) => this.setState({ data })}
                            cancel={() => this.onCancel()}
                            note={(note) => this.stateUpdate(note, 'note')}
                            title={(title) => this.stateUpdate(title, 'title')}
                        />
                        <div><button onClick={() => this.newNote()}>New Note</button></div>
                    </div>
                </div>
            </div>
        )
    }
}