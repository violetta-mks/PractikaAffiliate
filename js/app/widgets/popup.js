export const popup = {
  props: {
    title: String,
    fullscreen: Boolean
  },
  data() {
    return {
      active: 0
    };
  },
  template: `
    <template v-if="active === 1">
      <div class="popup-back" @click="active = 0"></div>

      <div class="popup" :class="{ fullscreen }">
        <div class="head-popup">
          <div class="head-title">{{ title }}</div>
          <a href="#" @click.prevent="active = 0">
            <i class="fas fa-window-close"></i>
          </a>
        </div>

        <div class="popup-inner">
          <slot />
        </div>
      </div>
    </template>
  `
};
