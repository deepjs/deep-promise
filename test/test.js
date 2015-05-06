/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 *
 */
if (typeof require !== 'undefined')
	var chai = require("chai"),
		promise = require("../index");

var expect = chai.expect;


describe("delayed_arg_injection", function() {

	var res = null;
	before(function(done) {
		promise.when(" world ")
			.delay(1)
			.done(function(arg) {
				return promise.when(1).delay(1)
					.then(function(arg2) {
						return "hello" + arg + arg2;
					});
			})
			.done(function(success) {
				res = success;
				done();
			});
	});

	it("should", function() {
		expect(res).equals("hello world 1");
	});
});
describe("modif_injection", function() {

	var res = null,
		res2 = null;
	before(function(done) {
		promise.when({
				test: 1
			})
			.done(function(s) {
				s.e = 2;
				res = s;
			})
			.done(function(s) {
				return "changed value";
			})
			.done(function(success) {
				res2 = success;
				done();
			});
	});

	it("should", function() {
		expect(JSON.stringify(res))
			.equals(JSON.stringify({
				test: 1,
				e: 2
			}));
		expect(res2).equals("changed value");
	});
});

describe("error_injection", function() {

	var res = null;
	before(function(done) {
		promise.when({})
			.done(function() {
				return new Error("the injected error");
			})
			.done(function(s) {
				return "should not see this";
			})
			.fail(function(e) {
				return e.message;
			})
			.done(function(success) {
				res = success;
				done();
			})
	});

	it("should", function() {
		expect(res).equals("the injected error");
	});
});
describe("error_catch", function() {

	var res = null;
	before(function(done) {
		promise.when({})
			.done(function() {
				throw new Error("the thrown error");
			})
			.done(function(s) {
				return "should not see this";
			})
			.fail(function(e) {
				return e.message;
			})
			.done(function(success) {
				res = success;
				done();
			});
	});

	it("should", function() {
		expect(res).equals("the thrown error");
	});
});
describe("done_add_handle", function() {

	var res = null;
	before(function(done) {
		promise.when({})
			.done(function(s) {
				this.done(function(s) {
					return "passed through";
				});
				return "should not see this";
			})
			.done(function(success) {
				res = success;
				done();
			});
	});

	it("should", function() {
		expect(res).equals("passed through");
	});
});