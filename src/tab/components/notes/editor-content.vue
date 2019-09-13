<template>
  <div class="editor-content">
    <div class="editor-menu-wrapper">
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="menu-bar d-flex align-center">
          <div class="menu-bar--content mr-2">
            <v-btn :disabled="isEmpty" tile icon small :class="{ background: isActive.paragraph() }" @click="commands.paragraph">
              <v-icon>{{ $icons.mdiFormatParagraph }}</v-icon>
            </v-btn>
            <v-btn :disabled="isEmpty" tile icon small :class="{ background: isActive.bold() }" @click="commands.bold">
              <v-icon>{{ $icons.mdiFormatBold }}</v-icon>
            </v-btn>
            <v-btn :disabled="isEmpty" tile icon small :class="{ background: isActive.italic() }" @click="commands.italic">
              <v-icon>{{ $icons.mdiFormatItalic }}</v-icon>
            </v-btn>
            <v-btn :disabled="isEmpty" tile icon small :class="{ background: isActive.underline() }" @click="commands.underline">
              <v-icon>{{ $icons.mdiFormatUnderline }}</v-icon>
            </v-btn>
          </div>
          <div style="height: 30px; width: 2px;" class="background" />
          <div class="menu-bar--content mx-2">
            <v-btn :disabled="isEmpty" tile icon small :class="{ background: isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })">
              <v-icon>{{ $icons.mdiFormatHeader1 }}</v-icon>
            </v-btn>
            <v-btn :disabled="isEmpty" tile icon small :class="{ background: isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
              <v-icon>{{ $icons.mdiFormatHeader2 }}</v-icon>
            </v-btn>
            <v-btn :disabled="isEmpty" tile icon small :class="{ background: isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">
              <v-icon>{{ $icons.mdiFormatHeader3 }}</v-icon>
            </v-btn>
          </div>
          <div style="height: 30px; width: 2px;" class="background" />
          <div class="menu-bar--content ml-2">
            <v-btn :disabled="isEmpty" tile icon small :class="{ background: isActive.bullet_list() }" @click="commands.bullet_list">
              <v-icon>{{ $icons.mdiFormatListBulleted }}</v-icon>
            </v-btn>
            <v-btn :disabled="isEmpty" tile icon small :class="{ background: isActive.blockquote() }" @click="commands.blockquote">
              <v-icon>{{ $icons.mdiFormatQuoteClose }}</v-icon>
            </v-btn>
            <v-btn :disabled="isEmpty" tile icon small :class="{ background: isActive.code_block() }" @click="commands.code_block">
              <v-icon>{{ $icons.mdiCodeTags }}</v-icon>
            </v-btn>
          </div>
        </div>
      </editor-menu-bar>
    </div>
    <div class="editor-content-wrapper mt-3">
      <v-textarea :disabled="isEmpty" v-model="inputTitle" hide-details placeholder="Title here..." row-height="5" auto-grow class="note-title mb-3" solo flat></v-textarea>
      <editor-content v-show="!isEmpty" class="editor px-3" :editor="editor" />
    </div>
  </div>
</template>
<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { Blockquote, CodeBlock, Heading, Bold, Italic, TrailingNode, Placeholder, History, BulletList, ListItem, Underline } from 'tiptap-extensions';
import Bus from '../../utils/bus';

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
  components: {
    EditorContent,
    EditorMenuBar,
  },
  data() {
    return {
      changeNote: false,
      activeFloatMenu: false,
      editor: new Editor({
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
          new ListItem(),
          new BulletList(),
          new Underline(),
          new History(),
          new TrailingNode({
            node: 'paragraph',
            notAfter: ['paragraph'],
          }),
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
    inputTitle: {
      set(value) {
        this.updateTitle(value);
      },
      get() {
        return this.$props.title;
      },
    },
    isEmpty() {
      return this.$store.getters['notes/isEmpty'];
    },
  },
  methods: {
    updateTitle(title) {
      this.$emit('change', { title, content: this.editor.getHTML() });
    },
  },
  created() {
    Bus.$on('changeNote', () => this.editor.clearContent());
    this.editor.setContent(this.$props.content);
  },
  watch: {
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
.note-title {
  .v-input__slot {
    font-size: 22px;
    font-weight: 600;
    textarea {
      line-height: 1.4rem;
    }
  }
}
.menu-bar {
  &--content {
    .v-btn {
      padding: 3px !important;
      box-sizing: content-box !important;
      border-radius: 4px;
    }
  }
}
.editor {
  code {
    box-shadow: none !important;
    background: #2d2d2d !important;
    font-family: 'Roboto', sans-serif;
    color: white !important;
    padding: 10px;
    min-width: 250px;
    margin: 5px 0;
  }
  blockquote {
    padding: 12px;
    background: #0000000f;
    max-width: 50%;
    margin: 10px;
    font-size: 15px;
    border-radius: 5px;
    p {
      line-height: 1.1rem;
    }
    &:before {
      content: open-quote;
      position: absolute;
      font-size: 70px;
      margin: 10px 0 0 -12px;
      color: #0000001c;
    }
  }
  .ProseMirror {
    outline: none;
    min-height: 150px;
    p {
      margin-bottom: 0px;
    }
  }
  p.is-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
    font-style: italic;
  }
}
</style>
