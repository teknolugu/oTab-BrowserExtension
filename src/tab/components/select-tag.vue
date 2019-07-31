<template>
    <div class="select-tag-container">
        <div class="select-form" @click="isActive = !isActive">
            <span class="prefix-icon">
                <i class="el-icon-price-tag"></i>
            </span>
            <input class="select-value" :value="selected.name" :style="{'background-color': selected.color}" readonly>
            <span class="suffix-icon">
                <i class="el-icon-arrow-up" :class="{'is-reverse': isActive}"></i>
            </span>
        </div>
        <el-collapse-transition>
            <div class="dropdown-select" v-show="isActive">
                    <ul class="item-list">
                        <template v-for="tag in allTags">
                            <li class="select-item" @click="changeSelected(tag)" :class="{'selected': tag.id === selected.id}">
                                <span class="tag-color" :style="{'background-color': tag.color}"></span>
                                <span class="tag-name">{{tag.name}}</span>
                                <span class="delete-tag" @click.stop="delTag(tag.id)" v-if="tag.id !== 'all_tags#e4e4e4'">
                                    <i class="el-icon-delete"></i>
                                </span>
                            </li>
                        </template>
                    </ul>
            </div>
        </el-collapse-transition>
    </div>
</template>
<script>
export default {
    data: () => ({
        selected: {
            color: "#e4e4e4",
            id: "all_tags#e4e4e4",
            name: "all tags"
        },
        isActive: false
    }),
    props: ['allTags'],
    watch: {
        activeTag: {
            handler(tagId){
                let tag = tagId.split('#')
                this.selected = {
                    color: '#'+tag[1],
                    id: tagId,
                    name: tag[0]
                }
            },
            deep: true
        }
    },
    computed: {
        activeTag(){
            return this.$store.state.activeTag
        }
    },
    methods: {
        defaultData() {
            this.selected = {
                color: "#e4e4e4",
                id: "all_tags#e4e4e4",
                name: "all tags"
            }
        },
        delTag(tagId) {
            this.selected.id === tagId ? this.defaultData() : null
            this.$store.dispatch('deleteTag', tagId);
        },
        changeSelected(tag) {
            this.$emit('change', tag)
            this.isActive = false
        }
    }
}
</script>
<style lang="scss">
.delete-tag{
	position: absolute;
	right: -30px;
	transition: all .3s ease;
	i{
		margin-right: 0px !important;
	}
	&:hover {
    	i {
    	    color: #f56c6c
    	}
    }
}
.tag-color {
    display: inline-block;
    padding: 9px;
    border-radius: 4px;
    margin-right: 7px;
}
.dropdown-select::-webkit-scrollbar {
  width: 6px;
}
 
.dropdown-select::-webkit-scrollbar-thumb {
  background: #90939980;
  border-radius: 20px;
}

.dropdown-select::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 20px;
}
.dropdown-select {
    right: 0;
	z-index: 2000;
	overflow-y: auto;
	overflow-x: hidden;
    position: absolute;
    max-height: 300px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    background-color: white;
    width: 200px;
    border-radius: 4px;

    .item-list {
        padding: 10px 0;
        list-style: none;

        .select-item {
            &:hover {
            	.delete-tag{
            		right: 15px;
            	}
                background-color: #f5f7fa;
            }

            padding: 0 15px;
            height: 34px;
            line-height: 34px;
            text-transform: capitalize;
            transition: all .2s ease;

            &.selected {
                .tag-color {
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
                }

                .tag-name {
                    color: #409eff;
                    font-weight: 600;
                }
            }

            .tag-name {
                font-size: 14px;
                color: #606266;
            }
        }
    }
}

.suffix-icon {
    i {
        transform: rotateZ(180deg);
        font-size: 14px !important;
    }

    .is-reverse {
        transition: all .3s ease;
        transform: rotateZ(0deg);
    }
}

.select-tag-container {

    .suffix-icon,
    .prefix-icon {
        position: absolute;

        i {
            color: white;
        }
    }

    .suffix-icon {
        right: 0;
    }

    .prefix-icon {
        left: 3px;
    }

    .select-value {
        cursor: pointer;
        padding: 0 30px;
        background-color: #e4e4e4;
        border-radius: 4px;
        display: inline-block;
        height: 32px;
        width: 90px;
        border: none;
        outline: none;
        color: white;
    }
}
</style>