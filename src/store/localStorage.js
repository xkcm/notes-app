const LOCALSTORAGE_KEY = 'notes-app_notes'
const type = (v) => Object.prototype.toString.call(v).match(/\[object (.+)\]/)[1].toLowerCase()
export function getFromLocalStorage(){
  let json = window.localStorage.getItem(LOCALSTORAGE_KEY)
  let parsed = null
  try {
    parsed = JSON.parse(json)
  } catch(e) {
    parsed = []
  }
  if (type(parsed) != 'array') parsed = []
  return parsed
}
export function setToLocalStorage(obj){
  window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(obj))
}
export function addToLocalStorage(obj){
  let newNotes = [...getFromLocalStorage(), obj]
  setToLocalStorage(newNotes)
}
export function removeFromLocalStorage(id){
  let notes = getFromLocalStorage().filter(note => note.id != id)
  setToLocalStorage(notes)
}
export function updateInLocalStorage(id, fields){
  let notes = getFromLocalStorage()
  let noteIndex = notes.findIndex(note => note.id == id)
  let note = notes[noteIndex]
  function applyUpdate(object, key, value){
    if (type(value) === 'object') Object.entries(value).forEach(([k, v]) => applyUpdate(object[key], k, v))
    else {
      object[key] = value
    }
    return object
  }
  notes.splice(noteIndex, 1, applyUpdate([note], 0, fields)[0])
  setToLocalStorage(notes)
}
