import { api } from '../helpers/api'
import { generateCpf } from '../utils/dataGenerator'
import { createConfirmedUser, TestUser } from '../helpers/userHelper'

describe('Transactions | Testes de Pontos e Caixinha', () => {
	let token: string

	beforeAll(async () => {
		try {
			// 1. Cria e confirma o usuário. Esta parte já funciona.
			const testUser = await createConfirmedUser()

			// 2. Faz o login diretamente aqui para obter o token.
			const loginResponse = await api.post('/login', {
				email: testUser.email,
				password: testUser.password,
			})

			// 3. Valida a resposta e armazena o token.
			if (loginResponse.data && loginResponse.data.token) {
				token = loginResponse.data.token
			} else {
				// Se o login for bem-sucedido mas não vier o token, falha.
				throw new Error('Login bem-sucedido, mas o token está ausente.')
			}
		} catch (error: any) {
			// 4. ESTA É A PARTE MAIS IMPORTANTE
			// Captura QUALQUER erro que ocorrer no setup (criação ou login)
			// e lança um ERRO NOVO E SIMPLES, que não quebra o Jest.
			const status = error.response?.status
			const errorMessage = `SETUP FALHOU: Erro ao preparar usuário de teste. Status: ${
				status || error.message
			}`

			throw new Error(errorMessage)
		}
	})

	// O resto dos seus testes continua aqui...
	test('[BUG 1] Endpoint de Envio de Pontos deve existir e funcionar', async () => {
		// ...
	})

	test('[BUG 2] Saldo deve ser atualizado após uma transação', async () => {
		// ...
	})
})
