<template>
	<div class="sd-menu-background" :class="backgroundClass">
		<div class="sd-menu-under" @click="close" />
		<div class="sd-menu-sidebar" :class="menuClass">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
	name: 'SideMenu',
	props: {
		close: {
			type: Function as PropType<() => void>,
			required: true
		},
		backgroundClass: {
			type: String,
			required: false,
			default: ''
		},
		menuClass: {
			type: String,
			required: false,
			default: ''
		}
	}
})
</script>

<style lang="scss" scoped>
.sd-menu-background {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100%;
	z-index: 1;
	overflow-y: auto;
	.sd-menu-under {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100%;
	}
	.sd-menu-sidebar {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		position: absolute;
		top: 0;
	}
}
</style>
