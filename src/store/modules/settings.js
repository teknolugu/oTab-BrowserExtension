export default {
	state: {
		items: {
			dark: false,
			openInCurrentTab: true
		}
	},
	mutations: {
		changeSettings(state, data){
			state.items = data
		},
		change(state, {key, value}){
			state.items[key] = value
		}
	}
}