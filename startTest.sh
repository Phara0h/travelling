export $(sed -e '/^#/d' .testENV | xargs)

jest --coverage --verbose --forceExit --detectOpenHandles
#node --inspect-brk node_modules/.bin/jest --runInBand --coverage --verbose
