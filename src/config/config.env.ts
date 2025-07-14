import { faker } from '@faker-js/faker'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

export const config = {
	BASE_URL: process.env.BASE_URL,
	TEST_USER_EMAIL: faker.person.fullName(),
	TEST_USER_PASSWORD: faker.internet.email().toLowerCase(),
}
