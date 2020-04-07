coverage:
	rm -rf coverage
	npx istanbul cover node_modules/.bin/_mocha

lint:
	npx eslint --reset .

build:
	npx webpack ./
	npx uglifyjs dist/markdown-it-imsize.js > dist/markdown-it-imsize.min.js

test:
	npx mocha

test-ci:
	npx istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

.PHONY: lint coverage
.SILENT: lint
