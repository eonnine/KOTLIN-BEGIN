var ajax = {
		'stack' : [],
		'callee' : {},
		'init' () {
			console.log('create');
		},
		'get' (url, data) {
			this.exec ('get', url, data);
			return this;
		},
		'post' (url, data) {
			this.exec ('post', url, data);
			return this;
		},
		'put' (url, data) {
			this.exec ('put', url, data);
			return this;
		},
		'patch' (url, data) {
			this.exec ('patch', url, data);
			return this;
		},
		'delete' (url, data) {
			this.exec ('delete', url, data);
			return this;
		},
		'exec' (method, url, data) {
			var config = {
				headers: {
					'Content-Type': 'application/json'
				}
			}
			
			axios[method](url, JSON.stringify(data), config)
			.then(function(res){
				this.startStack(res)
			}.bind(this));
		},
		'then' (callBack) {
			this.push(callBack);
			return this;
		},
		'push' (callBack) {
			this.stack.push(callBack);
		},
		'startStack' (res) {
			if(this.stack[0] != undefined){
				this.stack[0](res);
				this.stack.splice(0,1);
				this.startStack(res);
			}
		}
}