import React from 'react'
import ReactDOM from 'react-dom'

import {App} from './components/app'

import { NotesService } from './services/notes'

ReactDOM.render(<App service={new NotesService()} />, document.body.appendChild(document.createElement('div')))