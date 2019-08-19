<template>
  <div class="home-settings">
    <div class="background-filters">
      <div class="select-type">
        <span class="select-label">Type: </span>
        <el-select v-model="type" size="small">
          <el-option class="capitalize" v-for="type in backgroundTypes" :key="type" :value="type" :label="type"></el-option>
        </el-select>
      </div>
      <div class="select-category" v-if="type === 'photos'">
        <span class="select-label">Categories: </span>
        <el-select v-model="category" size="small">
          <el-option class="capitalize" v-for="category in photoCategories" :key="category" :value="category" :label="category"></el-option>
        </el-select>
      </div>
      <div class="limit-storage" v-else>
        <div class="bar" :style="{ width: storageLimit }"></div>
      </div>
    </div>
    <div class="home-settings__content">
      <transition name="slide-fade-left" mode="out-in">
        <div class="type-photos" v-if="type === 'photos'">
          <template v-for="image in backgrounds">
            <div class="image-card" @click="setBackground(image)">
              <i class="el-icon-circle-check image-checked" :class="{ 'is-active': image.url === $store.state.settings.items.homeBackground.url }"></i>
              <el-image lazy fit="cover" :src="image.url + imageSize"></el-image>
            </div>
          </template>
          <p class="attribution">All Photos from <a href="https://pexels.com" target="_blank">Pexels</a></p>
        </div>
        <div class="my-gallery" v-else>
          <div class="dropper" @dragover.prevent @drop="onDrop">
            <label class="dropper__label">
              <span class="content">SELECT OR DROP AN IMAGE</span>
              <input type="file" name="image" @change="onChange" />
            </label>
          </div>
          <div class="my-gallery__content">
            <template v-for="(image, index) in myGallery">
              <div class="image-card" @click="setBackground(image)">
                <i class="el-icon-circle-check image-checked" :class="{ 'is-active': image.url === $store.state.settings.items.homeBackground.url }"></i>
                <i class="el-icon-circle-close image-delete" @click.stop="deleteGallery(index)"></i>
                <el-image lazy fit="cover" :src="checkUrl(image.url)"></el-image>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { backgrounds } from '../../../assets/default-data.json';
export default {
  props: {
    settings: Object,
  },
  data: () => ({
    storageLimit: 0,
    myGallery: [],
    imageSize: '?auto=compress&cs=tinysrgb&dpr=2&h=492&w=328',
    type: 'photos',
    category: 'all',
    backgroundTypes: ['photos', 'my gallery'],
    photoCategories: ['all', 'space', 'mountain', 'city', 'nature', 'sky'],
  }),
  watch: {
    myGallery: {
      handler(gallery) {
        this.storageUse();
        this.$browser.storage.sync.set({ myGallery: this.myGallery });
      },
      deep: true,
    },
  },
  methods: {
    deleteGallery(index) {
      this.myGallery.splice(index, 1);
    },
    setBackground(image) {
      this.$emit('change', { key: 'homeBackground', value: image });
      if (!this.myGallery.some(gallery => gallery.url === image.url)) {
        this.myGallery.push(image);
      }
    },
    onDrop(event) {
      event.stopPropagation();
      event.preventDefault();
      let files = event.dataTransfer.files;
      this.createFile(files[0]);
    },
    checkUrl(url) {
      return url.slice(0, 4) === 'http' ? url + this.imageSize : url;
    },
    onChange(event) {
      let files = event.target.files;
      this.createFile(files[0]);
    },
    storageUse() {
      this.$browser.storage.sync.getBytesInUse('myGallery').then(used => {
        this.storageLimit = parseFloat((used / (1024 * 1024)).toFixed(2)) / 5;
      });
    },
    async createFile(file) {
      if (!file.type.match('image.*')) {
        this.$message.error('Select an image');
        return;
      }
      let dataUrl = await new Promise((resolve, reject) => {
        const image = new Image();
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      this.myGallery.push({
        url: dataUrl,
        author: '',
      });
    },
  },
  computed: {
    backgrounds() {
      if (this.category === 'all') {
        return backgrounds;
      } else {
        return backgrounds.filter(background => background.category.some(item => item === this.category));
      }
    },
  },
  async created() {
    this.storageUse();
    const gallery = await this.$browser.storage.sync.get('myGallery');
    this.myGallery = gallery.myGallery;
  },
};
</script>
<style lang="scss">
@import '../../../assets/themes/themes';
@import '../../../assets/slide-transitions';

@include slideTransition(left, -10px, 0.3s);

.limit-storage {
  @include themify($themes) {
    background-color: themed('bg-color2');
  }
  border-radius: 30px;
  .bar {
    border-radius: 30px;
    height: 10px;
    background-color: #409eff;
  }
  width: 250px;
}

.my-gallery {
  &__content {
    margin-top: 12px;
  }
}

.dropper {
  width: 100%;
  height: 100px;
  @include themify($themes) {
    border: 2px dashed themed('light-border');
    background-color: themed('bg-color');
  }
  &:hover {
    @include themify($themes) {
      background-color: themed('bg-color2');
    }
  }
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

.attribution {
  font-size: 13px;
  margin-left: 12px;
  margin-top: 0;

  @include themify($themes) {
    color: themed('text-secondary');
  }
}

.background-filters {
  margin-bottom: 24px;

  div {
    display: inline-block;
  }

  .select-type,
  .select-category {
    input {
      text-transform: capitalize;
    }
  }

  .select-type {
    margin-right: 12px;
  }

  .select-label {
    margin-right: 6px;
  }
}

.image-card {
  margin: 5px;
  width: 30%;
  transition: all 0.2s ease;
  padding: 3px;
  border-radius: 2px;
  position: relative;
  display: inline-block;

  .image-checked {
    &.is-active {
      color: #409eff;
      visibility: visible;
      opacity: 1;
    }

    z-index: 2;
    color: white;
    background: unset;
    position: absolute;
    font-size: 18px;
    left: 10px;
    top: 10px;
    visibility: hidden;
    opacity: 0;
  }
  .image-delete {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 2;
    color: #f56c6c;
    font-size: 18px;
    cursor: pointer;
  }
  .el-image {
    height: 110px;
    transform: translateZ(0);
    width: 100%;
    backface-visibility: hidden;
  }

  @include themify($themes) {
    background-color: themed('bg-color2');
  }

  &:hover {
    .image-checked {
      visibility: visible;
      opacity: 1;
    }

    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transform: scale(1.01);

    .el-image {
      filter: brightness(0.8);
    }
  }

  img {
    border-radius: 2px;
  }
}
</style>
