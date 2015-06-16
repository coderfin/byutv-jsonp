suite("<byutv-jsonp>", function () {
	var url = "http://jsonplaceholder.typicode.com/posts";

	test("The constructor `ByutvJsonp` exists.", function () {
		assert.isDefined(ByutvJsonp);
	});

	test("New instances of `<byutv-jsonp>` can be created using the constructor.", function () {
		assert.instanceOf(new ByutvJsonp(), ByutvJsonp);
	});

	test("New instances of `<byutv-jsonp>` can be created by declaration.", function () {
		assert.instanceOf(document.querySelector("#declaration"), ByutvJsonp);
	});

	test("The `activeRequests` property array has no length if no requests have been sent.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		assert.lengthOf(byutvJsonp.activeRequests, 0);
	});

	test("The `activeRequests` property array has a length when requests have been sent.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.generateRequest();
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.addEventListener("sent", function () {
			assert.lengthOf(byutvJsonp.activeRequests, 2);

			done();
		});
	});

	test("The `activeRequests` property array contains Request objects.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.addEventListener("sent", function () {
			assert.isObject(byutvJsonp.activeRequests[0]);

			done();
		});
	});

	test("The `auto` property can be set.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("auto", "");

		assert.isBoolean(byutvJsonp.auto);
		assert.isTrue(byutvJsonp.auto);
		assert.isTrue(byutvJsonp.hasAttribute("auto"));
	});

	test("The `auto` property automatically sends requests when `true`.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.addEventListener("sent", function () {
			done();
		});
	});

	test("The `auto` property does not automatically sends requests when `false`.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);

		var hasSent = false;
		byutvJsonp.addEventListener("sent", function () {
			hasSent = true;
		});


		setTimeout(function () {
			assert.isFalse(hasSent);

			done();
		}, 1000);
	});

	test("The `cache` property can be set.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("cache", "");

		assert.isBoolean(byutvJsonp.cache);
		assert.isTrue(byutvJsonp.cache);
		assert.isTrue(byutvJsonp.hasAttribute("cache"));
	});

	test("The `cache` property throws an error if `callbackValue` is not set.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("cache", "");
		byutvJsonp.setAttribute("url", url);

		assert.throws(function () {
			byutvJsonp.generateRequest();
		}, Error, "`callback-value` must be declared or `callbackValue` set when `cache` is true.");
	});

	test("The `_={guid}` query string parameter is not added when the `cache` property is set.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("cache", "");
		byutvJsonp.setAttribute("callback-value", "custom_callback_value");
		byutvJsonp.addEventListener("sent", function (event) {
			assert.notMatch(event.detail.options.url, /[?&]{1}_=[0-9a-f]{32}/);
			done();
		});
	});

	test("The `callbackValue` property can be set.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("callback-value", "custom_callback_value");

		assert.isString(byutvJsonp.callbackValue);
		assert.propertyVal(byutvJsonp, "callbackValue", "custom_callback_value");
		assert.isTrue(byutvJsonp.hasAttribute("callback-value"));
	});

	test("The `callbackValue` property replaces the dynamic `callbackValue` in the query string parameter.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("cache", "");
		byutvJsonp.setAttribute("callback-value", "custom_callback_value");
		byutvJsonp.addEventListener("sent", function (event) {
			assert.match(event.detail.options.url, /[?&]{1}callback=custom_callback_value/);
			done();
		});
	});

	test("The `callbackKey` property can be set.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("callback-key", "jsonp");

		assert.isString(byutvJsonp.callbackKey);
		assert.propertyVal(byutvJsonp, "callbackKey", "jsonp");
		assert.isTrue(byutvJsonp.hasAttribute("callback-key"));
	});

	test("The `callbackKey` property replaces the `callback` string key in the query string parameter.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("callback-key", "jsonp");
		byutvJsonp.addEventListener("sent", function (event) {
			assert.match(event.detail.options.url, /[?&]{1}jsonp=byutv_jsonp_callback_[0-9a-f]{32}/);
			assert.notMatch(event.detail.options.url, /[?&]{1}callback=byutv_jsonp_callback_[0-9a-f]{32}/);
			done();
		});
	});

	test("The `debounceDuration` property can be set.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("debounce-duration", "300");

		assert.isNumber(byutvJsonp.debounceDuration);
		assert.propertyVal(byutvJsonp, "debounceDuration", 300);
		assert.isTrue(byutvJsonp.hasAttribute("debounce-duration"));
	});

	test("The `debounceDuration` prevents multiple requests from being sent when non-readOnly attributes change quickly in succession.", function (done) {
		var timesSent = 0;

		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("params", '{"userId":"1"}');

		setTimeout(function () {
			byutvJsonp.setAttribute("params", '{"userId":"2"}');
		}, 300);

		setTimeout(function () {
			byutvJsonp.setAttribute("params", '{"userId":"3"}');
		}, 600);

		setTimeout(function () {
			byutvJsonp.setAttribute("params", '{"userId":"4"}');
		}, 900);

		byutvJsonp.setAttribute("debounce-duration", "1000");

		byutvJsonp.addEventListener("sent", function (event) {
			timesSent++;
		});

		setTimeout(function () {
			assert.strictEqual(timesSent, 1);

			done();
		}, 2000);
	});

	test("The `debounceDuration` allows multiple requests from being sent when non-readOnly attributes change quickly in succession if not set.", function (done) {
		var timesSent = 0;

		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("params", '{"userId":"1"}');

		setTimeout(function () {
			byutvJsonp.setAttribute("params", '{"userId":"2"}');
		}, 300);

		setTimeout(function () {
			byutvJsonp.setAttribute("params", '{"userId":"3"}');
		}, 600);

		setTimeout(function () {
			byutvJsonp.setAttribute("params", '{"userId":"4"}');
		}, 900);

		byutvJsonp.addEventListener("sent", function (event) {
			timesSent++;
		});

		setTimeout(function () {
			assert.strictEqual(timesSent, 4);

			done();
		}, 1000);
	});

	test("The `lastAborted` property does not exist when `abortRequest` is not called.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.generateRequest();
		assert.isFalse(byutvJsonp.lastAborted);
	});

	test("The `lastAborted` property exists when `abortRequest` is called.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		var request = byutvJsonp.generateRequest();
		byutvJsonp.abortRequest();
		assert.isTrue(byutvJsonp.lastAborted);
		assert.isTrue(byutvJsonp.hasAttribute("last-aborted"));
	});

	test("The `lastAborted` property does not exist when aborting only the first of multiple requests.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("params", '{"userId":"1"}');
		var request = byutvJsonp.generateRequest();
		byutvJsonp.setAttribute("params", '{"userId":"2"}');
		byutvJsonp.generateRequest();
		byutvJsonp.abortRequest(request);
		assert.isFalse(byutvJsonp.lastAborted);
	});

	test("The `lastAborted` property exists when aborting only the last of multiple requests.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("params", '{"userId":"1"}');
		byutvJsonp.generateRequest();
		byutvJsonp.setAttribute("params", '{"userId":"2"}');
		byutvJsonp.generateRequest();
		byutvJsonp.abortRequest();
		assert.isTrue(byutvJsonp.lastAborted);
		assert.isTrue(byutvJsonp.hasAttribute("last-aborted"));
	});

	test("The `lastError` property is undefined when no request is sent.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.addEventListener("sent", function () {
			assert.fail();
			done();
		});

		setTimeout(function () {
			assert.isUndefined(byutvJsonp.lastError);

			done();
		}, 1000);
	});

	test("The `lastError` property is undefined when no error resulted from a request.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.addEventListener("complete", function () {
			assert.isUndefined(byutvJsonp.lastError);

			done();
		});
	});

	test("The `lastError` property is an error event when an error resulted from a request.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("params", " ");
		byutvJsonp.addEventListener("error", function () {
			assert.deepPropertyVal(byutvJsonp, "lastError.type", "error");

			done();
		});
	});

	test("The `lastLoad` property is undefined when no request is sent.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.addEventListener("sent", function () {
			assert.fail();
			done();
		});

		setTimeout(function () {
			assert.isUndefined(byutvJsonp.lastLoad);

			done();
		}, 1000);
	});

	test("The `lastLoad` property is an event that resulted from the most recent request.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.addEventListener("load", function () {
			assert.deepPropertyVal(byutvJsonp, "lastLoad.type", "load");

			done();
		});
	});

	test("The `lastRequest` property is undefined when no request is sent.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.addEventListener("sent", function () {
			assert.fail();
			done();
		});

		setTimeout(function () {
			assert.isUndefined(byutvJsonp.lastRequest);

			done();
		}, 1000);
	});

	test("The `lastRequest` property is a Request object that resulted from the most recent request.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.addEventListener("sent", function () {
			assert.isObject(byutvJsonp.lastRequest);

			done();
		});
	});

	test("The `lastResponse` property is undefined when no request is sent.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.addEventListener("sent", function () {
			assert.fail();
			done();
		});

		setTimeout(function () {
			assert.isUndefined(byutvJsonp.lastResponse);

			done();
		}, 1000);
	});

	test("The `lastResponse` property is undefined when no success response resulted from a request.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("params", " ");
		byutvJsonp.addEventListener("complete", function () {
			assert.isUndefined(byutvJsonp.lastResponse);

			done();
		});
	});

	test("The `lastResponse` property is a JSON array when a success response resulted from a request.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.addEventListener("complete", function () {
			assert.isArray(byutvJsonp.lastResponse);

			done();
		});
	});

	test("The `loading` property does not exist when no requests are made.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);

		assert.isFalse(byutvJsonp.loading);
	});

	test("The `loading` property exists when a request is loading.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.addEventListener("sent", function () {
			assert.isTrue(byutvJsonp.loading);
			assert.isTrue(byutvJsonp.hasAttribute("loading"));

			done();
		});
	});

	test("The `loading` property does not exist when a request is done loading.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.addEventListener("complete", function () {
			assert.isFalse(byutvJsonp.loading);

			done();
		});
	});

	test("The `loading` attribute exists when the first request is aborted but another request is loading.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		var request = byutvJsonp.generateRequest();
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.abortRequest(request);
		byutvJsonp.addEventListener("sent", function () {
			assert.isTrue(byutvJsonp.loading);
			assert.isTrue(byutvJsonp.hasAttribute("loading"));

			done();
		});
	});

	test("The `params` property can be set.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("params", '{"userId":"1"}');

		assert.isObject(byutvJsonp.params);
		assert.deepPropertyVal(byutvJsonp, "params.userId", "1");
		assert.isTrue(byutvJsonp.hasAttribute("params"));
	});

	test("The `params` property is used to retrieve the correct data.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("params", '{"userId":"1"}');
		byutvJsonp.addEventListener("complete", function () {
			assert.deepPropertyVal(byutvJsonp, "lastResponse.length", 10);

			done();
		});
	});

	test("The `sync` property can be set.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("sync", "");

		assert.isBoolean(byutvJsonp.sync);
		assert.isTrue(byutvJsonp.sync);
		assert.isTrue(byutvJsonp.hasAttribute("sync"));
	});

	test("The `sync` property forces a request to be synchronous.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("sync", "");
		byutvJsonp.addEventListener("sent", function () {
			assert.deepPropertyVal(byutvJsonp, "lastRequest.script.async", false);

			done();
		});
	});

	test("The `url` property can be set.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);

		assert.isString(byutvJsonp.url);
		assert.strictEqual(byutvJsonp.url, url);
		assert.isTrue(byutvJsonp.hasAttribute("url"));
	});

	test("The `url` attribute throws an error if it is not set.", function () {
		var byutvJsonp = new ByutvJsonp();

		assert.throws(function () {
			byutvJsonp.generateRequest();
		}, Error, "`url` must be declared or set in order to perform a request.");
	});

	test("The `verbose` property can be set.", function () {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("verbose", "");

		assert.isBoolean(byutvJsonp.verbose);
		assert.isTrue(byutvJsonp.verbose);
		assert.isTrue(byutvJsonp.hasAttribute("verbose"));
	});

	test("`abortRequest` removes the request which prevents it from completing.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		var request = byutvJsonp.generateRequest();
		byutvJsonp.addEventListener("complete", function () {
			assert.fail();
			done();
		});
		byutvJsonp.abortRequest(request);

		setTimeout(function () {
			assert.isUndefined(byutvJsonp.lastResponse);

			done();
		}, 2000);
	});

	test("The constructor method (ByutvJsonp) properly sets properties.", function () {
		var byutvJsonp = new ByutvJsonp({
			url: url
		});
		assert.instanceOf(byutvJsonp, ByutvJsonp);
		assert.strictEqual(byutvJsonp.url, url);
	});

	test("`generateRequest` sends a request and returns that request.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.addEventListener("sent", function (event) {
			assert.isObject(event.detail);
			done();
		});
		byutvJsonp.generateRequest();
	});

	test("The `complete` event fires.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.addEventListener("complete", function (event) {
			assert.deepProperty(event, "detail.script");
			done();
		});
	});

	test("The `error` event fires.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.setAttribute("params", " ");
		byutvJsonp.addEventListener("error", function (event) {
			assert.deepPropertyVal(event, "detail.type", "error");
			done();
		});
	});

	test("The `load` event fires.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.addEventListener("load", function (event) {
			assert.deepPropertyVal(event, "detail.type", "load");
			done();
		});
	});

	test("The `response` event fires.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.addEventListener("response", function (event) {
			assert.lengthOf(event.detail, 100);
			done();
		});
	});

	test("The `sent` event fires.", function (done) {
		var byutvJsonp = new ByutvJsonp();
		byutvJsonp.setAttribute("url", url);
		byutvJsonp.setAttribute("auto", "");
		byutvJsonp.addEventListener("sent", function (event) {
			assert.deepProperty(event, "detail.script");
			done();
		});
	});
});