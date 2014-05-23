NAME = Arsenal
BASE_PATH = ./
SRC_PATH = $(BASE_PATH)src/
BUILD_PATH = $(BASE_PATH)
DOC_PATH = $(BASE_PATH)docs/

all: clean build doc test

build:
	mkdir -p $(BUILD_PATH)
	node build all -o $(BUILD_PATH)arsenal.js
	node build all -m -o $(BUILD_PATH)arsenal.min.js

doc: $(BUILD_PATH)arsenal.js
	mkdir -p $(DOC_PATH)
	docco $(SRC_PATH)arsenal.js \
	  $(SRC_PATH)mechanism/*.js \
	  -o $(DOC_PATH)

test: $(BUILD_PATH)arsenal.js
	mocha --reporter spec
	jshint $(BUILD_PATH)arsenal.js

clean:
	cd $(BUILD_PATH)
	rm -rf arsenal.js arsenal.min.js
	rm -rf $(DOC_PATH)

.PHONY: all test clean
