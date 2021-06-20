import { ref } from '@vue/composition-api'
import type { VueConstructor as Vue } from 'vue/types/umd'

const global = {
	stack: ref([] as string[]),
	modals: ref({} as Record<string, Vue>)
}

const capitalize = (text: string) => (text[0] ?? '').toUpperCase() + text.slice(1)
const merge = (type: string, key: string) => type + key

function spreadModals<T> (type: string, modals: Record<string, T>) {
	return Object.fromEntries(Object.entries(modals).map(([key, val]) => [merge(type, key), val]))
}

export const useModal = () => {
	const open = (id: string) => {
		close(id)
		if (Object.keys(global.modals.value).includes(id)) global.stack.value.push(id)
	}

	const close = (id: string) => {
		const index = global.stack.value.findIndex((i) => i === id)
		if (index > -1) global.stack.value.splice(index)
	}

	function register<Key extends string> (type: string, modals: Record<Key, Vue>) {
		global.modals.value = { ...global.modals.value, ...spreadModals(type, modals) }
		const helpers = Object.fromEntries(
			Object.keys(modals)
				.map(capitalize)
				.map((key) => [
					[[`open${key}`], () => open(merge(type, key))],
					[[`close${key}`], () => close(merge(type, key))]
				]).reduce((acc, curr) => acc.concat(curr), [])
		) as Record<`open${Capitalize<Key>}` | `close${Capitalize<Key>}`, () => void>

		const closeAll = () => Object.keys(modals).forEach((key) => close(merge(type, key)))

		return { ...helpers, closeAll }
	}

	return { ...global, open, close, register }
}
