export const campaigns = {
    data() {
        return {
            parent: "",
        };
    },

    mounted() {
        this.parent = this.$parent.$parent;

        if (!this.parent.user || !this.parent.user.auth) {
            this.parent.page('/');
        }
    },

    methods: {
        goBack() {
            this.parent.logout(); 
        }
    },

    template: `
        <div class="campaigns-page">
            <h2>Campaigns</h2>
            <button class="back-btn" @click="goBack">← Back</button>
        </div>
    `
};
