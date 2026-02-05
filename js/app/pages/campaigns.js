export const campaigns = {
    data() {
        return {
            parent: "",
            data:{},
            details: {},
            date:"",
            date2:"",
            q:"",
            sort:"",
            loader: 1,
            iChart: -1,
            id:0,
            type:0,
            all:true
        }
    },

    mounted() {
        this.parent = this.$parent.$parent;

        if (!this.parent.user || !this.parent.user.auth) {
            this.parent.page('/');
        }

        this.get();
        // this.GetFirstAndLastDate();
    },

    methods: {
        GetFirstAndLastDate:function(){
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var firstDayOfMonth= new Date(year, month, 2);
            var lastDayOfMonth= new Date(year, month+1, 1);
            this.date = firstDayOfMonth.toISOString().substring(0, 10);
            this.date2 = lastDayOfMonth.toISOString().substring(0, 10);
        },
        drawChart() {
            if (this.iChart === -1) return;
            this.$nextTick(() => {
            this.line(this.data.items[this.iChart]);
            });
        },
        get:function(){
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
            if(this.date!="") data.append('date', this.date);
            if(this.date2!="") data.append('date2', this.date2);
            self.loader=1;
            axios.post(this.parent.url+"/site/getCampaigns?auth="+this.parent.user.auth,data).then(function(response) {
                self.data = response.data;
                if (!Array.isArray(self.data.items)) self.data.items = [];
                self.loader = 0;
            }).catch(function(error){
                self.parent.logout();
            });
        },

        getDetails:function(campaign=false,type=false){
			this.details = {};
			if(campaign) this.id=campaign;
			if(type) this.type=type;
			if(this.id) campaign=this.id;
			if(this.type) type=this.type;		
			var self = this;
			var data = self.parent.toFormData(self.parent.formData);
			if(this.date!="") data.append('date',this.date);
			if(this.date2!="") data.append('date2',this.date2);
			if(this.q!="") data.append('q',this.q);
			if(this.sort!="") data.append('sort',this.sort);
			if(campaign!="") data.append('campaign',campaign);
			if(type!="") data.append('type',type);
			self.loader=1;
			axios.post(this.parent.url+"/site/getStatisticsDetails?auth="+this.parent.user.auth,data).then(function(response){
				self.details = response.data;		
				self.loader = 0;		
			}).catch(function(error){
				console.log(error);
				self.parent.logout();
			});				
		},	

        getCampaignChart() {
            const self = this;
            const data = self.parent.toFormData(self.parent.formData);

            if (this.date) data.append('date', this.date);
            if (this.date2) data.append('date2', this.date2);

            self.loader = 1;

            axios.post(self.parent.url + "/site/getCampaignChart?auth=" + self.parent.user.auth, data).then(res => {
                const item = res.data.items;

                    console.log('Chart API response:', res.data);
                    console.log('Totals from API:', {
                        views: item?.views,
                        clicks: item?.clicks,
                        leads: item?.leads
                    });
                if (!item) return;

                let totalViews = 0;
                let totalClicks = 0;
                let totalLeads = 0;

                for (const date in item.line) {
                    const row = item.line[date];

                    totalViews  += Number(row.views || 0);
                    totalClicks += Number(row.clicks || 0);
                    totalLeads  += Number(row.leads || 0);
                }


                self.parent.formData.views  = totalViews;
                self.parent.formData.clicks = totalClicks;
                self.parent.formData.leads  = totalLeads;

                self.parent.formData.line  = item.line;
                self.parent.formData.sites = item.sites;

                self.line(item);
                self.loader = 0;
            });
        },

        action: function(){
            var self = this;
            self.parent.formData.copy = "";
            var data = self.parent.toFormData(self.parent.formData);
            axios.post(this.parent.url+"/site/actionCampaign?auth="+this.parent.user.auth,data).then(function(response){
            self.$refs.new.active=0;
            if(self.parent.formData.id){
                self.$refs.header.$refs.msg.successFun("Successfully updated campaign!");
            }else{
                self.$refs.header.$refs.msg.successFun ("Successfully added new campaign!");
            }
            self.get();
            }).catch(function(error) {
                console.log('errors: ', error);
            });
        },

        del:async function(){
            if(await this.$refs.header.$refs.msg.confirmFun ("Please confirm next action", "Do you want to delete this campaign?")){
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);

                axios.post(this.parent.url+"/site/deleteCampaign?auth="+this.parent.user.auth, data).then(function(response){
                    if (response.data.error){
                        self.$refs.header.$refs.msg.alertFun(response.data.error);
                    }else{
                        self.$refs.header.$refs.msg.successFun("Successfully deleted campaign!");
                        self.get();
                    }
                }).catch(function(error){
                    console.log('errors: ', error);
                    self.$refs.header.$refs.msg.alertFun("Server error!");
                });
            }
        },

		line:function(item){
            if(!item) return;
			setTimeout(function(){
				let dates = [];
				let clicks = [];
				let views = [];
				let leads = [];
				if(item && item['line']){
					for(let i in item['line']){
						dates.push(i);
							clicks.push(item['line'][i].clicks);
							views.push(item['line'][i].views);
							leads.push(item['line'][i].leads);
					}
				}			

				document.getElementById('chartOuter').innerHTML = '<div id="chartHints"><div class="chartHintsViews">Views</div><div class="chartHintsClicks">Clicks</div></div><canvas id="myChart"></canvas>';
				const ctx = document.getElementById('myChart');
				const xScaleImage = {
					id:"xScaleImage",
					afterDatasetsDraw(chart,args,plugins){
						const {ctx,data, chartArea:{bottom}, scales:{x}} = chart;
						ctx.save();
						data.images.forEach((image,index) => {
							const label = new Image();
							label.src = image;
							
							const width = 120;
							ctx.drawImage(label,x.getPixelForValue(index)-(width/2 ),x.top,width,width);
						});
					}
				}
				new Chart(ctx, {
					type: 'line',					
					data: {
						labels: dates,
						datasets: [
							{
								label: "Clicks",
								backgroundColor: "#00599D",
								borderColor: "#00599D",
								data: clicks
							},
							{
								label: "Views",
								backgroundColor: "#5000B8",
								borderColor: "#5000B8",
								data: views,
							},
						]
					},				
					options: {
						responsive: true,
						plugins:{
							tooltip: {
								bodyFontSize: 20,
								usePointStyle:true,
								callbacks: {
									title: (ctx) => {						
									  return ctx[0]['dataset'].label
									},
								}
							},														
							legend:{
								display:false
							}
						},					
						categoryPercentage :0.2,
						barPercentage: 0.8,
						scales:{	
							y: {
								id: 'y2',
								position: 'right'
							},								
							x:{
								afterFit: (scale) => {
									scale.height = 120;
								}
							}
						}
					},
									
				});
			},100);
		},
		checkAll:function(prop){	
			if(this.parent.formData.sites){
				for(let i in this.parent.formData.sites){
					this.parent.formData.sites[i].include = prop;
					
				}
			}
			this.getCampaignChart();
		}				
	},	

    
    template: `
        <div class="inside-content">
        <Header ref = "header" />
            <div id="spinner" v-if="loader"></div>

            <div class="wrapper">
            <div class="flex panel">
                <div class="al">
                    <a class="btnS" href="#" @click.prevent="parent.formData = {}; $refs.new.active = 1">
                        <i class="fas fa-plus"></i> New
                    </a>
                </div>

                <div class="date-range">
                    <input type="date" v-model="date" @change="get()" />
                    <span class="dash">–</span>
                    <input type="date" v-model="date2" @change="get()" />
                </div>

                <div class="al">
                    <h1>Campaigns</h1>
                </div>
            </div>

            <popup ref="chart" :fullscreen="true" title="Chart">
                <div class="flex panel">
                    <div class="w70 al">
                        <div class="flex cubes">
                            <div class="w30 ctr">
                            <div>CTR</div>
                                <span v-if="parent.formData.clicks && parent.formData.views">{{(parent.formData.clicks*100/parent.formData.views).toFixed(2)}} %</span>
								<span v-if="!parent.formData.clicks || !parent.formData.views">0.00 %</span>
                            </div>

                            <div class="w30 leads">
                                <div>Leads</div>
                                {{ parent.formData.leads }}
                            </div>

                            <div class="w30 views">
                                <div>Views</div>
                                {{ parent.formData.views }}
                            </div>

                            <div class="w30 clicks">
                                <div>Clicks</div>
                                {{ parent.formData.clicks }}
                            </div>
                        </div>
                    </div>

                    <div class="date-range">
                        <input type="date" v-model="date" @change="getCampaignChart()" />
                        <span class="dash">–</span>
                        <input type="date" v-model="date2" @change="getCampaignChart()" />
                    </div>
                </div>


                <div class="flex body">
                    <div class="w30 ar filchart">
                        <div class="itemchart ptb10">
                            All
                            <toogle :modelValue="all" @update:modelValue="all=$event;checkAll($event)" />
                        </div>

                        <div class="itemchart ptb10" v-for="s in (parent.formData.sites || [])" :key="s.site">
                            {{ s.site }}                            
                            <toogle :modelValue="s.include" @update:modelValue="s.include=$event;getCampaignChart()" />
                        </div>
                    </div>

                    <div class="w70" id="chartOuter">
                    <div id="chartHints">
                        <div class="chartHintsViews">Views</div>
                        <div class="chartHintsClicks">Clicks</div>
                    </div>
                    <canvas id="myChart"></canvas>
                    </div>
                </div>
            </popup>


			<popup ref="new" :title="(parent.formData && parent.formData.id) ? 'Edit campaign' : 'New campaign'">
				<div class="form inner-form">
					<form @submit.prevent="action()" v-if="parent.formData">
						<div class="row">
							<label>Name</label>
							<input type="text" v-model="parent.formData.title" required>
						</div>
							
						<div class="row">
							<button class="btn" v-if="parent.formData && parent.formData.id">Edit</button>
							<button class="btn" v-if="parent.formData && !parent.formData.id">Add</button>
						</div>							
					</form>
				</div>
			</popup>	


            <div class="table" v-if="!loader && data.items.length">
                <table>
                <thead>
                    <tr>
                    <th class="id">#</th>
                    <th class="id"></th>
                    <th>Title</th>
                    <th class="id">Views</th>
                    <th class="id">Clicks</th>
                    <th class="id">Leads</th>
                    <th class="id">Fraud clicks</th>
                    <th class="actions">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item, i) in data.items" :key="item.id">
                    <td class="id">{{ item.id }}</td>
                    <td class="id">
                        <toogle v-model="item.published" @update:modelValue="parent.formData = { ...item }; action();" />
                    </td>

                    <td>
                        <router-link :to="'/campaign/' + item.id">
                        {{ item.title }}
                        </router-link>
                    </td>

                    <td class="id">
                        <a href="#" @click.prevent="$refs.details.active = 1; getDetails(item.id, 1)">
                        {{ item.views }}
                        </a>
                    </td>

                    <td class="id">
                        <a href="#" @click.prevent="$refs.details.active = 1; getDetails(item.id, 2)">
                        <template v-if="item.clicks">{{ item.clicks }}</template>
                        <template v-else>0</template>
                        </a>
                    </td>

                    <td class="id">
                        <a href="#" @click.prevent="$refs.details.active = 1; getDetails(item.id, 2)">
                        <template v-if="item.leads">{{ item.leads }}</template>
                        <template v-else>0</template>
                        </a>
                    </td>

                    <td class="id">
                        <a href="#" @click.prevent="$refs.details.active = 1; getDetails(item.id, 3)">
                        <template v-if="item.fclicks">{{ item.fclicks }}</template>
                        <template v-else>0</template>
                        </a>
                    </td>

                    <td class="actions">
                        <a href="#" @click.prevent="parent.formData = { ...item }; del();">
                            <i class="fas fa-trash-alt"></i>
                        </a>
                        <a href="#" @click.prevent="parent.formData = { ...item }; iChart = i;$refs.chart.active = 1;getCampaignChart();">
                            <i class="fas fa-chart-bar"></i>
                        </a>
                        <router-link :to="'/campaign/' + item.id">
                            <i class="fas fa-edit"></i>
                        </router-link>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>

            <div class="empty" v-if="!loader && !data.items.length">
                No items
            </div>
            </div>
        </div>
    `
};
