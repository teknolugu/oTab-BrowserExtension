<template>
  <div class="header flex items-center mb-1 cursor-move">
    <input-ui
      v-if="editColumn.active"
      autofocus
      class="text-sm"
      v-model="editColumn.title"
      @keyup.enter="updateColumnTitle"
      @blur="updateColumnTitle"
      style="padding: 3px"
    ></input-ui>
    <p class="text-sm cursor-pointer text-overflow font-medium py-1 rounded px-2 hover:bg-gray-200" @click="editColumn = { active: true, title }" v-else style="max-width: 75%">
      {{ title }}
    </p>
    <div class="flex-grow"></div>
    <v-popover placement="bottom-start" open-group="label" @hide="showLabel = false" :auto-hide="false">
      <button-icon icon="ellipsis-h" small></button-icon>
      <template slot="popover">
        <card-ui class="shadow-xl text-gray-700 absolute" style="padding: 10px 8px; right: -27px;" width="200px">
          <div class="p-2 hover:bg-gray-100 cursor-pointer rounded" v-close-popover @click="deleteColumn">
            <unicon name="trash" height="20" width="20" color="red" class="align-bottom text-red-500"></unicon>
            <p class="text-sm inline-block ml-2">Delete column</p>
          </div>
          <label-ui v-model="columnLabels" placement="right" :show="showLabel">
            <div class="p-2 hover:bg-gray-100 cursor-pointer rounded" style="width: 185px" @click="showLabel = true">
              <unicon name="label-alt" height="20" width="20" class="align-bottom"></unicon>
              <p class="text-sm inline-block ml-2">Labels</p>
            </div>
          </label-ui>
          <div class="p-2 hover:bg-gray-100 cursor-pointer rounded" v-close-popover @click="openAllTabs">
            <unicon name="arrow-up-right" height="20" width="20" class="align-bottom"></unicon>
            <p class="text-sm inline-block ml-2">Open all tabs</p>
          </div>
        </card-ui>
      </template>
    </v-popover>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    columnId: String,
    labels: Array,
    items: Array,
  },
  data: () => ({
    editColumn: {
      active: false,
      title: '',
    },
    showLabel: false,
  }),
  computed: {
    columnLabels: {
      get() {
        return this.labels;
      },
      set(value) {
        this.$store.dispatch('column/update', {
          id: this.columnId,
          data: {
            labels: value,
          },
        });
      },
    },
  },
  methods: {
    updateColumnTitle() {
      if (this.editColumn.title === '') return;
      this.$store.dispatch('column/update', {
        id: this.columnId,
        data: {
          title: this.editColumn.title,
        },
      });
      this.editColumn.active = false;
    },
    openAllTabs() {
      this.items
        .filter(item => item.type === 'tab')
        .forEach(tab => {
          this.$browser.tabs.create({
            url: tab.url,
          });
        });
    },
    deleteColumn() {
      this.$modal.show('delete', {
        title: 'Delete column',
        text: this.title,
        handler: confirm => {
          if (confirm) this.$store.dispatch('column/delete', this.columnId);
        },
      });
    },
  },
};
</script>
<style>
.select-label .unicon.selected {
  transform: translateY(0);
}
.select-label .unicon {
  transition: all 0.2s ease;
  transform: translateY(30px);
}
.select-label:hover .unicon {
  transform: translateY(0);
}
.select-label {
  overflow: hidden;
  cursor: pointer;
}
.select-label:hover {
  filter: brightness(1.1);
}
</style>
