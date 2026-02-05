export const login = {
    data:function() {
        return{
        img:1,
        parent:''
        }
    },
    mounted:function(){
        this.img = this.randomIntFromInterval(1,7);
        this.parent = this.$parent.$parent;
    },
    methods:{
        randomIntFromInterval:function(min,max){
            return Math.floor(Math.random() * (max-min+1)+min);
        },
        login:function(){
            var self = this;

            var data = self.parent.toFormData(self.parent.formData);

            axios.post(self.parent.url + "/site/login", data)
                .then(function(response){
                    if(response.data.error){
                        self.$refs.msg.alertFun(response.data.error);
                    }

                    if(response.data.user){
                        self.parent.user = response.data.user;
                        window.localStorage.setItem('user', JSON.stringify(response.data.user));
                        self.parent.page('/campaigns');
                    }
                })
                .catch(function(error){
                    console.log('errors : ', error);
                });
        },
    },
template: `
    <div class="flex">
        <msg ref="msg"/>

        <div id="right-area" class="w60">
            <img :src="parent.url+'/app/views/images/Cover_'+img+'.jpg'" />
        </div>

        <div id="left-area" class="w40">
            <div class="auth-header">
                <div class="auth-wrapper auth-flex">
                    <div class="auth-col-60">
                        <h1>Affiliate Sign in</h1>
                    </div>
                    <div class="auth-col-40 auth-logo auth-align-right">
                        <img :src="parent.url+'/app/views/images/logo.svg'" />
                    </div>
                </div>
            </div>


            <div class="form inner-form p20">
                <form @submit.prevent="login()" v-if="parent.formData">
                    <div class="row">
                        <label>Email</label>
                        <input type="email" v-model="parent.formData.email" required placeholder="Email">
                    </div>

                    <div class="row">
                        <label>Password</label>
                        <input type="password" v-model="parent.formData.password" required placeholder="Password">
                    </div>

                    <div class="row">
                        <button class="btn">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

`};
