<template>
  <div class="h-full overflow-y-auto px-5 scrollbar">
    <p class="font-medium text-lg inline-block text-gray-600">Boards</p>
    <template v-for="setting in boardSettings">
      <card-ui
        class="flex items-center mt-3 first:mt-0 cursor-pointer relative"
        hover
        :class="{ 'shadow-lg text-blue-500': setting.id === activeSetting }"
        @click="activeSetting = setting.id"
      >
        <unicon :name="setting.icon" class="p-1" height="20" width="20"></unicon>
        <p class="text-base capitalize ml-3">{{ setting.name }}</p>
        <div class="absolute h-5 w-1 bg-blue-500 right-0 mr-3 rounded-full" v-if="setting.id === activeSetting"></div>
      </card-ui>
    </template>
  </div>
</template>
<script>
export default {
  data: () => ({
    boardSettings: [
      { name: 'your boards', id: 'your_boards', icon: 'apps' },
      { name: 'shared boards', id: 'shared_boards', icon: 'share-alt' },
    ],
    activeSetting: 'your_boards',
  }),
};
</script>
