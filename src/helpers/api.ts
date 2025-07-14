import axios from 'axios'
import { config } from '../config/config.env'

export const api = axios.create({
	baseURL: config.BASE_URL,
})

api.interceptors.response.use(
	response => response,

	error => {
		if (axios.isAxiosError(error) && error.response) {
			const simplifiedError = {
				message: error.message,
				status: error.response.status,
				data: error.response.data,
			}
			return Promise.reject(simplifiedError)
		}

		return Promise.reject(error)
	},
)
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
