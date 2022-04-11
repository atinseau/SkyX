declare module '@ioc:Adonis/Core/HttpContext' {
	interface HttpContextContract {
		middlewareResults: Map<string, Object>
	}
}