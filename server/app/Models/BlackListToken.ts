import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class BlackListToken extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public token: string
}
