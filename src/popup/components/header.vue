<template>
    <div class="header">
        <div class="container-input">
            <el-select v-if="!addCollectionMode" placeholder="Select Board" class="select-board" name="select-board" size="medium" :value="board.id" @change="activeBoardChange">
                <el-option v-for="board in $store.getters.boardList" :key="board.id" :label="board.title" :value="board.id">
                </el-option>
            </el-select>
            <div class="add-mode" v-else>
                <el-input autofocus size="medium" placeholder="Add collection" :maxlength="25" v-model="title"></el-input>
                <el-button icon="el-icon-check" size="mini" type="primary" circle @click="addCollection"></el-button>
            </div>
        </div>
        <el-button :disabled="!isUrl" :type="addButonType" plain size="mini" class="add-collection" :class="{'close-button': addCollectionMode}" icon="el-icon-plus" circle @click="addMode"></el-button>
    </div>
</template>
<script>
import Bus from '../bus'
export default {
    props: {
        board: {
            type: Object,
            default: () => ({
                id: ''
            })
        },
        isUrl: {
            type: Boolean,
            default:false
        }
    },
    data: () => ({
        addCollectionMode: false,
        title: ''
    }),
    computed:{
        addButonType(){
           return this.addCollection ? 'default' : 'primary'
        }
    },
    methods: {
        addCollection(){
                if(this.title !== ''){
                    this.$store.commit('collections/createCollection', this.title)
                    this.title = ''
                    this.addCollectionMode = false
                }
        },
        addMode(){
            this.addCollectionMode = !this.addCollectionMode
            this.title = ''
        },
        activeBoardChange(boardId) {
           this.$store.commit('activeBoard', boardId)
           Bus.$emit('changeBoard')
        }
    },
}
</script>
<style lang="scss">
.add-mode{
    .el-input{
        width: 83%;
    }
    button{
        margin-left: 10px;
    }
}
.header {
    padding: 13px 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.container-input {
    display: inline-block;
    .select-board{
        width: 100%
    }
    width: 83%;
}
.close-button{
    transform: rotate(45deg);
}
.add-collection {
    transition: all .7s ease;
    margin-left: 10px !important;
}
</style>