const config = require('../../include/utils/config');
const { Travelling } =  require('../../sdk')('https://127.0.0.1:6969');
var userContainer = require('../include/UserContainer.js');

module.exports = () => {
      var group1,group2,group3,group4,group5;
      var exported;
      describe('Vaild', () => {

        describe('Create', ()=>{

          /**
                group5
            _______|______
            |            |
        superadmin     group4
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

          test('Create a Default Group With Name group5 and Inherited From group4 and superadmin', async () => {
            var superadmin = (await Travelling.Group.get('superadmin', userContainer.user1Token)).body.id;
            var res = await Travelling.Group.create({name:"group5", inherited:[group4.id, superadmin], is_default:true}, userContainer.user1Token);
            group5 =  res.body;
            expect(res.body).toMatchObject({name:'group5', id: expect.any(String), is_default: true, inherited:[group4.id, superadmin]});
          });

        })

        describe('Import/Export', ()=>{
            test('Export Groups', async () => {
                var res = await Travelling.Groups.export(userContainer.user1Token);
                expect(res.statusCode).toEqual(200);
                expect(res.body).toMatchObject({
                 group1: expect.anything(),
                 group2: expect.anything(),
                 group3: expect.anything(),
                 group4: expect.anything(),
                 group5: expect.anything(),
                 anonymous: expect.anything(),
                 superadmin: expect.anything()
               }),
                exported = res.body;
            })
        })

        describe('Edit', ()=>{
            // test('Edit Group 4 to Inherit Superadmin', async () => {
            //     var superadmin = (await Travelling.Group.get('superadmin', userContainer.user1Token)).body.id;
            //     var res = await Travelling.Group.edit({
            //       inherited:[
            //         group3.id,
            //         superadmin
            //       ]
            //     },'group4', userContainer.user1Token);
            //     group4 =  res.body;
            //
            //         console.log((await Travelling.Group.get('group4', userContainer.user1Token)).body);
            //     expect(res.body).toMatchObject({name:'group4', id: expect.any(String), is_default: false, inherited:[group3.id,superadmin]});
            // });
        })

      });

      describe('Invaild', () => {
        describe('Edit', ()=>{

          test('Circular Group Inheritance', async () => {

            //console.log((await Travelling.Groups.get(userContainer.user1Token)).body)
            var res = await Travelling.Group.edit({inherited:[group4.id]}, 'group1', userContainer.user1Token);

            expect(res.statusCode).toEqual(400);
          });

          test('Circular Group Inheritance Inverse', async () => {
            var res = await Travelling.Group.edit({inherited:[]}, 'group4', userContainer.user1Token);
            res = await Travelling.Group.edit({inherited:[group4.id]}, 'group1', userContainer.user1Token);
            res = await Travelling.Group.edit({inherited:[group2.id]}, 'group4', userContainer.user1Token);
            //console.log((await Travelling.Groups.get(userContainer.user1Token)).body)
            expect(res.statusCode).toEqual(400);
          });

          test('Circular Group Inheritance Self', async () => {
            var res = await Travelling.Group.edit({inherited:[group1.id]}, 'group1', userContainer.user1Token);

            expect(res.statusCode).toEqual(400);
          });
        })
      })



    afterAll(async () => {
      //reset groups
      console.log('Reset Groups')
      await Travelling.Groups.import(exported,userContainer.user1Token);
    });
};
