<script setup lang="ts">
	import '~/composables/useTheme'

	const { colorHex } = useColor('brand')

	useHead({
		title: 'OpenId login',
		meta: [
			{
				name: 'description',
				content: 'A vue openid login tester',
			},
			{
				name: 'theme-color',
				content: colorHex,
			},
			{
				name: 'msapplication-TileColor',
				content: colorHex,
			},
		],
	})
</script>

<template>
	<RouterView />
</template>
