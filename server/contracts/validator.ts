declare module '@ioc:Adonis/Core/Validator' {

	interface EmailValidator {
		blackListHosts?: string[];
		whiteListHosts?: string[];
	}

	interface Rules {
		isEmail(contracts?: EmailValidator): Rule
		isPassword(): Rule
	}
}