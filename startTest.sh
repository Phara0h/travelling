export $(sed -e '/^#/d' .env | xargs)

jest --coverage --verbose
#node --inspect-brk node_modules/.bin/jest --runInBand --coverage --verbose
