byutv-jsonp
============

See the [component page](http://coderfin.github.io/byutv-jsonp/components/byutv-jsonp/) for more information.

## About

A Polymer element that facilitates making JSONP request.  Patterned after Polymer's `core-ajax` element and tested using unit tests.

## Installation

It is recommended that you use bower to intstall this Polymer web component.

`bower install --save byutv-jsonp`


## Usage

1) Add the following to your page or another web component.  Typically this import will be added to your page's `<head>` or the top of another web component.

`<link rel="import" href="bower_components/byutv-jsonp/byutv-jsonp.html" />`

2) Add the following to your page where you would like to make the JSONP request.

`<byutv-jsonp auto
			  url="http://jsonplaceholder.typicode.com/posts"
			  params='{"userId":"1"}'
			  response="{{response}}"
			  error="{{error}}"></byutv-jsonp>`

## Documentation

See the [documentation page](http://coderfin.github.io/byutv-jsonp/components/byutv-jsonp/).

## Demo

See the [demo page](http://coderfin.github.io/byutv-jsonp/components/byutv-jsonp/demo.html).

## Tests

1) To run the tests you will need to download the `web-component-tester` project.

`bower install --save web-component-tester`

2) Browse to `/bower_components/byutv-jsonp/test/`

## Changelog

v1.0.1
- Updated README and documentation.
- Set `loading` to `false` before `complete` is run.
- Removed element name from script.

v1.0.0
- Initial Release