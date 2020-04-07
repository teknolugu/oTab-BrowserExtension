<template>
  <card-ui class="mt-3 hover:shadow-md group relative overflow-visible" :class="{ 'url-card': showUtil, 'shadow-lg': edit }">
    <div class="flex items-center">
      <div class="relative overflow-hidden" v-show="!edit" style="height: 39px">
        <div class="p-2 border rounded-full" v-if="data.favIconUrl">
          <img :src="data.favIconUrl" height="20" width="20" />
        </div>
        <unicon name="globe" class="rounded-full web-icon p-2 border" height="20" width="20" v-else></unicon>
        <a :href="data.url" :target="openInNew">
          <button-icon icon="arrow-up-right" class="open-new-tab top-0 left-0" size="22" v-show="showUtil"></button-icon>
        </a>
      </div>
      <div class="flex-grow pl-2 flex-grow w-8/12 px-2">
        <p class="text-sm font-medium text-overflow" :title="data.title">{{ data.title }}</p>
        <p class="text-xs text-default-soft text-overflow">{{ data.url }}</p>
      </div>
      <template v-if="edit">
        <button-icon icon="multiply" size="18" @click="edit = false"></button-icon>
        <button-icon icon="check" size="26" small color="blue" class="text-primary" @click="updateUrl"></button-icon>
      </template>
      <div v-if="!edit && showUtil" class="-mr-2 top-0 flex flex-col group-hover:visible invisible right-0 absolute">
        <button-icon small icon="pen" class="bg-card shadow mb-1" @click="(edit = true), (tempEdit = { ...data })"></button-icon>
        <button-icon small icon="trash" color="red" class="text-red bg-card shadow" @click="$emit('delete', data.id)"></button-icon>
      </div>
      <unicon v-show="!showUtil" name="grip-horizontal-line" class="fill-current cursor-move text-default-soft handler"></unicon>
    </div>
    <transition enter-class-active="fadeIn" leave-class-active="fadeOut">
      <div class="mt-5" v-if="edit">
        <input-ui class="w-full text-sm" v-model="tempEdit.title" input-style="background" placeholder="Title"></input-ui>
        <input-ui class="w-full mt-3 text-sm" v-model="tempEdit.url" input-style="background" placeholder="URL"></input-ui>
      </div>
    </transition>
  </card-ui>
</template>
<script>
export default {
  props: {
    showUtil: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({
        index: 0,
        favIconUrl: '',
        title: '',
        url: '',
        id: 0,
      }),
    },
  },
  data: () => ({
    edit: false,
    tempEdit: {
      title: '',
      url: '',
    },
  }),
  computed: {
    openInNew() {
      return this.$store.state.settings.openURLInNewTab ? '_blank' : '';
    },
  },
  methods: {
    updateUrl() {
      const { title, url } = this.tempEdit;
      this.$emit('update', {
        id: this.data.id,
        data: {
          title,
          url,
        },
      });
      this.edit = false;
    },
  },
};
</script>
<style lang="scss">
.open-new-tab {
  position: absolute;
  transform: translateY(35px);
}
.url-card {
  img {
    visibility: visible;
  }
}
.url-card:hover img,
.url-card:hover .web-icon svg {
  visibility: hidden;
}
.url-card:hover .open-new-tab {
  transform: translateY(0);
}
</style>
