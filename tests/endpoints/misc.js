const config = require('../../include/utils/config');
const { Travelling } = require('../../sdk')('http://127.0.0.1:6969/' + config.serviceName, {
  resolveWithFullResponse: true
});
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
  test('Health Check', async () => {
    var res = await Travelling.healthCheck(userContainer.user1Token);

    expect(res.statusCode).toEqual(200);
  });

  test('Get Metrics', async () => {
    var res = await Travelling.metrics(userContainer.user1Token);

    expect(res.statusCode).toEqual(200);
  });

  test('Get Config Property ', async () => {
    var res = await Travelling.Config.getProperty('password', userContainer.user1Token);

    //If this fails do to change make sure to update the client code that uses this.
    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      consecutive: expect.any(Boolean),
      minchar: expect.any(Number),
      maxchar: expect.anything(),
      special: expect.any(Number),
      number: expect.any(Number),
      lowercase: expect.any(Number),
      uppercase: expect.any(Number)
    });
  });
};
