/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { EmailValidator, validator } from '@ioc:Adonis/Core/Validator'

validator.rule('isPassword', (value: string, _, options) => {
	try {
		if (value.length < 8)
			throw new Error('Password must be at least 8 characters long')
		if (value.length > 255)
			throw new Error('Password must be less than 255 characters long')
		if (!value.match(/[a-z]/g))
			throw new Error('Password must contain at least one lowercase letter')
		if (!value.match(/[A-Z]/g))
			throw new Error('Password must contain at least one uppercase letter')
		if (!value.match(/[0-9]/g))
			throw new Error('Password must contain at least one number')
		if (!value.match(/[!@#$%.^&*]/g))
			throw new Error('Password must contain at least one special character')
	} catch (e) {
		options.errorReporter.report(
			options.pointer,
			'isPassword',
			e.message,
			options.arrayExpressionPointer
		)
	}
})

validator.rule('isEmail', (value: string, [parameters]: [EmailValidator], options) => {
	try {
		const email = value.split('@')
		if (email.length !== 2)
			throw new Error('Email is invalid')
		else if (!email[1].length)
			throw new Error('Email domain is invalid or missing')

		const domain = email[1].split('.')
		if (
			domain.length !== 2 ||
			(domain.length && (!domain[0].length || !domain[1].length))
		)
			throw new Error('Email domain is invalid or missing')

		const host = value.split('@')[1]

		if (parameters && parameters.whiteListHosts && parameters.whiteListHosts.length) {
			if (!parameters.whiteListHosts.includes(host))
				throw new Error('Email domain is not allowed')
		}

		if (parameters && parameters.blackListHosts && parameters.blackListHosts.length && !parameters.whiteListHosts) {
			const blackListHosts = parameters['blackListHosts']
			if (blackListHosts.includes(host))
				throw new Error('Email domain is blacklisted')
		}

	} catch (e) {
		options.errorReporter.report(
			options.pointer,
			'isEmail',
			e.message,
			options.arrayExpressionPointer
		)
	}
})