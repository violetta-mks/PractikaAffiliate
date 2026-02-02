export var img = {
    props: {
        modelValue: [String, File, null]
    },
    emits: ['update:modelValue'],

    data() {
        return {
            value: null,
            parent: null
        }
    },

    mounted() {
        this.parent = this.$parent.$parent.$parent.$parent;
        this.syncValue(this.modelValue);
    },

    watch: {
        modelValue(val) {
            this.syncValue(val);
        }
    },

    methods: {
        syncValue(val) {
            // уже загруженное изображение (строка)
            if (typeof val === 'string' && val) {
                this.value = this.parent.url + '/' + val;
            }
            // новый файл
            else if (val instanceof File) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.value = reader.result;
                };
                reader.readAsDataURL(val);
            }
            // пусто
            else {
                this.value = null;
            }
        },

        change(e) {
            const file = e.target.files[0];
            if (!file) return;
            this.$emit('update:modelValue', file);
        }
    },

    template: `
        <div class="image-preview-area">
            <a href="#" class="select_img" @click.prevent="$refs.input.click()">
                <img
                    v-if="value"
                    :src="value"
                    class="im"
                />
                <img
                    v-else
                    :src="parent.url + '/app/views/images/placeholder.png'"
                />
            </a>

            <input
                ref="input"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                @change="change"
                style="display:none"
            >
        </div>
    `
};
