#!/bin/bash

./node_modules/.bin/postgen postman/Travelling.postman_collection.json > tests/include/Travelling.js
##../Postgen/index.js postman/Travelling.postman_collection.json > tests/include/Travelling.js