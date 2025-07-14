import axios from 'axios'
import { config } from '../config/config.env'

// Instância Axios configurada
export const api = axios.create({
	baseURL: config.BASE_URL,
})

// ======================= INTERCEPTOR DE RESPOSTA =======================
// Este é o "porteiro" que intercepta e limpa os erros.
api.interceptors.response.use(
	// Se a resposta for um sucesso (status 2xx), apenas a retorne.
	response => response,

	// Se a resposta for um erro...
	error => {
		// Verificamos se é um erro do Axios com uma resposta do servidor.
		if (axios.isAxiosError(error) && error.response) {
			// Criamos um novo objeto de erro, simples e limpo.
			const simplifiedError = {
				message: error.message,
				status: error.response.status,
				data: error.response.data,
			}
			// Rejeitamos a promessa com o nosso erro simplificado, não o original.
			return Promise.reject(simplifiedError)
		}

		// Se for outro tipo de erro, apenas o repasse.
		return Promise.reject(error)
	},
)
// =====================================================================

// A função getAuthToken não precisa mais de um try/catch complexo,
// pois o interceptor já está tratando os erros.
export async function getAuthToken(
	email: string,
	password: string,
): Promise<string> {
	const response = await api.post('/login', { email, password })
	if (response.data && response.data.token) {
		return response.data.token
	}
	throw new Error('Token não encontrado na resposta de login.')
}
