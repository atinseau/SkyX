import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BlackListTokens extends BaseSchema {
	protected tableName = 'black_list_tokens'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')
			table.string('token').unique().notNullable()
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
