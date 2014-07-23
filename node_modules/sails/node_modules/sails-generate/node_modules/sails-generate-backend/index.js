/**
 * sails-generate-backend
 * 
 * Usage:
 * `sails-generate-backend`
 * 
 * @type {Object}
 */
module.exports = {
	targets: {
		'.': { exec: function (scope, cb) {
			console.log('Running generator (sails-generate-backend) @ `'+scope.rootPath+'`...');
			cb();
		} }
	}
};


// Generator syntax:
// 
// You can use params in your target paths:
// {
//   './:someScopeVariable/somethingStatic/:somethingDynamicAgain': '...'
// }

// Other directives:
// 
// 
// Generate a folder: (`folder`)
// './:arg0/controllers': { folder: {} }
//
// Copy a file : (`copy`)
// './:arg0/someTemplate.foo': { copy: path.resolve(__dirname, './someTemplate.foo') },
//
// Render an EJS template: (`ejs`)
// (note: the template doesn't have to end in *.ejs)
// './:arg0/someTemplate.ejs': { ejs: path.resolve(__dirname, './someTemplate.ejs') },
//
// Run another generator:
// './:arg0/controllers/:controllerName.js': 'controller'
//