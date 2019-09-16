const config = require('../include/utils/config');
const Travelling = require('../sdk')('https://127.0.0.1:6969');
var userContainer = require('./include/UserContainer.js');

module.exports = () => {

    test('Lock User Test1 While Test1 is Logged In', async () =>{

        var res = await Travelling.User.editProperty('true', 'test', 'locked', null, {
                headers: {
                cookie: userContainer.user2Cookie(),
            },
        });
        // console.log(res.req._headers,res.statusCode, res.headers, res.body)

        expect(res.body).toEqual(true);

        var res2 = await Travelling.User.editProperty('false', 'test', 'locked', null, {
                headers: {
                cookie: userContainer.user1Cookie(),
            },
        });

        expect(res2.body).not.toEqual(false);

        await Travelling.User.editProperty('false', 'test', 'locked', null, {
                headers: {
                cookie: userContainer.user2Cookie(),
            },
        });

        res2 = await Travelling.User.Current.get(null, {
                headers: {
                cookie: userContainer.user1Cookie(),
            },
        });
        expect(res2.body).toMatchObject({username: 'test'});

    });

    test('Delete User Test1 While Test1 is Logged In', async () =>{

        var res = await Travelling.User.delete('test', null, {
                headers: {
                cookie: userContainer.user2Cookie(),
            },
        });
        // console.log(res.req._headers,res.statusCode, res.headers, res.body)

        expect(res.statusCode).toEqual(200);

        var res2 = await Travelling.User.editProperty('false', 'test', 'locked', null, {
                headers: {
                cookie: userContainer.user1Cookie(),
            },
        });

        expect(res2.body).not.toEqual(false);

        var res3 = await Travelling.User.Current.editProperty('false', 'locked', null, {
                headers: {
                cookie: userContainer.user1Cookie(),
            },
        });

        expect(res3.body).not.toEqual(false);
    });

};
