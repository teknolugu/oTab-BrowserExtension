<template>
    <div id="app">
        <ce-header :isUrl="isUrl" :board="board"></ce-header>
        <el-main>
            <div class="search-form-container">
                <el-input class="search-form" size="medium" prefix-icon="el-icon-search" placeholder="Search collections" v-model="search"></el-input>
            </div>
            <div class="collections-container">
                <el-scrollbar :native="false" class="collections-scroller">
                    <collection-card :search="search">
                    </collection-card>
                </el-scrollbar>
            </div>
            <actions :isUrl="isUrl"></actions>
        </el-main>
    </div>
</template>
<script>
import CeHeader from './components/header'
import CollectionCard from './components/collection-card'
import Actions from './components/actions'
export default {
    components: { CeHeader, CollectionCard, Actions },
    data: () => ({
        search: '',
        isUrl: false,
    }),
    async created() {
        let storage = this.$browser.storage.sync;
        let data = await storage.get('oTabData');
        this.isEmpty = data.oTabData.boards.length === 0 ? true : false;
        this.$store.dispatch('setAllData', { data, isEmpty: this.isEmpty });
        this.isUrl = await this.checkUrl()
    },
    watch: {
        allData: {
            handler(val) {
                if (!this.$store.state.firstChange) {
                    this.allData.boards.length === 0 ? (this.isEmpty = true) : (this.isEmpty = false);
                    this.$browser.storage.sync.set({ oTabData: this.allData });
                }
            },
            deep: true,
        },
    },
    methods: {
        async checkUrl(){
            let regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            let tab = await this.$browser.tabs.query({active: true, currentWindow: true})
            return regex.test(tab[0].url) ? true : false
        },
    },
    computed: {
        allData() {
            return this.$store.getters.allData
        },
        board() {
            return this.$store.getters.board
        }
    },
};
</script>
<style lang="scss">
.collections-scroller {
    height: 100%;

    .el-scrollbar__wrap {
        padding-bottom: 25px;
        overflow-x: hidden;
    }
}

.collections-container {
    height: 53%;
}

body {
    margin: 0;
}

.search-form-container{
    padding: 10px 15px;
}
.search-form {
    input {
        background-color: #fbfbfb;
    }
}

.el-main {
    padding: 0 !important;
    height: 100%;
}

#app {
    width: 350px;
    height: 480px !important;
}
</style>