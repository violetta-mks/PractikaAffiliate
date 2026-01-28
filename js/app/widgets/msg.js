export const msg = {
    data() {
        return {
            alert: "",
            success: "",
            t1: null,
            t2: null,
            code: 0,
            parent: null
        };
    },

    mounted() {
        this.parent = this.$parent;
    },

    methods: {
        fadeIn(el, timeout, display) {
            if (!el) return;
            el.style.opacity = 0;
            el.style.display = display || 'block';
            el.style.transition = `opacity ${timeout}ms`;

            setTimeout(() => {
                el.style.opacity = 1;
            }, 10);
        },

        fadeOut(el, timeout) {
            if (!el) return;
            el.style.opacity = 1;
            el.style.transition = `opacity ${timeout}ms`;
            el.style.opacity = 0;

            setTimeout(() => {
                el.style.display = 'none';
            }, timeout);
        },

        successFun(msg) {
            this.success = msg;
            const self = this;

            const block = document.querySelector('.successMsg');
            if (!block) return;

            clearTimeout(self.t1);
            clearTimeout(self.t2);

            self.t1 = setTimeout(() => {
                self.fadeIn(block, 1000);

                self.t2 = setTimeout(() => {
                    self.fadeOut(block, 1000);
                }, 3000);

            }, 100);
        },

        alertFun(msg) {
            this.alert = msg;
            const self = this;

            const block = document.querySelector('.alertMsg');
            if (!block) return;

            block.style = "";

            clearTimeout(self.t1);
            clearTimeout(self.t2);

            self.t1 = setTimeout(() => {
                self.fadeIn(block, 1000);

                self.t2 = setTimeout(() => {
                    self.fadeOut(block, 1000);
                }, 3000);

            }, 100);
        }
    },

    template: `
        <div>
            <div class="alertMsg" v-if="alert">
                <div class="wrapper al">
                    <i class="fas fa-times-circle"></i> {{ alert }}
                </div>
            </div>

            <div class="successMsg" v-if="success">
                <div class="wrapper al">
                    <i class="fas fa-check-circle"></i> {{ success }}
                </div>
            </div>
        </div>
    `
};
