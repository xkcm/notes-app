import { addToLocalStorage, getFromLocalStorage, removeFromLocalStorage, updateInLocalStorage } from './localStorage'

const store = {
  state: () => ({
    notes: []
  }),
  getters: {
    notes: state => state.notes,
    note: state => id => state.notes.find(note => note.id == id),
    noteIndex: state => id => state.notes.findIndex(note => note.id == id)
  },
  mutations: {
    insertNotes(state, notes){
      state.notes.push(...notes)
    }
  },
  actions: {
    downloadNotes({ commit }){
      commit('insertNotes', getFromLocalStorage())
    },
    createNote({ commit }, note = {}){
      const id = Date.now()
      const title = note.title || 'Note'
      const content = note.content || 'Write something'
      const geometry = {
        pos: note.geometry?.pos || [100,100],
        size: note.geometry?.size || [200, 200]
      }
      const minimized = false
      const obj = {
        title, content, id, geometry, minimized
      }
      console.log(obj)
      addToLocalStorage(obj)
      commit('insertNotes', [obj])
    },
    removeNote({ state, getters }, id){
      removeFromLocalStorage(id)
      const index = getters.noteIndex(id)
      state.notes.splice(index, 1)
    },
    updateNotePosition({ state, getters }, { id, pos }){
      updateInLocalStorage(id, { geometry: { pos } })
      const index = getters.noteIndex(id)
      state.notes[index].geometry.pos = [...pos]
    },
    updateNoteSize({ state, getters }, { id, size }){
      updateInLocalStorage(id, { geometry: { size }})
      const index = getters.noteIndex(id)
      state.notes[index].geometry.size = [...size]
    },
    updateNoteTitle({ state, getters }, { id, title }){
      updateInLocalStorage(id, { title })
      const index = getters.noteIndex(id)
      state.notes[index].title = title
    },
    updateNoteContent({ state, getters }, { id, content }){
      updateInLocalStorage(id, { content })
      const index = getters.noteIndex(id)
      state.notes[index].content = content
    },
    minimizeNote({ state, getters }, { id, minimized }){
      const index = getters.noteIndex(id)
      updateInLocalStorage(id, { minimized })
      state.notes[index].minimized = minimized
    }
  }
}

export default store
