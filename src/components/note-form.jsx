import React from 'react'

export class NoteForm extends React.Component {

    constructor(props) {
        super(props)
    }

    static defaultProps = {
        note: {
            title: '',
            note: ''
        }
    }

    render() {
        return <form onSubmit={(e) => { e.preventDefault(); this.props.saveNote() }}>
            <div className="form-group">
                <label>Title:</label>
                <input
                    required
                    value={this.props.selectedNote && this.props.selectedNote.title}
                    className="form-control"
                    onChange={(e) => this.props.title(e.target.value)}
                    name="title" />
            </div>
            <div className="form-group">
                <label>Note:</label>
                <textarea
                    required
                    value={this.props.selectedNote && this.props.selectedNote.note}
                    onChange={(e) => this.props.note(e.target.value)}
                    className="form-control"
                    name="note" />
            </div>
            <div className="form-group">
                <button onClick={() => this.props.cancel()} type="button" className="btn btn-default pull-right" value="Cancel">Cancel</button>
                <button type="submit" className="btn btn-default pull-right" value="Save">Save</button>
            </div>
        </form>
    }
}