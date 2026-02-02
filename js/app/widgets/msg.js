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
        },

        confirmFun(title, text) {
            this.code = 0;
            var self = this;

            return new Promise(function (resolve, reject) {
                self.confirmTitle = title;
                self.confirm = text;
                self.$refs.confirm.active = 1;

                self.interval = setInterval(function () {
                    if (self.code > 0) resolve();
                }, 100);
            }).then(function () {
                clearInterval(self.interval);
                self.$refs.confirm.active = 0;

                if (self.code == 1) {
                    return true;
                }

                if (self.code == 2) {
                    return false;
                }
            });
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

        <popup ref="confirm" :title="confirmTitle">
            <div class="al">
                <i class="fas fa-info-circle"></i> {{ confirm }}

                <div class="botBtns">
                    <a class="btnS" href="#" @click.prevent="code = 1">Yes</a>
                    <a class="btnS" href="#" @click.prevent="code = 2">No</a>
                </div>
            </div>
        </popup>

    `
};
