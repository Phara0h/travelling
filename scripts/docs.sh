#!/bin/bash
./node_modules/.bin/postgen postman/Travelling.postman_collection.json > sdk/index.js
##../Postgen/index.js postman/Travelling.postman_collection.json > sdk/index.js
./node_modules/.bin/jsdoc2md sdk/index.js  > sdk/README.md
