const config = require('../include/utils/config');
const Travelling = require('./include/Travelling')('https://127.0.0.1:6969');
var userContainer = require('./include/UserContainer.js');

module.exports = () => {

    test('Lock User Test1 While Test1 is Logged In', async () =>{

        var res = await Travelling.User.editPropertyByUsername('true', 'test', 'locked', {
            headers: {
                cookie: userContainer.user2Cookie(),
            },
        });
          //console.log(res.req._headers,res.statusCode, res.headers, res.body)
        expect(res.body).toEqual(true);

        var res2 = await Travelling.User.editPropertyByUsername('false', 'test', 'locked', {
            headers: {
                cookie: userContainer.user1Cookie(),
            },
        });
        expect(res2.body).not.toEqual(false);

        await Travelling.User.editPropertyByUsername('false', 'test', 'locked', {
            headers: {
                cookie: userContainer.user2Cookie(),
            },
        });

        res2 = await Travelling.User.Current.getUser({
            headers: {
                cookie: userContainer.user1Cookie(),
            },
        });
        expect(res2.body).toMatchObject({username:'test'})

    })

    test('Delete User Test1 While Test1 is Logged In', async () =>{

        var res = await Travelling.User.deleteByUsername('test', {
            headers: {
                cookie: userContainer.user2Cookie(),
            },
        });
          //console.log(res.req._headers,res.statusCode, res.headers, res.body)
        expect(res.statusCode).toEqual(200);

        var res2 = await Travelling.User.editPropertyByUsername('false', 'test', 'locked', {
            headers: {
                cookie: userContainer.user1Cookie(),
            },
        });
        expect(res2.body).not.toEqual(false);

        var res3 = await Travelling.User.Current.editProperty('false', 'locked', {
            headers: {
                cookie: userContainer.user1Cookie(),
            },
        });
        expect(res3.body).not.toEqual(false);
    })


};
