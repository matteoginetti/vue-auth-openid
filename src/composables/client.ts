import { OAuthClient, OAuthClientOptions } from '~/common/OAuthClient'

const oAuthClient = new OAuthClient({})

const initClient = (config: OAuthClientOptions) => {
	oAuthClient.clientId = { clientId: config.clientId || '' }
	oAuthClient.url = config.url || ''
	oAuthClient.scopes = config.scopes || ''

	login()
}

const login = async () => {
	if (oAuthClient) {
		await oAuthClient.initialize()
		console.log(oAuthClient)
		if (!oAuthClient.loggedIn.value) {
			await oAuthClient.authorize()
		}
	}
}

const logout = () => {
	if (oAuthClient) {
		console.log(oAuthClient)
		oAuthClient.logout()
	}
}

const accessToken = computed(() => {
	return oAuthClient.accessToken
})

const isLogged = computed(() => {
	return oAuthClient.loggedIn.value || false
})

export function useClient() {
	return { initClient, login, accessToken, isLogged, logout }
}
