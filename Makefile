
all: publish coverage

coverage:
	rm -rf coverage
	nyc mocha

lint:
	eslint .

lintfix:
	eslint --fix .

publish:
	webpack ./

test:
	mocha

report_coverage: coverage
	#istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

.PHONY: all lint lintfix coverage publish test report_coverage
.SILENT: lint
