describe('Email', () => {
    const Email = require('../include/utils/email');

    describe('Recovery',() =>{
      var token = null;
      var secret = null;
      test('Get Recovery Token', async () => {
        var tok = await Email.getRecoveryToken();
        console.log(tok)
        token = tok.token;
        secret = tok.secret;
        expect(1).toEqual(1)
      });

      test('Check Recovery Token', async () => {
        var sec = await Email.checkRecoveryToken(token);
        //console.log(sex)
        expect(sec).toEqual(secret)
      });
    })

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

});
