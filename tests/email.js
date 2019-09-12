module.exports = () => {
    const TokenHandler = require('../include/token');

    // describe('Recovery',() =>{
    //   var token = null;
    //   var secret = null;
    //   test('Get Recovery Token', async () => {
    //     var tok = await TokenHandler.getRecoveryToken();
    //     console.log(tok)
    //     token = tok.token;
    //     secret = tok.secret;
    //     expect(1).toEqual(1)
    //   });
    //
    //   test('Check Recovery Token', async () => {
    //     var sec = await TokenHandler.checkRecoveryToken(token);
    //     expect(sec).toEqual(secret)
    //   });
    // })

    // test('Test encryption', async () => {
    //
    //     const aes256 = require('../src/lib/aes256');
    //
    //     var key = AgentDek.getKey(Object.keys(AgentDek.getAgents())[0]);
    //
    //     var cipher = await aes256.encrypt('swag city boiz',key)
    //
    //     expect(await aes256.decrypt(cipher,key)).toEqual('swag city boiz');
    // });
    //
    // test('Stop watching file', () => {
    //     expect(AgentDek.endWatch()).toBeUndefined()
    // });

};
