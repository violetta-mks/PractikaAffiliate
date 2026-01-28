export const header = {
    data() {
        return {
            user: {},
            parent: "",
            active: 0,
            menu: 0
        };
    },

    mounted() {
        this.parent = this.$parent.$parent;
    },

    methods: {
    },

    template: `
        <header class="header">
            <msg ref = "msg" />
        </header>
    `
};
