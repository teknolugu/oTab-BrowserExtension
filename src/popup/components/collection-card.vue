<template>
    <div class="collection-card-container">
    	<template v-for="(collection, index) in collectionList">
        	<div class="collection-card" :class="{'active-collection': getId(collection.title, index) === activeCollection}" @click="changeActive(collection.title, index)" v-show="filterSearch(collection.title)">
        	    <p class="title">{{collection.title}}</p>
        	    <div class="info">
        	        <span class="length">{{collection.tabs.length}} Tabs</span>
                <el-button size="mini" type="primary" :disabled="collection.tabs.length === 0" @click="openAllTabs(collection.tabs)">Open all</el-button>
        	    </div>
        	</div>
        </template>
    </div>
</template>
<script>
import Bus from '../bus'
export default {
    props: ['search'],
    watch: {
    	activeCollection(value){
    		Bus.$emit('changeIndex', value[value.length -1])
    	},
    },
    data: () => ({
        activeCollection: '',
    }),
    computed: {
    	collectionList(){
    		return this.$store.getters['collections/list']
    	},
    },
    methods: {
    	filterSearch(name){
    		return name.toLowerCase().match(this.$props.search.toLowerCase())
    	},
    	changeActive(name, index){
    		this.activeCollection = this.getId(name, index)
    	},
    	getId(name, index){
    		let id = name.toLowerCase().replace(/ /g, '_') + index
    		return id
    	},
        openAllTabs(tabs) {
            tabs.forEach(async (tab) => await this.$browser.tabs.create({url: tab.url}))
        },
    },
    mounted(){
    	setTimeout(() => {
    		this.changeActive(this.collectionList[0].title, 0)
    	}, 500)
    },
    created(){
    	Bus.$on('changeBoard', () => this.changeActive(this.collectionList[0].title, 0))
    },
}
</script>
<style lang="scss">
.collection-card-container{
    padding: 0 15px;
}
.collection-card {
    transition: all .3s ease;

    &.active-collection {
        border: 1px solid #409eff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    cursor: pointer;
    padding: 13px 15px;
    border: 1px solid #00000038;
    border-radius: 4px;
    margin-top: 9px;

    &:first-child {
        margin-top: 0px;
    }

    .title {
        font-size: 14px;
        display: inline-block;
        text-transform: capitalize;
        margin: 0;
    }

    .info {
        margin-top: -6px;

        .length {
            margin-bottom: 3px;
            text-align: center;
            color: #909399;
            font-size: 12px;
        }

        button {
            font-size: 11px;
            padding: 3px 5px !important;
        }

        display: inline-block;
        float: right;

        * {
            display: block;
        }
    }
}
</style>