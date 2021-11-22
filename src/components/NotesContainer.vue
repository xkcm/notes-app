<template>
  <div class="container">
    <button class="create-note" @click="createNote()">create note</button>
    <div class="notes-container">
      <note v-for="note in notes" :key="note.id" :note-data="note"/>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Note from './Note'
export default {
  props: {
    notes: Array
  },
  methods: {
    ...mapActions(['createNote'])
  },
  components: { Note }
}
</script>

<style lang="scss">
@import "@/assets/theme.scss";
.container{
  padding: 10px;
}
.create-note{
  outline: none;
  border: none;
  font-family: inherit;
  font-size: 1rem;
  letter-spacing: -1.5px;
  padding: 1rem 2rem;
  border-radius: 5px;
  font-weight: bold;
  background-color: $primary-color;
  color: $font-color;
  text-transform: uppercase;
  cursor: pointer;
  &:hover{
    background-color: darken($primary-color, 5%);
  }
}
</style>