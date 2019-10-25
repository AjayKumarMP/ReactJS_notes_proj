This file is provided exclusively for the purpose of Assessment.
Unauthorized distribution of this file, derived work or information about its
content, via any medium, is strictly prohibited.
 

# React Notes App Task
Notes app is a simple list of notes you can select and simple form that can be used for creating new notes or editing existing ones. 

---
## Your Task
Your task is to complete simple notes aplication using provided NotesService to save and read notes. Please use react best practices to have clean code and state only in app component, keeping Form and List components stateless.

### 1. Use NotesServices to populate list of notes
- Each item in list should show note title
- List component should not keep state, use `notes` prop
- List should notify its parent on item click with `onSelect` prop
- When note gets passed note via `selected` prop it should add `active` class to correct list item

### 2. Note Form
- When new (empty) note is created form fields should be cleared
- Form should be stateless component. Use `note` prop for data
- When note is provided via `note` prop should populate title and note fields
- When any field value changes it should call `onChange` prop with updated note object
- When form is submitted it should call `onSubmit` with updated note object

### 3. App and NoteService
- NoteService thats passed as `service` prop to App Componnent should be used
- When form is submitted `saveNote` method should be called on service with updated note
- When App is created `getNotes` should be called on service and show notes on list 
- When new note is added it should be displayed on the list
- When existing note is saved it should be updated on the list


## Setup
1. `npm install` to get dependencies
2. Start app with `npm run start` and point webbrowser to `http://localhost:8080/`
3. Use `npm run test:watch` to see tests failing
4. Fix issues so that tests pass
5. Solve all issues mentioned here
6. Send code as ZIP  if task is completed

## Good Luck!