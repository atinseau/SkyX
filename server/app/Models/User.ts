import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'

import Jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import BlackListToken from './BlackListToken'

export default class User extends BaseModel {

	@column({
		isPrimary: true
	})
	public id: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@column()
	public username: string

	@column()
	public email: string

	@column()
	public password: string

	@column()
	public firstname?: string

	@column()
	public lastname?: string

	@column()
	public token?: string

	@beforeCreate()
	public static assignUuid(user: User) {
		user.id = uuid()
	}


	async login() {
		const token = Jwt.sign({
			id: this.id,
			email: this.email
		}, Env.get('APP_KEY'), {
			expiresIn: "1d"
		})
		this.token = token
		await this.save()
		return token
	}

	async logout() {
		if (!this.token)
			throw new Error('user is not logged in')
		const blackList = await BlackListToken.create({
			token: this.token
		})
		this.token = ""
		await this.save()
		return {
			message: "logout success",
			result: blackList
		}
	}

	verify(token: string) {
		try {
			Jwt.verify(token, Env.get('APP_KEY'))
		}
		catch (e) {
			throw new Error('token expire, please re log you')
		}
	}

}
