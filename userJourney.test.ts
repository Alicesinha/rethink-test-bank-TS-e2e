import axios, { AxiosResponse } from 'axios'
import { faker } from '@faker-js/faker'

interface RegisterResponse {
	message: string
	confirmToken: string
}

interface LoginResponse {
	token: string
}

interface BalanceResponse {
	normal_balance: number
	piggy_bank_balance: number
}

interface GenericMessageResponse {
	message: string
}
const api = axios.create({
	baseURL: 'https://points-app-backend.vercel.app',
})

jest.setTimeout(30000)

//* Função auxiliar para gerar um número de CPF válido para testes.

function generateCpf(): string {
	const rnd = (n: number): number => Math.round(Math.random() * n)

	const n = Array.from({ length: 9 }, () => rnd(9))

	let d1 = n.map((num, i) => num * (10 - i)).reduce((a, b) => a + b) % 11
	d1 = d1 < 2 ? 0 : 11 - d1

	let d2 =
		[...n, d1].map((num, i) => num * (11 - i)).reduce((a, b) => a + b) % 11
	d2 = d2 < 2 ? 0 : 11 - d2

	return `${n.join('')}${d1}${d2}`
}

describe('Rethink Test Bank API - Jornada do Usuário (TypeScript)', () => {
	it('deve validar a jornada do usuário contra a documentação oficial', async () => {
		// --- Dados Dinâmicos ---
		const user = {
			cpf: generateCpf(),
			fullName: faker.person.fullName(),
			email: faker.internet.email().toLowerCase(),
			password: `Senha@${faker.internet.password({
				length: 10,
				prefix: 'A1',
			})}`,
		}
		const recipientCpf = generateCpf()

		let confirmToken: string
		let sessionToken: string

		// --- Início da Jornada ---

		// 1. Cadastro de Usuário
		const registerResponse: AxiosResponse<RegisterResponse> = await api.post(
			'/cadastro',
			{
				cpf: user.cpf,
				full_name: user.fullName,
				email: user.email,
				password: user.password,
				confirmPassword: user.password,
			},
		)
		expect(registerResponse.status).toBe(201)
		confirmToken = registerResponse.data.confirmToken

		// 2. Confirmação de E-mail
		const confirmEmailResponse: AxiosResponse<string> = await api.get(
			`/confirm-email?token=${confirmToken}`,
		)
		expect(confirmEmailResponse.status).toBe(200)
		expect(confirmEmailResponse.data).toBe('E-mail confirmado com sucesso.')

		// 3. Login
		const loginResponse: AxiosResponse<LoginResponse> = await api.post(
			'/login',
			{
				email: user.email,
				password: user.password,
			},
		)
		expect(loginResponse.status).toBe(200)
		sessionToken = loginResponse.data.token

		const authHeaders = { Authorization: `Bearer ${sessionToken}` }

		// 4. Enviar Pontos
		const sendPointsResponse: AxiosResponse<GenericMessageResponse> =
			await api.post(
				'/points/send',
				{ recipientCpf, amount: 50 },
				{ headers: authHeaders },
			)
		expect(sendPointsResponse.status).toBe(200)
		expect(sendPointsResponse.data.message).toBe('Pontos enviados com sucesso.')

		// 5. Depositar na Caixinha
		const depositResponse: AxiosResponse<GenericMessageResponse> =
			await api.post(
				'/caixinha/deposit',
				{ amount: 30 },
				{ headers: authHeaders },
			)
		expect(depositResponse.status).toBe(200)
		expect(depositResponse.data.message).toBe('Depósito na caixinha realizado.')

		// 6. Conferir Saldo
		const balanceResponse: AxiosResponse<BalanceResponse> = await api.get(
			'/points/saldo',
			{
				headers: authHeaders,
			},
		)
		expect(balanceResponse.status).toBe(200)
		expect(balanceResponse.data.normal_balance).toBe(20)
		expect(balanceResponse.data.piggy_bank_balance).toBe(30)

		// 7. Excluir Conta
		const deleteResponse: AxiosResponse<GenericMessageResponse> =
			await api.delete('/account', {
				headers: authHeaders,
				data: { password: user.password },
			})
		expect(deleteResponse.status).toBe(200)
		expect(deleteResponse.data.message).toBe('Conta marcada como deletada.')
	})
})
