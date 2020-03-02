<template>
  <div class="content-wrapper flex h-full editor">
    <div class="content flex-grow mr-5">
      <input-ui v-model="tempTitle" input-style="transparent" placeholder="Title" class="content--title"></input-ui>
      <scrollbar class="editor--scroller">
        <editor-content :editor="editor" class="editor--content" />
      </scrollbar>
    </div>
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="menubar flex flex-col">
        <button-icon
          :disabled="!isEdited"
          square
          icon="save"
          class="save-button"
          size="24"
          @click="updateNote"
          v-tooltip.left="{ content: 'Save note', classes: 'shadow-xl bg-card p-2 rounded-lg', offset: '5' }"
        ></button-icon>
        <div class="content-menu">
          <button-icon icon="text" size="23" square class="mt-1" :class="{ 'text-primary bg-gray-200': isActive.paragraph() }" @click="commands.paragraph"> </button-icon>

          <button-icon icon="h1" size="22" square class="mt-1" :class="{ 'text-primary bg-gray-200': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })">
            H1
          </button-icon>

          <button-icon icon="h2" size="22" square class="mt-1" :class="{ 'text-primary bg-gray-200': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
            H2
          </button-icon>

          <button-icon icon="h3" size="22" square class="mt-1" :class="{ 'text-primary bg-gray-200': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">
            H3
          </button-icon>
          <div class="mb-3"></div>
          <button-icon icon="bold" size="23" square :class="{ 'text-primary bg-gray-200': isActive.bold() }" @click="commands.bold"> </button-icon>

          <button-icon icon="italic" size="23" square class="mt-1" :class="{ 'text-primary bg-gray-200': isActive.italic() }" @click="commands.italic"> </button-icon>

          <button-icon icon="underline" size="23" square class="mt-1" :class="{ 'text-primary bg-gray-200': isActive.underline() }" @click="commands.underline"> </button-icon>
          <div class="mb-3"></div>
          <button-icon icon="quote" size="23" square class="mt-1" :class="{ 'text-primary bg-gray-200': isActive.blockquote() }" @click="commands.blockquote"> </button-icon>
          <button-icon icon="list-ul" size="23" square class="mt-1" :class="{ 'text-primary bg-gray-200': isActive.bullet_list() }" @click="commands.bullet_list"> </button-icon>
        </div>
      </div>
    </editor-menu-bar>
  </div>
</template>

<script>
import '@/assets/scss/components/_editor.scss';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { Blockquote, HardBreak, Heading, Bold, Code, Italic, Link, Underline, History, TrailingNode, Placeholder, BulletList, ListItem } from 'tiptap-extensions';

import scrollbar from 'vue-perfect-scrollbar';

export default {
  components: {
    scrollbar,
    EditorContent,
    EditorMenuBar,
  },
  data() {
    return {
      tempTitle: '',
      isEdited: false,
      itemId: '',
      columnId: '',
      editor: new Editor({
        extensions: [
          new ListItem(),
          new BulletList(),
          new Blockquote(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Underline(),
          new History(),
          new TrailingNode({
            node: 'paragraph',
            notAfter: ['paragraph'],
          }),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'Write something …',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true,
          }),
        ],
        onUpdate: val => (this.isEdited = true),
      }),
    };
  },
  methods: {
    setContent() {
      const { 0: columnId, 1: itemId } = this.$route.params.id.split('&');
      const item = this.$store.getters['items/getItemById'](columnId, itemId);

      if (typeof item === 'undefined') return this.$router.push('/board');

      this.tempTitle = item.title;
      this.itemId = itemId;
      this.columnId = columnId;
      this.editor.setContent(item.content);
      this.editor.focus();
    },
    updateNote() {
      this.$store.dispatch('items/update', {
        id: this.itemId,
        columnId: this.columnId,
        data: {
          title: this.tempTitle,
          content: this.editor.getHTML(),
        },
      });
      this.isEdited = false;
    },
  },
  watch: {
    '$route.params'() {
      this.setContent();
    },
    tempTitle() {
      this.isEdited = true;
    },
  },
  mounted() {
    this.setContent();
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>
