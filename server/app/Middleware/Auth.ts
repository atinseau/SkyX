import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class Auth {
	public async handle(ctx: HttpContextContract, next: () => Promise<void>, guards: string[]) {
		const { request, response } = ctx
		
		if (guards.includes('params') && !Object.keys(ctx.params).length) {
			await next()
			return 
		}

		try {
			const headers = request.headers()
			const token = headers.authorization?.substring(7)
			if (!token)
				throw new Error('no token provided')
			const user = await User.findBy('token', token)
			if (!user)
				throw new Error('user not found')
			user.verify(token)

			if (!ctx.middlewareResults)
				ctx.middlewareResults = new Map()
			ctx.middlewareResults.set('user', user)

			await next()
		} catch (e) {
			response.unauthorized({
				error: e.message
			})
		}
	}
}
