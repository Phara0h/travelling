const config = require('../../include/utils/config');
const Travelling = require('../include/Travelling')('https://127.0.0.1:6969');
var userContainer = require('../include/UserContainer.js');

module.exports = () => {

    describe('Current User', () => {
        describe('Vaild', () => {
        test('Get User Test', async () => {
          var res = await Travelling.User.Current.getUser({
              headers: {
                  cookie: userContainer.user1Cookie(),
              },
          });
          userContainer.user1 = Object.assign(res.body, userContainer.user1);
          expect(res.body).toMatchObject({username:'test'});
        });

        test('Get User Test2', async () => {
          var res = await Travelling.User.Current.getUser({
              headers: {
                  cookie: userContainer.user2Cookie(),
              },
          });
          userContainer.user2 = Object.assign(res.body, userContainer.user2);

          expect(res.body).toMatchObject({username:'test2'});

        });

        test("Get Test's Email", async () => {
          var res = await Travelling.User.Current.getUserProperty('email', {
              headers: {
                  cookie: userContainer.user1Cookie(),
              },
          });

          expect(res.body).toEqual(userContainer.user1.email);
        });

        test("Get Test's Password", async () => {
          var res = await Travelling.User.Current.getUserProperty('password', {
              headers: {
                  cookie: userContainer.user1Cookie(),
              },
          });

          expect(res.body).toEqual(userContainer.user1.password);
        });


        test("Check Test's Permission", async () => {
          var res = await Travelling.User.Current.permissionCheck('get-travelling', {
              headers: {
                  cookie: userContainer.user1Cookie(),
              },
          });

          expect(res.statusCode).toEqual(200);
        });

        test("Check Test's Route", async () => {
          var res = await Travelling.User.Current.routeCheck('get','/travelling/api/v1/user/me', {
              headers: {
                  cookie: userContainer.user1Cookie(),
              },
          });

          expect(res.statusCode).toEqual(200);
        });

        test("Check Anonymous's Permission", async () => {
          var res = await Travelling.User.Current.permissionCheck('delete-travelling-api-v1-user-me');

          expect(res.statusCode).toEqual(401);
        });

        test("Check Anonymous's Route", async () => {
          var res = await Travelling.User.Current.routeCheck('delete','/travelling/api/v1/user/me');

          expect(res.statusCode).toEqual(401);
        });

      });

        describe('Invaild', () => {
          test("Check Permission With No Permission", async () => {
            var res = await Travelling.User.Current.permissionCheck('', {
                headers: {
                    cookie: userContainer.user1Cookie(),
                },
            });

            expect(res.statusCode).toEqual(401);
          });

          test("Check Route With No Route & No Method", async () => {
            var res = await Travelling.User.Current.routeCheck('','', {
                headers: {
                    cookie: userContainer.user1Cookie(),
                },
            });

            expect(res.statusCode).toEqual(401);
          });
        })


    });

    describe('Non-Current User', () => {
        describe('Vaild', () => {
        test('Get All Users', async () => {
            var res = await Travelling.User.getAll({
                headers: {
                    cookie: userContainer.user1Cookie(),
                },
            });

            expect(res.body).toHaveLength(4);
        });

        test('Get By Id', async () => {
            var res = await Travelling.User.getById(userContainer.user1.id,{
                headers: {
                    cookie: userContainer.user1Cookie(),
                },
            });

            expect(res.body).toMatchObject({username:'test'});
        });

        test('Get By Username', async () => {
            var res = await Travelling.User.getByUsername(userContainer.user1.username,{
                headers: {
                    cookie: userContainer.user1Cookie(),
                },
            });

            expect(res.body).toMatchObject({username:'test'});
        });


        test("Get Test2's Password By Id ", async () => {
            var res = await Travelling.User.getPropertyById(userContainer.user2.id, 'password', {
                headers: {
                    cookie: userContainer.user2Cookie(),
                },
            });

              expect(res.body).toEqual(userContainer.user2.password);
        });

        test("Get Test2's Email By Username ", async () => {
            var res = await Travelling.User.getPropertyByUsername( userContainer.user2.username, 'email',{
                headers: {
                    cookie: userContainer.user2Cookie(),
                },
            });

              expect(res.body).toEqual(userContainer.user2.email);
        });
      });

      describe('Invaild', () => {
        test('Get By Invalid Id', async () => {
            var res = await Travelling.User.getById(0,{
                headers: {
                    cookie: userContainer.user1Cookie(),
                },
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Get By No Id', async () => {
            var res = await Travelling.User.getById('',{
                headers: {
                    cookie: userContainer.user1Cookie(),
                },
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Get By Invalid Username', async () => {
            var res = await Travelling.User.getByUsername('coolusername',{
                headers: {
                    cookie: userContainer.user1Cookie(),
                },
            });

            expect(res.statusCode).toEqual(400);
        });

        test('Get By No Username', async () => {
            var res = await Travelling.User.getByUsername('',{
                headers: {
                    cookie: userContainer.user1Cookie(),
                },
            });

            expect(res.statusCode).toEqual(400);
        });

      })
    });

};