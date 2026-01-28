export const popup = {
    props: ['title', 'fullscreen'],

    data() {
        return {
            active: 0,
            top: '50%',
            left: '50%',
            widthVal: '600px',
            height: 'auto'
        };
    },

    watch: {
        active(n, o) {
            if (n == 1 && !this.fullscreen) {
                const self = this;
                setTimeout(function () {
                    let h = self.$refs.popup.clientHeight / 2;
                    self.top = "calc(50% - " + h + "px)";
                }, 10);
            }

            if (this.fullscreen) {
                this.top = 0;
                this.left = 0;
                this.widthVal = '100%';
                this.height = '100%';
            }
        }
    },

    template: `
        <template v-if="active == 1">
            <div class="popup-back"></div>

            <div class="popup"
                 :style="{
                    top: top,
                    left: left,
                    transform: 'translate(-50%, -50%)',
                    width: widthVal,
                    height: height
                 }"
                 ref="popup">

                <div class="flex head-popup">
                    <div class="w80 ptb20">
                        <div class="head-title">{{ title }}</div>
                    </div>

                    <div class="w20 al ptb20">
                        <a href="#" @click.prevent="active = 0">
                            <i class="fas fa-window-close"></i>
                        </a>
                    </div>
                </div>

                <div class="popup-inner">
                    <slot />
                </div>
            </div>
        </template>
    `
};
