<template>
    <el-dialog :visible.sync="visible" width="90%" class="boardManager-dialog" fullscreen>
        <div class="boardManager-header" slot="title">
            <p class="boardManager-header--title">Boards</p>
            <span class="boards-total">{{boards.length}}</span>
            <el-input v-model="search" icon="el-icon-search" prefix-icon="el-icon-search" placeholder="Search boards" size="medium" class="boardManager-header--search"></el-input>
        </div>
        <div class="boardManager-content">
            <template v-for="board in boards">
                <board-card :board="board"></board-card>
            </template>
            <div class="new-board-card" @click="createNewBoard">
                <div class="new-board-card--content">
                    <i class="el-icon-plus"></i>
                    <p>New Board</p>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import Bus from '../utils/bus'
import BoardCard from './board-card'
import NewBoard from '../../mixins/new-board'
export default {
    components: { BoardCard },
    mixins: [NewBoard],
    data: () => ({
        search: '',
        visible: false
    }),
    computed: {
        boards() {
            return this.$store.getters.allData.boards.filter(board => board.title.toLowerCase().match(this.search))
        }
    },
    created() {
        Bus.$on('boardManager', () => this.visible = true)
    }
}
</script>
<style lang="scss">
@import '../../assets/themes/themes';

.boardManager-dialog {
    .el-dialog__header {
        padding: 20px !important;

        button {
            top: 25px !important;
            right: 30px !important;
            font-size: 23px;
        }

        @include themify($themes) {
            border-bottom: 1px solid themed('light-border')
        }
    }

    .el-dialog__body {}
}

.boardManager-header {
    .boards-total{
        padding: 5px 10px;
        border-radius: 30px;
        @include themify($themes) {
            background-color: themed('bg-color2');
        }
        margin-left: 10px;
        margin-right: 15px;
    }
    &--title {
        font-size: 16px;

        @include themify($themes) {
            color: themed('text-primary');
        }

        font-weight: 500;
        display: inline-block;
        margin: 0;
    }

    &--search {
        width: 250px !important;
        margin-left: 15px;
    }
}

.boardManager-content {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}
</style>