import { faker } from '@faker-js/faker'
import { api } from './api'
import { generateCpf } from '../utils/dataGenerator'

export interface TestUser {
	email: string
	password: string
	cpf: string
	fullName: string
}

// Helper para criar uma pausa
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function createConfirmedUser(): Promise<TestUser> {
	const userData = {
		cpf: generateCpf(),
		fullName: faker.person.fullName(),
		email: faker.internet.email().toLowerCase(),
		password: `StrongP@ssw0rd!${faker.string.alphanumeric(5)}`,
	}

	const registerResponse = await api.post('/cadastro', {
		cpf: userData.cpf,
		full_name: userData.fullName,
		email: userData.email,
		password: userData.password,
		confirmPassword: userData.password,
	})

	const confirmToken = registerResponse.data.confirmToken
	if (!confirmToken) {
		throw new Error('Não foi possível obter o token de confirmação.')
	}

	await api.get(`/confirm-email?token=${confirmToken}`)

	// ---- ADIÇÃO IMPORTANTE ----
	// Damos 2 segundos para a API processar a ativação do usuário
	await sleep(2000)
	// -------------------------

	console.log(`Usuário de teste criado e confirmado: ${userData.email}`)
	return userData
}
