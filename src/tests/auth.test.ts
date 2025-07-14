import { faker } from '@faker-js/faker'
import { api } from '../helpers/api'
import { generateCpf } from '../utils/dataGenerator'
import axios from 'axios'

describe('Auth | Testes de Cadastro e Login', () => {
	test('[Sucesso] Deve registrar um novo usuário com dados válidos', async () => {
		const response = await api.post('/cadastro', {
			cpf: generateCpf(),
			full_name: faker.person.fullName(),
			email: faker.internet.email().toLowerCase(),
			password: `SenhaValida@123`,
			confirmPassword: `SenhaValida@123`,
		})
		// Este teste continuará falhando enquanto o Bug de cadastro existir, o que é correto.
		expect(response.status).toBe(201)
	})

	test('[Falha] Não deve registrar um usuário com CPF duplicado', async () => {
		expect.assertions(1)
		const cpf = generateCpf()
		// Cria um usuário base
		await api.post('/cadastro', {
			cpf,
			full_name: faker.person.fullName(),
			email: faker.internet.email().toLowerCase(),
			password: 'Password@123',
			confirmPassword: 'Password@123',
		})

		try {
			await api.post('/cadastro', { cpf /* ... */ })
			fail('A API deveria ter retornado um erro de CPF duplicado.')
		} catch (error: any) {
			// CORRETO: Esperamos 409 Conflict. O teste vai falhar porque a API retorna 400.
			expect(error.response?.status).toBe(409)
		}
	})

	test('[Falha] Não deve realizar login com um usuário inexistente', async () => {
		expect.assertions(1)
		try {
			await api.post('/login', {
				email: 'nao@existe.com',
				password: 'AnyPassword@123',
			})
			fail('A API deveria ter retornado um erro de usuário inexistente.')
		} catch (error: any) {
			// CORRETO: Esperamos 404 Not Found. O teste vai falhar porque a API retorna 400.
			expect(error.response?.status).toBe(404)
		}
	})
})
