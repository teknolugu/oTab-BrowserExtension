<template>
    <div class="menu">
        <el-menu class="el-menu" mode="horizontal" text-color="#a0cfff" active-text-color="#409EFF" :default-active="activeMenu">
            <el-menu-item class="select-board-item">
                <el-select placeholder="Select Board" name="select-input" size="medium" :value="board.id" @change="activeBoardChange">
                    <div class="new-board-item el-select-dropdown__item" value="new-board" @click="createNewBoard" disabled>
                        <i class="el-icon-plus"></i>
                        <span>Create New Board</span>
                    </div>
                    <div class="divider-select"></div>
                    <el-option v-for="board in $store.getters.boardList" :key="board.id" :label="board.title" class="board-item-name" :value="board.id">
                        <span>{{ board.title }}</span>
                        <el-button circle size="mini" type="danger" plain icon="el-icon-delete" class="delete-board" @click.stop="deleteBoard(board.id)"></el-button>
                    </el-option>
                </el-select>
            </el-menu-item>
            <el-menu-item v-for="menu in menus" :index="menu.index" :key="menu.index" class="menu-item" @click="changeActiveTab(menu.index)">
                <unicon :name="menu.icon" height="23px" width="23px"></unicon>
                <span class="menu-name">{{ menu.name }}</span>
            </el-menu-item>
            <el-menu-item class="right" @click="openSettings">
                <div class="settings-button">
                    <unicon name="cog"></unicon>
                </div>
            </el-menu-item>
            <el-menu-item class="tag-select-menu">
                <select-tag :allTags="allTags" @change="activeTag" :value="$store.state.activeTag"></select-tag>
            </el-menu-item>
            <el-menu-item class="right">
                <el-popover placement="bottom" width="260" trigger="click">
                    <div class="new-tag-popover-title bb">
                        <p>Create New Tag</p>
                        <el-button type="primary" size="mini" class="right" @click="createNewTag">Create</el-button>
                    </div>
                    <div class="new-tag-popover">
                        <el-input show-word-limit :maxlength="10" autofocus v-model="newTag.name" placeholder="Tag name" size="medium"></el-input>
                        <div class="color-picker">
                            <el-color-picker :predefine="predefine.colors" size="small" v-model="newTag.color"></el-color-picker>
                            <button :style="{ 'background-color': newTag.color }" @click="changeColor" size="small">Change Color</button>
                        </div>
                    </div>
                    <el-button size="small" slot="reference" class="new-tag-button" type="primary">+ New Tag</el-button>
                </el-popover>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
