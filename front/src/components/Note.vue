<template>
  <div class="note-box" :class="{'minimized': minimized}" draggable>
    <div class="header">
      <div class="title">
        <input type="text" size="1" :value="noteData.title" @change="updateTitle($event.target.value)">
      </div>
      <div class="actions">
        <button class="close round-action-button" @click="destroy()">×</button>
        <button class="minimize round-action-button" @click="minimize()">–</button>
      </div>
    </div>
    <textarea class="content" :value="noteData.content" @change="updateContent($event.target.value)">
    </textarea>
  </div>
</template>

<script>
export default {
  props: {
    noteData: Object
  },
  data: () => ({
    minimized: false
  }),
  methods: {
    updatePosition(x, y){
      this.$store.dispatch('updateNotePosition', {
        id: this.noteData.id,
        pos: [x, y]
      })
    },
    updateSize(w, h){
      this.$store.dispatch('updateNoteSize', {
        id: this.noteData.id,
        size: [w, h]
      })
    },
    updateTitle(title){
      this.$store.dispatch('updateNoteTitle', {
        id: this.noteData.id,
        title
      })
    },
    updateContent(content){
      this.$store.dispatch('updateNoteContent', {
        id: this.noteData.id,
        content
      })
    },
    destroy(){
      if (window.confirm('Are you sure?'))
        this.$store.dispatch('removeNote', this.noteData.id)
    },
    minimize(){
      const titleInput = this.$el.querySelector('.title input')
      const textarea = this.$el.querySelector('textarea')
      if (!this.minimized){
        titleInput.style.width = titleInput.value.length+'ch'
        textarea.style.display = 'none'
      }
      if (this.minimized){
        titleInput.style.width = ''
        textarea.style.display = 'initial'
      }
      this.minimized = !this.minimized
      this.$store.dispatch('minimizeNote', {
        id: this.noteData.id,
        minimized: this.minimized
      })
    }
  },
  mounted(){
    if (this.noteData.minimized) this.minimize()

    let position = this.noteData.geometry.pos
    let grabPosition = []
    const setPos = (x, y) => {
      this.$el.style.left = x+'px'
      this.$el.style.top = y+'px'
      position = [x,y]
    }
    setPos(...position)

    const textarea = this.$el.querySelector('textarea.content')
    let textareaSize = [ textarea.clientWidth, textarea.clientHeight ]
    const header = this.$el.querySelector('.header')
    textarea.style.width = `calc(${this.noteData.geometry.size[0]}px - 0.8rem)`
    textarea.style.height = `calc(${this.noteData.geometry.size[1]}px - 0.8rem)`

    const headerMouseDown = ({ clientX, clientY }) => {
      grabPosition = [clientX, clientY]
      const initialPosition = [...grabPosition]

      const onmousemove = ({ clientX, clientY }) => {
        const offsetX = clientX - grabPosition[0], offsetY = clientY - grabPosition[1]
        const x = position[0] + offsetX, y = position[1] + offsetY
        setPos(x, y)
        grabPosition = [clientX, clientY]
      }
      const onmouseup = ({ clientX, clientY }) => {
        if (clientX != initialPosition[0] || clientY != initialPosition[1]){
          const boundingRect = header.getBoundingClientRect()
          this.updatePosition(boundingRect.left, boundingRect.top)
        }
        document.removeEventListener('mousemove', onmousemove)
        document.removeEventListener('mouseup', onmouseup)
      }
      document.addEventListener('mousemove', onmousemove)
      document.addEventListener('mouseup', onmouseup)
    }
    const textareaMouseDown = ({ target }) => {
      textareaSize = [target.clientWidth, target.clientHeight]
      const onmouseup = () => {
        const x = textarea.clientWidth, y = textarea.clientHeight
        if (x != textareaSize[0] || y != textareaSize[1]){
          this.updateSize(x, y)
        }
        document.removeEventListener('mouseup', onmouseup)
      }
      document.addEventListener('mouseup', onmouseup)
    }

    textarea.addEventListener('mousedown', textareaMouseDown)
    header.addEventListener('mousedown', headerMouseDown)
  }
}
</script>

<style lang="scss">
@import '@/assets/theme.scss';
@mixin action-button-colors($color){
  background-color: $color;
  &:hover{
    background-color: darken($color, 5%);
  }
}
.note-box{
  position: fixed;
  display: flex;
  flex-direction: column;
  .header {
    padding: 3px;
    background-color: darken($accent-color, 5%);
    font-size: .8rem;
    display: flex;
    &:active{
      cursor: grabbing;
    }
    .title{
      padding: 1px 7px;
      flex-grow: 1;
      display: flex;
      input{
        cursor: default;
        &:active{ cursor: grabbing; }
        border: none;
        outline: none;
        flex-grow: 1;
        background-color: transparent;
        color: #fff;
      }
    }
    .actions {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      button.round-action-button{
        margin-left: 3px;
        border: none;
        outline: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        color: #fff;
        width: 14px;
        height: 14px;
        &.close{ @include action-button-colors(#B33A3A); }
        &.minimize{ @include action-button-colors(#FFCC00) }
      }
    }
  }
  textarea.content{
    padding: .4rem;
    outline: none;
    border: none;
    background-color: $accent-color;
    color: $font-color;
    min-width: 100px;
    min-height: 30px;
  }
}
</style>