<template>
  <v-bottom-sheet inset v-model="sheet">
    <v-sheet class="select-theme" :height="type === 'photos' ? '250px' : '350px'">
      <div class="dropper background" @dragover.prevent @drop="onDrop" v-show="type === 'my gallery'">
        <label class="dropper__label">
          <span class="content">SELECT OR DROP AN IMAGE HERE</span>
          <input type="file" name="image" @change="onChange" />
        </label>
      </div>
      <v-divider></v-divider>
      <div class="select-theme-category px-6 pt-7 pb-3" style="position: relative;">
        <v-icon class="sheet-close-button" @click="sheet = false">{{ $icons.mdiClose }}</v-icon>
        <div class="theme-filter d-flex justify-start">
          <div class="filter-wrapper">
            <span class="body-2 mr-2 grey--text">Type: </span>
            <v-select :items="backgroundTypes" v-model="type" hide-details outlined></v-select>
          </div>
          <div class="filter-wrapper ml-5" v-show="type === 'photos'">
            <span class="body-2 mr-2 grey--text">Category: </span>
            <v-select :items="photoCategories" v-model="category" hide-details outlined></v-select>
          </div>
        </div>
      </div>
      <v-slide-group class="px-2 py-4" active-class="success" show-arrows>
        <template v-for="(image, index) in backgrounds">
          <v-slide-item :value="image.url" @click.native="setBackground(image)">
            <div class="pa-1 background  ml-2 theme-image-card" :class="{ 'is-active': activeImage === image.url }">
              <img :src="checkUrl(image.url)" />
              <v-icon v-show="type === 'my gallery'" class="close-icon white--text" @click.stop="deleteGallery(index)">{{ $icons.mdiClose }}</v-icon>
            </div>
          </v-slide-item>
        </template>
      </v-slide-group>
      <div style="min-height: 13px">
        <p v-show="type === 'photos'" class="body-2 my-0 text-right grey--text caption mr-7">
          All Photos is from <a class="primary--text" href="https://pexels.com" target="_blank">Pexels</a>
        </p>
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>
<script>
import { backgrounds } from '../../../assets/default-data.json';

export default {
  props: {
    activator: Boolean,
  },
  watch: {
    activator() {
      this.sheet = true;
    },
  },
  data: () => ({
    sheet: false,
    myGallery: [],
    imageSize: '?auto=compress&cs=tinysrgb&dpr=2&h=492&w=328',
    type: 'photos',
    category: 'all',
    backgroundTypes: ['photos', 'my gallery'],
    photoCategories: ['all', 'space', 'mountain', 'city', 'nature', 'sky'],
  }),
  methods: {
    setBackground(image) {
      this.$store.commit('settings/change', { key: 'homeBackground', value: image });
      this.$browser.storage.sync.set({ oTabSettings: this.$store.state.settings.items });
      if (!this.myGallery.some(gallery => gallery.url === image.url)) {
        this.myGallery.push(image);
        this.$browser.storage.local.set({ myGallery: this.myGallery });
      }
    },
    async deleteGallery(index) {
      this.myGallery.splice(index, 1);
      this.$browser.storage.local.set({ myGallery: this.myGallery });
    },
    onDrop(event) {
      event.stopPropagation();
      event.preventDefault();
      const { files } = event.dataTransfer;
      this.createFile(files[0]);
    },
    checkUrl(url) {
      return url.slice(0, 4) === 'http' ? url + this.imageSize : url;
    },
    onChange(event) {
      const { files } = event.target;
      this.createFile(files[0]);
    },
    async createFile(file) {
      if (!file.type.match('image.*')) {
        this.$dialog.notify.error('Select an image');
        return;
      }
      const dataUrl = await new Promise((resolve, reject) => {
        const image = new Image();
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      this.myGallery.push({
        url: dataUrl,
        author: '',
      });
      this.$browser.storage.local.set({ myGallery: this.myGallery });
    },
  },
  computed: {
    activeImage() {
      return this.$store.state.settings.items.homeBackground.url;
    },
    backgrounds() {
      if (this.type === 'photos') {
        return this.category === 'all' ? backgrounds : backgrounds.filter(background => background.category.some(item => item === this.category));
      }
      return this.myGallery;
    },
  },
  async created() {
    const gallery = await this.$browser.storage.local.get('myGallery');
    if (gallery.myGallery.length >= 1 && typeof gallery.myGallery[0].url === 'undefined') {
      this.$browser.storage.local.remove('myGallery');
      this.$browser.storage.local.set({ myGallery: [] });
    } else {
      this.myGallery = gallery.myGallery;
    }
  },
};
</script>
<style lang="scss">
.dropper {
  width: 100%;
  height: 100px;
  border-radius: 4px;
  &__label {
    cursor: pointer;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .content {
      padding: 10px 15px;
      border-radius: 2px;
      background-color: #409eff;
      color: white;
    }
    input {
      display: none;
    }
  }
}
.select-theme {
  transition: all 0.2s ease;
}
.sheet-close-button {
  position: absolute;
  right: 30px;
  top: 20px;
}
.theme-filter {
  .filter-wrapper {
    display: inline-block;
    .v-input {
      display: inline-block;
      width: 150px;
      &__append-inner {
        margin-top: 2px !important;
      }
      .v-select__selections {
        padding: 0 !important;
      }
      &__control {
        height: 30px;
      }
      &__slot {
        text-transform: capitalize;
        font-size: 14px;
        min-height: 0px !important;
      }
    }
  }
}
.theme-image-card {
  position: relative;
  .close-icon {
    font-size: 20px;
    top: 7px;
    position: absolute;
    right: 10px;
    visibility: hidden;
    opacity: 0;
    transition: all 0.4s ease;
  }
  cursor: pointer;
  img {
    height: 100px;
    width: 170px;
    transition: all 0.2s ease;
  }
  &.is-active {
    &.background {
      background-color: #409eff !important;
    }
  }
  &:hover {
    .close-icon {
      opacity: 1;
      visibility: visible;
    }
    img {
      filter: brightness(0.7);
      transform: scale(1.02);
    }
  }
  &,
  .theme-image {
    border-radius: 5px;
  }
  .theme-image {
    img {
      filter: brightness(0.8);
    }
  }
}
</style>