import newBoard from '../../mixins/new-board';
import SelectTag from './select-tag'
import Bus from '../utils/bus'
export default {
    mixins: [newBoard],
    components: { SelectTag },
    data: () => ({
        menus: [{ index: '0', name: 'Collections', icon: 'layers' }, { index: '1', name: 'Notes', icon: 'notes' }, { index: '2', name: 'Tasks', icon: 'clipboard-notes' }],
        activeMenu: '0',
        predefine: {
            index: 0,
            colors: ['#409EFF', '#fea49f', '#51d0de', '#F7C331', '#F56C6C', '#7575dd'],
        },
        newTag: {
            name: '',
            color: '#409EFF',
        },
    }),
    computed: {
        board() {
            return this.$store.getters.board;
        },
        allTags() {
            let allTags = [{ name: 'all tags', color: '#e4e4e4', id: 'all_tags#e4e4e4' }, ...this.board.allTags];
            return allTags;
        },
        activeTagColor() {
            return '#' + this.$store.state.activeTag.split('#')[1];
        },
    },
    methods: {
        openSettings(){
            Bus.$emit('settings', true)
        },
        deleteBoard(boardId) {
            this.$confirm('This will permanently delete the board. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                })
                .then(() => {
                    this.$store.dispatch('deleteBoard', boardId);
                    this.$message({
                        type: 'success',
                        message: 'Delete completed',
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled',
                    });
                });
        },
        createNewTag() {
            if (this.newTag.name === '') {
                this.$message({
                    message: 'Tag Name is blank',
                    type: 'warning',
                });
            } else {
                this.$store
                    .dispatch('createNewTag', this.newTag)
                    .then(() => (this.newTag.name = ''))
                    .catch(message => {
                        this.$message({
                            message: message,
                            type: 'warning',
                        });
                    });
            }
        },
        changeColor() {
            if (this.predefine.index === this.predefine.colors.length - 1) {
                this.predefine.index = 0;
                this.newTag.color = this.predefine.colors[0];
                return;
            }
            this.newTag.color = this.predefine.colors[(this.predefine.index += 1)];
        },
        activeTag(tag) {
            this.$store.commit('activeTag', tag.id);
        },
        changeActiveTab(index) {
            this.$browser.storage.sync.set({ oTabMenu: index })
            this.$store.commit('activeMenu', index);
        },
        activeBoardChange(id) {
            let boardIndex = this.$store.state.boards.findIndex(board => board.id === id);
            this.$store.commit('activeBoard', this.$store.state.boards[boardIndex].id);
        },
    },
    mounted() {
        this.activeMenu = this.$store.state.activeMenu
    }
};
</script>
<style lang="scss">
@import '../../assets/themes/themes';

.settings-button {
    svg {
        fill: #bfbfbf !important
    }
}

.board-item-name:hover {
    .delete-board {
        opacity: 1;
        visibility: visible;
    }
}

.delete-board {
    margin-top: 3px !important;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    float: right;
}

.menu {
    .menu-name {
        font-weight: 500;
    }

    .el-menu {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        @include themify($themes){
            border-bottom: 1px solid themed('base-border');
        }
    }
}

.new-tag-popover-title {
    padding: 3px 10px 9px 10px;

    * {
        display: inline-block;
        margin-bottom: 0px;
    }
}

.new-tag-button {
    border: none !important;
}

.color-picker {
    button {
        &:hover {
            filter: brightness(1.1);
        }

        margin-left: 7px;
        width: 100%;
        border-radius: 4px;
        border: none;
        color: white;
        outline: none;
        cursor: pointer;
    }
}

.new-tag-popover {
    padding: 10px;

    .color-picker {
        padding: 7px 0;
        display: flex;
    }
}

.tag-menu-item {
    width: 77%;
    display: inline-block;
}

.tag-select-menu {
    float: right !important;
    padding: 0 !important;
    margin: 0 20px !important;

    input {
        text-transform: capitalize !important;
    }
}

.el-input__inner[name='select-input'] {
    text-transform: capitalize;
}

.board-item-name {
    text-transform: capitalize;
}

.el-menu {
    background-color: #fff;
    z-index: 1;
}

.new-board-item {
    @include themify($themes) {
        color: themed('text-regular') !important;
    }

    cursor: pointer !important;

    &:hover {
        @include themify($themes) {
            background-color: themed('hover') !important;
        }
    }
}

.divider-select {
    background-color: #02020224;
    height: 1px;
    margin: 5px 0;
}

.empty-text {
    list-style: none;
}

.el-menu-item.is-active {
    svg {
        fill: #409eff;
    }
}

.menu-item {
    @include themify($themes) {

        &:not(.is-disabled):hover,
        &:not(.is-disabled):focus {
            background-color: themed('hover') !important;
        }
    }
}

.el-menu-item {

    &:not(.is-disabled):hover,
    &:not(.is-disabled):focus {
        background-color: unset !important;
    }

    svg {
        fill: #a0cfff;
    }
}

.select-board-item {
    margin-right: 20px !important;

    .el-select {
        margin-top: -3px;
    }

    &:after {
        content: '';
        position: absolute;
        height: 30px;
        width: 1px;

        @include themify($themes) {
            background-color: themed('light-border')
        }

        margin: 15px 20px;
    }
}
</style>