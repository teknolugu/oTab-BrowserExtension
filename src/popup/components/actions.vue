<template>
	<div class="actions-container">
		<el-button type="primary" @click="currentTab" size="medium" icon="el-icon-plus" :disabled="!isUrl">Add Current Tab</el-button>
	</div>
</template>
<script>
import Bus from '../bus'
export default {
	props: {
		isUrl: {
			type: Boolean,
			default:false
		}
	},
	data: () => ({
		index: '',
	}),
	methods: {
		currentTab(){
			this.$browser.tabs.query({active: true, currentWindow: true}).then(tab => {
				let payload = {
					title: tab[0].title,
					url: tab[0].url,
					favIconUrl: tab[0].favIconUrl
				}
				this.$store.commit('collections/addTab', {collectionIndex: this.index, payload})
			})
		},
	},
	async created(){
		Bus.$on('changeIndex', (index) => this.index = index)
	},
}
</script>
<style lang="scss">
.actions-container{
	button{
		width: 100%;
	}
	padding: 9px 15px;
}
</style>