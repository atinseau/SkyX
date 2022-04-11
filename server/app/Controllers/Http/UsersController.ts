import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


import { schema, rules } from '@ioc:Adonis/Core/Validator'
import BlackListToken from 'App/Models/BlackListToken'
import User from "App/Models/User"
import Jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import { sha256 } from 'js-sha256'


export default class UsersController {

	async index(ctx: HttpContextContract) {
		const { params } = ctx
		try {
			if (params.id) {
				return ctx.middlewareResults.get('user')
			}
		} catch (e) {
			return {
				error: "User not found"
			}
		}
		return await User.all()
	}

	async create({ request }: HttpContextContract) {
		const userSchema = schema.create({
			username: schema.string({ trim: true }),
			email: schema.string({ trim: true }, [
				rules.isEmail({
					blackListHosts: ['yopmail.com']
				})
			]),
			password: schema.string({ trim: true }, [
				rules.confirmed(),
				rules.isPassword()
			])
		})
		const payload = await request.validate({ schema: userSchema })
		payload.password = sha256(payload.password)
		try {
			return await User.create(payload)
		} catch (e) {
			return {
				error: "User already exists"
			}
		}
	}

	async delete({ params }: HttpContextContract) {
		try {
			const user = await User.findByOrFail('id', params.id)
			const blackLists = await BlackListToken.all()
			for (const blackList of blackLists) {
				const id = Jwt.verify(blackList.token, Env.get('APP_KEY'))['id']
				if (id === user.id) {
					await blackList.delete()
				}
			}
			await user.delete()
			return {
				message: 'User deleted successfully'
			}
		} catch (e) {
			return {
				message: 'User not found'
			}
		}
	}

	async logout(ctx: HttpContextContract) {
		try {
			const user = ctx.middlewareResults.get('user') as User
			return await user.logout()
		} catch (e) {
			return {
				error: e.message
			}
		}
	}

	async login({ request }: HttpContextContract) {
		try {
			const body = request.body()
			if (!body.password)
				throw new Error('Password is required')
			if (!body.username && !body.email)
				throw new Error('Username or email is required')

			const key = body.username ? 'username' : 'email'
			const user = await User.findBy(key, body[key])
			if (!user)
				throw new Error('User not found')
			if (user.password !== sha256(body.password))
				throw new Error('Invalid password')
			const token = await user.login()
			return {
				message: 'User logged in successfully',
				id: user.id,
				token
			}
		} catch (e) {
			return {
				error: e.message
			}
		}
	}

	async test(ctx: HttpContextContract) {
		const user = await ctx.middlewareResults.get('user') as User
		return {
			message: `Hello ${user.username} !`
		}
	}
}
