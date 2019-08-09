<template>
    <el-dialog :visible.sync="visible" width="40%" class="settings-dialog">
        <p slot="title" class="settings-title">Settings</p>
        <div class="settings-content">
        	<div class="el-list">
        		<div class="el-list-item settings">
            	    <div class="el-list-icon">
                        <el-switch :value="settings.dark" @change="darkMode"></el-switch>
            	    </div>
            	    <div class="el-list-text">
            	        <p>Dark Mode</p>
            	    </div>
            	</div>
                <div class="el-list-item settings">
                    <div class="el-list-icon">
                        <el-switch :value="settings.openInCurrentTab" @change="openInCurrentTab"></el-switch>
                    </div>
                    <div class="el-list-text">
                        <p>Open Collection Tab in Current Tab</p>
                    </div>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false" type="primary">Close</el-button>
        </span>
    </el-dialog>
</template>
<script>
import Bus from '../utils/bus'
export default {
    data: () => ({
        visible: false,
    }),
    methods: {
        openInCurrentTab(value){
            this.commitSetting('openInCurrentTab', value)
        },
        darkMode(value) {
            this.commitSetting('dark', value)
            const message = this.settings.dark ? 'Dark Mode will be active after you reload the tab.' : 'Dark Mode will be deactive after you reload the tab.'
            this.$message(message);
        },
        commitSetting(key, value){
            this.$store.commit('settings/change', {key: key, value: value})
            this.$browser.storage.sync.set({ oTabSettings: this.settings })
        }
    },
    computed:{
        settings(){
            return this.$store.state.settings.items
        }
    },
    created() {
        Bus.$on('settings', () => this.visible = true)
    }
}
</script>
<style lang="scss">
@import '../../assets/themes/themes';

.settings-title{
	font-size: 18px;
	font-weight: 500;
	margin: 0;
	@include themify($themes){
		color: themed('text-primary');
	}
}
.el-list-item.settings{
    .el-list-icon{
        width: 50px;
    }
	padding: 13px 10px;
	&:hover{	
		@include themify($themes){
			background-color: themed('bg-color2')
		}
	}

}
.settings-dialog{
	.el-dialog__header{
		@include themify($themes){
			border-bottom: 1px solid themed('base-border')
		}
		padding: 10px 20px !important;
	}
	.el-dialog__footer{
		padding: 10px 20px !important;
	}
	.el-dialog__body{
		padding: 20px !important;
	}
}
</style>