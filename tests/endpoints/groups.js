const config = require('../../include/utils/config');
const Travelling = require('../../sdk')('https://127.0.0.1:6969');
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
      var group1,group2,group3,group4,group5,group6;

      describe('Vaild', () => {

        describe('Create', ()=>{

          /**
            group4
               |____
                    |
                  group3
                     |___________
                        |       |
                      group1  group2
                                |
                              group1
          */


          test('Create a Group With Name group1', async () => {
            var res = await Travelling.Group.create({name:"group1"}, userContainer.user1Token);
            group1 =  res.body;
            expect(res.body).toMatchObject({name:'group1', id: expect.any(String), is_default: false});
          });

          test('Create a Group With Name group2 and Inherited From group1', async () => {
            var res = await Travelling.Group.create({name:"group2", inherited:[group1.id]}, userContainer.user1Token);
            group2 =  res.body;
            expect(res.body).toMatchObject({name:'group2', id: expect.any(String), is_default: false, inherited:[group1.id]});
          });

          test('Create a Default Group With Name group3 and Inherited From group2 & group 1', async () => {
            var res = await Travelling.Group.create({name:"group3", inherited:[group1.id, group2.id], is_default:true}, userContainer.user1Token);
            group3 =  res.body;
            expect(res.body).toMatchObject({name:'group3', id: expect.any(String), is_default: true, inherited:[group1.id, group2.id]});
          });

          test('Create a Default Group With Name group4 and Inherited From group3', async () => {
            var res = await Travelling.Group.create({name:"group4", inherited:[group3.id], is_default:true}, userContainer.user1Token);
            group4 =  res.body;
            expect(res.body).toMatchObject({name:'group4', id: expect.any(String), is_default: true, inherited:[group3.id]});
          });

        })

      });

      describe('Invaild', () => {
        describe('Edit', ()=>{

          test('Circular Group Inheritance', async () => {

            console.log((await Travelling.Groups.get(userContainer.user1Token)).body)
            var res = await Travelling.Group.edit({inherited:[group4.id]}, 'group1', userContainer.user1Token);

            expect(res.statusCode).toEqual(400);
          });

          test('Circular Group Inheritance Inverse', async () => {
            var res = await Travelling.Group.edit({inherited:[]}, 'group4', userContainer.user1Token);
            res = await Travelling.Group.edit({inherited:[group4.id]}, 'group1', userContainer.user1Token);
            res = await Travelling.Group.edit({inherited:[group2.id]}, 'group4', userContainer.user1Token);

            expect(res.statusCode).toEqual(400);
          });

          test('Circular Group Inheritance Self', async () => {
            var res = await Travelling.Group.edit({inherited:[group1.id]}, 'group1', userContainer.user1Token);

            expect(res.statusCode).toEqual(400);
          });
        })

      })

};
