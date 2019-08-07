<template>
  <div class="note-editor">
    <el-input
      :disabled="$store.getters['notes/isEmpty']"
      placeholder="Title"
      type="textarea"
      :autosize="{ minRows: 1 }"
      class="note-title"
      resize="none"
      :value="title"
      @input="updateTitle"
    ></el-input>
    <editor-floating-menu ref="floatMenu" :editor="editor" v-slot="{ commands, isActive, menu }">
      <div>
        <el-button icon="el-icon-plus" size="small" @click="activeFloatMenu = !activeFloatMenu" circle class="active-menu-button" :style="menuButtonStyle(menu.top)"></el-button>
        <div class="editor__floating-menu" :class="{ 'is-active': activeFloatMenu }" :style="`top: ${menu.top}px`">
          <el-button size="mini" :class="{ 'is-active': isActive.heading({ level: 1 }) }" class="menubar__button" @click="commands.heading({ level: 1 })">
            <span>H1</span>
          </el-button>
          <el-button size="mini" :class="{ 'is-active': isActive.heading({ level: 2 }) }" class="menubar__button" @click="commands.heading({ level: 2 })">
            <span>H2</span>
          </el-button>
          <el-button size="mini" :class="{ 'is-active': isActive.heading({ level: 3 }) }" class="menubar__button" @click="commands.heading({ level: 3 })">
            <span>H3</span>
          </el-button>
          <el-button size="mini" :class="{ 'is-active': isActive.bold() }" class="menubar__button" @click="commands.bold">
            <span>B</span>
          </el-button>
          <el-button size="mini" :class="{ 'is-active': isActive.italic() }" class="menubar__button" @click="commands.italic">
            <span class="italic">i</span>
          </el-button>
          <el-button size="mini" :class="{ 'is-active': isActive.blockquote() }" class="menubar__button" @click="commands.blockquote">
            <span>Blockquote</span>
          </el-button>
          <el-button size="mini" :class="{ 'is-active': isActive.code_block() }" class="menubar__button" @click="commands.code_block">
            <span> <> </span>
          </el-button>
        </div>
      </div>
    </editor-floating-menu>
    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>
<script>
import { Editor, EditorContent, EditorFloatingMenu } from 'tiptap';
import Bus from '../../utils/bus';
import { Blockquote, CodeBlock, Heading, Bold, Italic, Placeholder, History } from 'tiptap-extensions';
export default {
  props: ['content', 'title'],
  components: {
    EditorContent,
    EditorFloatingMenu,
  },
  data() {
    return {
      changeNote: false,
      activeFloatMenu: false,
      editor: new Editor({
        editable: true,
        onUpdate: ({ getHTML }) => {
          this.activeFloatMenu = false;
          this.$emit('change', { title: this.$props.title, content: getHTML() });
        },
        extensions: [
          new Blockquote(),
          new CodeBlock(),
          new Heading({ levels: [1, 2, 3] }),
          new Bold(),
          new Italic(),
          new History(),
          new Placeholder({
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'Write something...',
            showOnlyWhenEditable: true,
          }),
        ],
        content: '',
      }),
    };
  },
  computed: {
    editable() {
      return this.$store.getters['notes/isEmpty'];
    },
  },
  methods: {
    updateTitle(title) {
      this.$emit('change', { title: title, content: this.editor.getHTML() });
    },
    menuButtonStyle(top) {
      return !top ? { visibility: 'hidden' } : top === 0 ? { visibility: 'hidden' } : { top: top + 'px' };
    },
  },
  created() {
    Bus.$on('changeNote', () => {
      this.$refs.floatMenu.menu.top = 0;
      this.editor.clearContent();
    });
    this.editor.setContent(this.$props.content);
  },
  watch: {
    editable(isEmpty) {
      if (isEmpty) {
        this.editor.clearContent();
        this.editor.setOptions({
          editable: false,
        });
      } else {
        this.editor.setOptions({
          editable: true,
        });
      }
    },
    content: {
      handler(val) {
        if (this.$props.content) {
          this.editor.setContent(val);
        }
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss">
@import '../../../assets/themes/themes';
.editor p.is-empty:first-child::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}

.active-menu-button {
  position: absolute;
  margin-top: -0.2rem !important;
  margin-left: -45px !important;
}
.note-editor {
  .is-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
    font-size: 15px;
    font-style: italic;
  }

  p {
    margin: 0;
    font-size: 16px;
  }

  .ProseMirror {
    outline: none;
    @include themify($themes){
      color: themed('text-regular');
    }
  }
}
.ProseMirror {
  * {
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'å¾®è½¯é›…é»‘', Arial, sans-serif;
  }

  blockquote {
    &:before {
      content: open-quote;
      font-size: 50px;
      line-height: 0px;
      vertical-align: -0.4em;
      margin-right: 7px;
    }

    * {
      display: inline;
    }

    background-color: #409eff29;
    padding: 10px;
    border-left: 3px solid #409eff;
    border-radius: 4px;
  }

  pre {
    &:before {
      content: '< />';
      position: absolute;
      margin-top: -13px;
      margin-left: -14px;
      font-size: 20px;
      opacity: 0.1;
    }

    background-color: #282c34;
    padding: 17px 19px;
    border-radius: 4px;
    color: white;
  }

  h1,
  h2,
  h3 {
    @include themify($themes){
      color: themed('text-regular') !important;
    }
  }
}

.editor {
  position: relative;
  &__floating-menu {
    button {
      margin: 0 2px !important;
    }

    span {
      font-weight: 600;
    }

    .italic {
      font-style: italic;
    }

    padding: 5px;
    background-color: rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    position: absolute;
    z-index: 1;
    margin-top: -0.25rem;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;

    &.is-active {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
