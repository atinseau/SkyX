
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */


contract("list_account", function (/* accounts */) {
	it("should assert true", async function () {

		/**
	 	 * @type {import('web3').default}
		 */
		let web = web3

		const accounts = await web.eth.getAccounts();

		const a = accounts[0]
		const b = accounts[1]

		for(const account of accounts) {
			const balance = await web.eth.getBalance(account)
			console.log(balance)
		}

		// send 10 eth from a to b
		const res = await web.eth.sendTransaction({
			from: a,
			to: b,
			value: web.utils.toWei('10', 'ether')
		})

		console.log(res)

		return assert.isTrue(true)
	});
});
