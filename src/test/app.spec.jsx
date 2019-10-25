//@ts-check
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon'
import { shallow, mount, render } from 'enzyme';
import './setup.js'

import { App } from '../components/app'

import { NotesList } from '../components/notes-list'
import { notes } from '../test/fixtures.js'

describe('List Component', () => {

    it('should show list of notes', () => {
        let wrapper = shallow(<NotesList notes={notes} />)
        expect(wrapper.find('.list-group-item'), 'List must have .list-group-item element for each note').to.have.lengthOf(notes.length)
    })

    it('should be stateless component (no setState, only props)', () => {
        let wrapper = shallow(<NotesList notes={notes} />)
        expect(wrapper.state()).to.be.null
    })
    it('when note was clicked call onSelect function', () => {
        let onSelect = sinon.spy()
        let wrapper = mount(<NotesList notes={notes} onSelect={onSelect} />)
        let item = wrapper.find('.list-group-item').at(1)
        let note = notes[1]

        item.simulate('click')
        expect(onSelect).to.have.been.calledWith(note)
    })

    it('when note is selected it should have `active` class', () => {
        let note = notes[1]
        let wrapper = mount(<NotesList notes={notes} selected={note} />)
        let item = wrapper.find('.list-group-item').at(1)

        wrapper.setProps({ selected: note })
        expect(item, `expected selected note to have 'active' class`).to.have.className('active')
    })
})

import { NoteForm } from '../components/note-form'

describe('Notes Form Component', () => {

    it('should be stateless component (no setState, only props)', () => {
        let wrapper = shallow(<NoteForm note={{}} />)
        expect(wrapper.state()).to.be.null
    })

    it('when note is selected show in title and note form fields', () => {
        let note = notes[1]
        let wrapper = mount(<NoteForm note={note} />)
        expect(wrapper.find('[name="title"]')).to.have.value(note.title)
        expect(wrapper.find('[name="note"]')).to.have.value(note.note)
    })
    it('when form value changes it should call onChange with changed note', () => {
        let onChange = sinon.spy()
        let wrapper = mount(<NoteForm note={{ title: '', note: '' }} onChange={onChange} />)

        let title = wrapper.find('[name="title"]')
        title.instance().value = 'test'
        let note = wrapper.find('[name="note"]')
        note.instance().value = 'test'

        title.simulate('change', { target: title.getDOMNode() })
        expect(onChange).to.have.been.calledWithMatch({ title: 'test' })
        note.simulate('change', { target: note.getDOMNode() })
        expect(onChange).to.have.been.calledWithMatch({ note: 'test' })
    })

    it('when form is submitted it should call onSubmit with changed note', () => {
        let onSubmit = sinon.spy()
        let note = { title: '', note: '' }
        let wrapper = mount(<NoteForm note={note} onSubmit={onSubmit} />)
        wrapper.find('form [type="submit"]').simulate('click')
        wrapper.find('form').simulate('submit')
        expect(onSubmit).to.have.been.calledWithExactly(note)
    })
})

describe('App Component', () => {

    function MockService() {
        let id = Date.now();
        var MockService = {
            notes: [{
                id: '4567', title: 'candidate test', note: 'candidate test'
            }],
            getNotes() {
                return Promise.resolve(this.notes)
            },
            saveNote(note) {
                if(note.id){
                    let i = this.notes.findIndex( n => n.id == note.id)
                    this.notes.splice(i,1,note)
                }else{
                    note.id = ++id;
                    this.notes.push(note)
                }
                return Promise.resolve(note)
            }
        }
        sinon.spy(MockService, 'getNotes')
        sinon.spy(MockService, 'saveNote')
        return MockService;
    }

    it('when form is submitted notesService saveNote() method should be called', () => {
        let mockService = MockService()

        let wrapper = mount(<App service={mockService} />)
        expect(mockService.getNotes).to.have.been.called

        let notes = wrapper.setState({ selected: mockService.notes[0] })

        wrapper.find('form [type="submit"]').simulate('click')
        wrapper.find('form').simulate('submit')
        expect(mockService.saveNote, 'expected app to call saveNote() when form is submitted').to.have.been.calledWith(mockService.notes[0])
    })

    it('when form is submitted notes should be fetched from notesService and update notes list', () => {
        let mockService = MockService()

        let wrapper = mount(<App service={mockService} />)
        expect(mockService.getNotes).to.have.been.called

        return mockService.getNotes.getCalls()[0].returnValue.then(() => {
            wrapper.update();
            expect(wrapper.find('.list-group-item').length).to.eq(mockService.notes.length)
        })
    })


    it('when new note is saved it should be added to list', () => {

        let mockService = MockService()

        let wrapper = mount(<App service={mockService} />)

        wrapper.setState({ selected: { title: 'new', note: 'new' } })
        wrapper.find('form [type="submit"]').simulate('click')
        wrapper.find('form').simulate('submit')

        expect(mockService.saveNote,'saveNote() not called when form submitted').to.have.been.calledOnce;

        // Wait for saveNote
        return Promise.resolve(mockService.saveNote.getCalls()[0].returnValue)
        .then(() => {
            expect(mockService.getNotes,'getNotes() not called after saveNote()').to.have.been.calledTwice;

            // Wait for second getNotes
            return mockService.getNotes.getCalls()[1].returnValue
        })
        .then(() => {
            wrapper.update();
            expect(wrapper.find('.list-group-item').length, 'saved note was not added to list').to.eq(mockService.notes.length)
        })
    })

    it('when existing note is saved it should be updated on list', () => {
        let mockService = MockService()
        let wrapper = mount(<App service={mockService} />)
        let note = mockService.notes[0];
        note.title = 'changed title'

        wrapper.setState({ selected: note })
        wrapper.find('[name="title"]').simulate('change')

        wrapper.find('form [type="submit"]').simulate('click')
        wrapper.find('form').simulate('submit')

        expect(mockService.saveNote,'saveNote() not called when form submitted').to.have.been.calledOnce;

        // Wait for saveNote
        return Promise.resolve(mockService.saveNote.getCalls()[0].returnValue)
        .then(() => {
            expect(mockService.getNotes,'getNotes() not called after saveNote()').to.have.been.calledTwice;

            // Wait for second getNotes
            return mockService.getNotes.getCalls()[1].returnValue
        })
        .then(() => {
            wrapper.update();
            expect(wrapper.find('.list-group-item').at(0), 'saved note was not updated on list').to.have.text(note.title)
        })
    })
})