import { api } from '../helpers/api'
import { createConfirmedUser, TestUser } from '../helpers/userHelper'

describe('Transactions | Testes de Pontos e Caixinha', () => {
	let token: string

	beforeAll(async () => {
		try {
			const testUser = await createConfirmedUser()

			const loginResponse = await api.post('/login', {
				email: testUser.email,
				password: testUser.password,
			})

			if (loginResponse.data && loginResponse.data.token) {
				token = loginResponse.data.token
			} else {
				throw new Error('Login bem-sucedido, mas o token está ausente.')
			}
		} catch (error: any) {
			const status = error.response?.status
			const errorMessage = `SETUP FALHOU: Erro ao preparar usuário de teste. Status: ${
				status || error.message
			}`

			throw new Error(errorMessage)
		}
	})

	test('[BUG 1] Endpoint de Envio de Pontos deve existir e funcionar', async () => {
		// ...
	})

	test('[BUG 2] Saldo deve ser atualizado após uma transação', async () => {
		// ...
	})
})
