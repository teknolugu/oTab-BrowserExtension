// import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import VuetifyDialog from 'vuetify-dialog';
import 'vuetify-dialog/dist/vuetify-dialog.css';

import Vuetify, { VCard, VCardTitle, VCardText, VCardActions, VSpacer, VAlert, VDialog, VIcon, VBtn } from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify, {
  components: {
    VAlert,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VSpacer,
    VDialog,
    VIcon,
    VBtn,
  },
});

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    themes: {
      light: {
        primary: '#409eff',
        secondary: colors.cyan.darken1,
        accent: colors.yellow,
        error: colors.red.lighten1,
        background: colors.grey.lighten4,
        background2: colors.grey.lighten3,
        background3: '#f7f7f7',
      },
      dark: {
        background: colors.grey.darken2,
        background2: colors.grey.darken3,
        background3: '#343434',
      },
    },
  },
});

Vue.use(VuetifyDialog, {
  context: {
    vuetify,
  },
});

export default vuetify;
