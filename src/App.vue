<template>
  <notes-container :notes="notes"/>
</template>

<script>
import NotesContainer from './components/NotesContainer'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters(['notes'])
  },
  created(){
    this.$store.dispatch('downloadNotes')
  },
  components: { NotesContainer }
}
</script>

<style lang="scss">
@import '@/assets/theme.scss';
body {
  background: $bg-color;
  color: $font-color;
  font-family: $font-family;
  font-size: 1rem;
  margin: 0;
  padding: 0;
}
</style>
