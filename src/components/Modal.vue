<template>
	<div class="sd-modal-background" :class="backgroundClass">
		<div v-if="closeOnBackground" class="sd-modal-under" @click="close" />
		<div class="sd-modal-inner" :class="modalClass">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
	name: 'Modal',
	props: {
		close: {
			type: Function as PropType<() => void>,
			required: true
		},
		closeOnBackground: {
			type: Boolean,
			required: false,
			default: false
		},
		backgroundClass: {
			type: String,
			required: false,
			default: ''
		},
		modalClass: {
			type: String,
			required: false,
			default: ''
		}
	}
})
</script>

<style lang="scss" scoped>
.sd-modal-background{
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	z-index: 1050;
	.sd-modal-under{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}
	.sd-modal-inner {
		width: 100%;
		margin: auto;
		max-height: 99.9%;
		max-width: 800px;
		padding: 0.5rem;
		border-radius: 0.5rem;
		z-index: 1;
		overflow-y: auto;
		-ms-overflow-style: none;
		&::-webkit-scrollbar{
			display: none;
		}
		position: relative;
	}
	@media (min-width: var(--size-sm, 576px)){
		.sd-modal-inner{
			padding: 1rem;
			width: 95%;
		}
	}
	@media (min-width: var(--size-md, 768px)){
		.sd-modal-inner{
			width: 90%;
		}
	}
}
</style>
