<template>
  <v-popover :placement="placement" offset="5" @hide="clearAll" open-group="label" v-bind="$attrs">
    <slot></slot>
    <template slot="popover">
      <card-ui class="shadow-xl" width="250px">
        <div class="flex items-center mb-4 pb-2 border-b text-default text-base">
          <template v-if="addLabelSection">
            <button-icon icon="angle-left" small size="24" @click="(search = ''), (addLabelSection = false)"></button-icon>
            <p class="font-medium ml-2">{{ editLabel ? 'Update label' : 'Create label' }}</p>
          </template>
          <p v-else class="font-medium">Labels</p>
          <div class="flex-grow"></div>
          <button-icon icon="multiply" small size="18" v-close-popover></button-icon>
        </div>
        <input-ui v-model="search" input-style="background" :icon="inputStyle.icon" class="w-full text-sm text-default" :placeholder="inputStyle.placeholder" autofocus></input-ui>
        <template v-if="addLabelSection">
          <p class="font-medium text-sm text-default-soft mt-4">Colors</p>
          <div class="colors flex flex-wrap">
            <template v-for="color in $store.state.ui.labelColors">
              <div
                @click="labelColor = color"
                class="h-10 w-10 inline-block rounded hover:brightness p-2 mt-2 ml-2 transition-all duration-200 ease-in-out cursor-pointer"
                :style="{ backgroundColor: color }"
                :class="{ 'shadow-xl': labelColor === color }"
              >
                <unicon name="check" class="text-inverse block" v-show="labelColor === color"></unicon>
              </div>
            </template>
          </div>
          <div class="mt-5">
            <div class="flex items-center" v-if="editLabel">
              <button-icon square icon="trash" color="red" class="text-red" @click="deleteLabel"></button-icon>
              <button-ui class="ml-2 flex-grow" w-full @click="updateLabel" :disabled="!search || !labelColor">Update label</button-ui>
            </div>
            <template v-else>
              <button-ui block @click="addLabel" :disabled="!search || !labelColor">Create label</button-ui>
            </template>
          </div>
        </template>
        <template v-else>
          <scrollbar class="labels mt-4" style="max-height: 230px">
            <template v-for="label in filteredLabels">
              <div class="h-10 mt-2 cursor-pointer first:mt-0 flex items-center">
                <div
                  class="h-10 label flex text-inverse w-10/12 text-base overflow-hidden"
                  :style="{ backgroundColor: label.color, borderRadius: '7px' }"
                  :class="{ 'is-active': validate(label) }"
                  @click="emitLabel(label)"
                >
                  <div class="py-2 px-1 label-active">
                    <unicon name="check"></unicon>
                  </div>
                  <span class="text-overflow py-2 ml-4 label-text">{{ label.name }}</span>
                </div>
                <button-icon icon="pen" @click="setEditLabel(label)" size="20" class="ml-1 text-default-soft"></button-icon>
              </div>
            </template>
          </scrollbar>
          <button-ui type="text" @click="addLabelSection = true" size="small" block v-if="!!search && filteredLabels.length === 0">
            Create <b>{{ search }}</b> as label
          </button-ui>
          <button-ui @click="(addLabelSection = true), (search = '')" class="text-left mt-4" block type="text" size="small" v-else>
            Create new label
          </button-ui>
        </template>
      </card-ui>
    </template>
  </v-popover>
</template>
<script>
import scrollbar from 'vue-perfect-scrollbar';

export default {
  components: { scrollbar },
  props: {
    value: {
      type: [Array, String],
    },
    placement: {
      type: String,
      default: 'left-start',
    },
  },
  data: () => ({
    search: '',
    addLabelSection: false,
    editLabel: false,
    labelColor: '',
    id: '',
  }),
  computed: {
    labels() {
      return this.$store.getters['labels/getLabelsByBoardId']();
    },
    filteredLabels() {
      return this.labels.filter(label => {
        return label.name.match(this.search);
      });
    },
    inputStyle() {
      return this.addLabelSection
        ? {
            icon: 'label-alt',
            placeholder: 'Label name',
          }
        : {
            icon: 'search',
            placeholder: 'Search label',
          };
    },
  },
  watch: {
    addLabelSection(value) {
      if (!value) this.clearAll();
    },
  },
  methods: {
    emitLabel(label) {
      if (Array.isArray(this.value)) {
        const indexOfLabel = this.value.indexOf(label.id);
        const copyValue = [...this.value];

        indexOfLabel !== -1 ? copyValue.splice(indexOfLabel, 1) : copyValue.push(label.id);
        this.$emit('input', copyValue);
      } else if (typeof this.value === 'string') {
        if (this.value === label.id) this.$emit('input', '');
        else this.$emit('input', label.id);
      }
    },
    updateLabel() {
      this.$store.dispatch('labels/update', {
        id: this.id,
        data: {
          name: this.search,
          color: this.labelColor,
        },
      });
      this.clearAll();
    },
    deleteLabel() {
      this.$store.dispatch('labels/delete', this.id);
      this.clearAll();
    },
    validate(label) {
      if (Array.isArray(this.value)) return this.value.includes(label.id);
      if (typeof this.value === 'string') return label.id === this.value;
    },
    setEditLabel({ name, color, id }) {
      this.addLabelSection = true;
      this.editLabel = true;
      this.labelColor = color;
      this.search = name;
      this.id = id;
    },
    addLabel() {
      this.$store.dispatch('labels/add', {
        name: this.search,
        color: this.labelColor,
      });
      this.clearAll();
    },
    clearAll() {
      this.search = this.id = this.labelColor = '';
      this.addLabelSection = this.editLabel = false;
    },
  },
};
</script>
<style>
.label:hover .label-text {
  transform: translateX(0);
  @apply ml-2;
}
.label:hover .label-active {
  transform: translateX(0);
}
.label.is-active .label-text,
.label.is-active .label-active {
  transform: translateX(0);
}
.label-active {
  background-color: rgba(0, 0, 0, 0.06);
}
.label-active,
.label-text {
  transform: translateX(-40px);
  transition: all 0.2s ease;
}
</style>
