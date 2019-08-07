<template>
    <el-dialog :visible.sync="visible" width="40%" class="settings-dialog">
        <p slot="title" class="settings-title">Settings</p>
        <div class="settings-content">
        	<div class="el-list">
        		<div class="el-list-item settings">
            	    <div class="el-list-icon">
            	        <el-checkbox :value="isDark" @change="darkMode"></el-checkbox>
            	    </div>
            	    <div class="el-list-text">
            	        <p>Dark Mode</p>
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
        visible: true,
        isDark: false,
    }),
    methods: {
        openSettings() {
            this.visible = true
        },
        darkMode() {
            this.$browser.storage.sync.set({ oTabDark: !this.isDark })
            const message = !this.isDark ? 'Dark Mode will be active after you reload the tab.' : 'Dark Mode will be deactive after you reload the tab.'
            this.$message(message);
            this.isDark = !this.isDark
        },
    },
    async mounted() {
        let theme = await this.$browser.storage.sync.get('oTabDark')
        this.isDark = theme.oTabDark
    },
    created() {
        Bus.$on('settings', this.openSettings)
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
	padding: 10px;
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