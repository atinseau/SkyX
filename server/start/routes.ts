/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
	Route.group(() => {
		
		// white change in futur
		Route.get('/:id?', 'UsersController.index').where('id', Route.matchers.uuid())
			.middleware('auth:params')
		
		Route.post('/login', 'UsersController.login')
		Route.post('/create', 'UsersController.create')
		
		Route.group(() => {
			Route.delete('/delete/:id', 'UsersController.delete')
			Route.get('/logout', 'UsersController.logout')
			Route.get('/test', 'UsersController.test')
		}).middleware('auth')
	})
		.prefix('/users')
})
	.prefix('/v1')
