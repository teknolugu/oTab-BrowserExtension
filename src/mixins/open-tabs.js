export default {
	data: () => ({
		openTabs: [],
	}),
	methods: {
		async allTabs() {
            try {
                let tabs = await this.$browser.tabs.query({});
                const regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                let allTabs = tabs.map(({ title, url, favIconUrl, id }) => ({ title, url, favIconUrl, id })).filter(tab => regex.test(tab.url) === true);
                return allTabs;
            } catch (err) {
                return err;
            }
        },
	},
	mounted() {
        this.allTabs().then(allTabs => (this.openTabs = allTabs));
        this.$browser.tabs.onUpdated.addListener(async (id, info, tab) => {
            if (info.status === 'complete') {
                this.openTabs = await this.allTabs();
            }
        });
        this.$browser.tabs.onRemoved.addListener(id => {
            let index = this.openTabs.findIndex(tab => tab.id === id);
            this.openTabs.splice(index, 1);
        });
    },
}