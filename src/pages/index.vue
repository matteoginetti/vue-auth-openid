<script setup lang="ts">
	import axios, { AxiosResponse } from 'axios'
	import { Ref } from 'vue'
	import { useClient } from '~/composables/client'
	import { OAuthClientOptions } from '~/common/OAuthClient'
	const parseJwt = (token: string) => {
		if (token.length === 0) return {}
		const base64Url = token.split('.')[1]
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
				})
				.join(''),
		)

		return JSON.parse(jsonPayload)
	}
	const store = useStorage('openidConfig', {} as OAuthClientOptions)
	const checkStore = useStorage('apiCheck', {} as { url: string })
	const { initClient, accessToken, isLogged, logout } = useClient()

	const saveConfig = async () => {
		if (store.value.url && store.value.clientId && store.value.scopes) {
			initClient(store.value)
		}
	}

	const parsedToken = computed(() => {
		if (accessToken.value) {
			const token = unref(accessToken.value) || ''
			return JSON.stringify(parseJwt(token), null, 2)
		}
		return ''
	})

	onMounted(async () => {
		if (store.value.url && store.value.clientId && store.value.scopes) {
			initClient(store.value)
		}
	})

	const copyToken = () => {
		const token = unref(accessToken.value) || ''
		navigator.clipboard.writeText(token)
	}
	const copyParsedToken = () => {
		navigator.clipboard.writeText(parsedToken.value)
	}

	const result: Ref<AxiosResponse | null> = ref(null)

	watch(accessToken.value, (token) => {
		if (token && checkStore.value.url) {
			axios
				.get(checkStore.value.url, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					result.value = res
				})
				.then((res) => console.log(res))
		}
	})
</script>

<template>
	<div
		class="flex flex-col flex-1 mx-auto px-lg min-w-full max-w-full bg-surface-1">
		<div class="flex flex-col items-center justify-center py-lg my-auto">
			<vv-card class="w-1/2" modifiers="glass">
				<template #header>
					<div class="flex items-center justify-between">
						<h3>AUTH OPENID</h3>

						<vv-button
							v-if="isLogged"
							modifiers="ghost"
							icon="logout"
							@click="logout" />
					</div>
				</template>
				<template #content>
					<div class="max-w-full">
						<form v-if="!isLogged" @submit.prevent="saveConfig">
							<vv-input-text
								v-model="store.url"
								label="Url"
								name="url" />
							<vv-input-text
								v-model="store.clientId"
								label="Client ID"
								name="client-id" />
							<vv-input-text
								v-model="store.scopes"
								label="Scopes"
								name="scopes" />
							<vv-input-text
								v-model="checkStore.url"
								label="Check url"
								name="check-url" />
							<vv-button modifiers="primary" type="submit">
								Save & Authorize
							</vv-button>
						</form>

						<template v-if="isLogged">
							<vv-accordion>
								<template #summary> Result </template>
								<template #details>
									<pre>{{ result }}</pre>
								</template>
							</vv-accordion>
							<vv-accordion>
								<template #summary> AccessToken </template>
								<template #details>
									<div class="flex items-center">
										<div class="copy-token">
											{{ accessToken }}
										</div>
										<vv-button
											modifiers="ghost"
											icon="copy"
											@click="copyToken" />
									</div>
								</template>
							</vv-accordion>
							<vv-accordion>
								<template #summary> Parsed token </template>
								<template #details>
									<div class="flex items-center">
										<div class="copy-token">
											{{ parsedToken }}
										</div>
										<vv-button
											modifiers="ghost"
											icon="copy"
											@click="copyParsedToken" />
									</div>
									<pre>
								{{ parsedToken }}
							</pre
									>
								</template>
							</vv-accordion>
						</template>
					</div>
				</template>
			</vv-card>
		</div>
		<PjFooter />
	</div>
</template>

<style lang="scss">
	.word-break {
		word-break: break-all;
	}

	pre {
		all: revert;
	}

	.copy-token {
		height: fit-content;
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
