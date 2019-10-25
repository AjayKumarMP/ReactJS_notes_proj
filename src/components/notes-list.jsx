import React from 'react'

export class NotesList extends React.Component {

    static defaultProps = {
        notes: []
    }

    render() {
        return <div className="list-group">
            {
                this.props.notes.map((note, index) =>
                    <div
                        key={index}
                        onClick={() => this.props.selectedNote(note)}
                        className={note.active ? 'list-group-item active' : 'list-group-item'}>
                        {note.title}
                    </div>
                )
            }
        </div>
    }
}