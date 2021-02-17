## Classes

<dl>
<dt><a href="#Travelling">Travelling</a></dt>
<dd></dd>
<dt><a href="#Config">Config</a></dt>
<dd></dd>
<dt><a href="#Groups">Groups</a></dt>
<dd></dd>
<dt><a href="#GroupsType">GroupsType</a></dt>
<dd></dd>
<dt><a href="#Group">Group</a></dt>
<dd></dd>
<dt><a href="#GroupUsers">GroupUsers</a></dt>
<dd></dd>
<dt><a href="#GroupUser">GroupUser</a></dt>
<dd></dd>
<dt><a href="#GroupType">GroupType</a></dt>
<dd></dd>
<dt><a href="#GroupTypeUsers">GroupTypeUsers</a></dt>
<dd><p>Both requests are disabled. Dont use.</p>
</dd>
<dt><a href="#GroupTypeUser">GroupTypeUser</a></dt>
<dd></dd>
<dt><a href="#GroupRequest">GroupRequest</a></dt>
<dd></dd>
<dt><a href="#GroupRequestUser">GroupRequestUser</a></dt>
<dd></dd>
<dt><a href="#Users">Users</a></dt>
<dd></dd>
<dt><a href="#User">User</a></dt>
<dd></dd>
<dt><a href="#UserCurrent">UserCurrent</a></dt>
<dd></dd>
<dt><a href="#Auth">Auth</a></dt>
<dd><h4 id="auth-endpoints">Auth endpoints</h4>
</dd>
<dt><a href="#AuthDomain">AuthDomain</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#SDK">SDK(host, opts)</a></dt>
<dd><p>SDK - importing the SDK for use</p>
</dd>
</dl>

<a name="Travelling"></a>

## Travelling
**Kind**: global class  

* [Travelling](#Travelling)
    * [.healthCheck(authorization_bearer)](#Travelling.healthCheck)
    * [.metrics(authorization_bearer)](#Travelling.metrics)

<a name="Travelling.healthCheck"></a>

### Travelling.healthCheck(authorization_bearer)
healthCheck - server's health check

Path: health

**Kind**: static method of [<code>Travelling</code>](#Travelling)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Travelling.metrics"></a>

### Travelling.metrics(authorization_bearer)
metrics - servers metrics

Path: metrics

**Kind**: static method of [<code>Travelling</code>](#Travelling)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Config"></a>

## Config
**Kind**: global class  
<a name="Config.getProperty"></a>

### Config.getProperty(property, authorization_bearer)
getProperty - Gets a property from travellings config.

Path: api/v1/config/:property

**Kind**: static method of [<code>Config</code>](#Config)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>any</code> | (example: password) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Groups"></a>

## Groups
**Kind**: global class  

* [Groups](#Groups)
    * [.export(authorization_bearer)](#Groups.export)
    * [.import(body, authorization_bearer)](#Groups.import)
    * [.get(authorization_bearer)](#Groups.get)

<a name="Groups.export"></a>

### Groups.export(authorization_bearer)
export - Exports all groups in the proper format to be imported.

Path: api/v1/groups/export

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Groups.import"></a>

### Groups.import(body, authorization_bearer)
import - Imports all groups from the exported format.

Path: api/v1/groups/import

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
    "group": {
        "anonymous": {
            "type": "group",
            "allowed": [
                {
                    "route": "/travelling/portal/*",
                    "host": null,
                    "name": "*-travelling-portal-*"
                },
                {
                    "route": "/travelling/api/v1/auth/*",
                    "host": null,
                    "name": "*-travelling-api-v1-auth-*"
                },
                {
                    "route": "/travelling/api/v1/user/me/route/allowed",
                    "host": null,
                    "method": "GET",
                    "name": "get-travelling-api-v1-user-me-route-allowed"
                },
                {
                    "route": "/travelling/api/v1/user/me/permission/allowed/*",
                    "host": null,
                    "method": "GET",
                    "name": "get-travelling-api-v1-user-me-permission-allowed-*"
                },
                {
                    "route": "/travelling/assets/*",
                    "host": null,
                    "removeFromPath": "/travelling/assets/",
                    "method": "GET",
                    "name": "get-travelling-assets-*"
                },
                {
                    "route": "/travelling/api/v1/config/password",
                    "host": null,
                    "method": "GET",
                    "name": "get-travelling-api-v1-config-password"
                },
                {
                    "route": "/favicon.ico",
                    "host": null,
                    "method": "GET",
                    "name": "get-favicon.ico"
                }
            ],
            "inherited": null,
            "is_default": false
        },
        "group3": {
            "type": "group",
            "allowed": null,
            "inherited": [
                "testgroup|group1",
                "group|group2"
            ],
            "is_default": false
        },
        "superadmin": {
            "type": "group",
            "allowed": [
                {
                    "host": null,
                    "route": "/travelling/*",
                    "name": "*-travelling-*"
                },
                {
                    "name": "test-one-*-three"
                }
            ],
            "inherited": [
                "group|anonymous"
            ],
            "is_default": false
        },
        "group4": {
            "type": "group",
            "allowed": null,
            "inherited": [],
            "is_default": false
        },
        "group2": {
            "type": "group",
            "allowed": [
                {
                    "route": "/test/get",
                    "host": "https://127.0.0.1:4268/:username/:group",
                    "removeFromPath": "/test/get",
                    "method": "GET",
                    "name": "get-test-get"
                },
                {
                    "route": "/test/post",
                    "host": "http://127.0.0.1:4267/?id=:id&permission=:permission",
                    "removeFromPath": "/test/post",
                    "method": "POST",
                    "name": "post-test-post"
                }
            ],
            "inherited": [
                "testgroup|group1"
            ],
            "is_default": false
        },
        "group5": {
            "type": "group",
            "allowed": [
                {
                    "route": "/test/delete/:grouptype",
                    "host": "https://127.0.0.1:4268",
                    "removeFromPath": "/test/delete",
                    "method": "DELETE",
                    "name": "delete-test-delete-:grouptype"
                }
            ],
            "inherited": [
                "group|group4",
                "group|superadmin"
            ],
            "is_default": true
        },
        "group1": {
            "type": "group",
            "allowed": null,
            "inherited": null,
            "is_default": false
        }
    },
    "testgroup": {
        "group1": {
            "type": "testgroup",
            "allowed": null,
            "inherited": [
                "group|group4"
            ],
            "is_default": false
        },
        "superadmin": {
            "type": "testgroup",
            "allowed": null,
            "inherited": null,
            "is_default": false
        }
    }
}
```
<a name="Groups.get"></a>

### Groups.get(authorization_bearer)
get - Get all the groups

Path: api/v1/groups

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupsType"></a>

## GroupsType
**Kind**: global class  

* [GroupsType](#GroupsType)
    * [.all(type, authorization_bearer)](#GroupsType.all)
    * [.getTypesList(authorization_bearer)](#GroupsType.getTypesList)

<a name="GroupsType.all"></a>

### GroupsType.all(type, authorization_bearer)
all - Gets all groups of a particular type

Path: api/v1/groups/type/:type

**Kind**: static method of [<code>GroupsType</code>](#GroupsType)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupsType.getTypesList"></a>

### GroupsType.getTypesList(authorization_bearer)
getTypesList - Gets all the types of groups currently made.

Path: api/v1/groups/types

**Kind**: static method of [<code>GroupsType</code>](#GroupsType)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group"></a>

## Group
**Kind**: global class  

* [Group](#Group)
    * [.addPermission(id, permission, authorization_bearer)](#Group.addPermission)
    * [.deletePermission(id, permission, authorization_bearer)](#Group.deletePermission)
    * [.addRoute(body, id, authorization_bearer)](#Group.addRoute)
    * [.removeInheritance(id, inherited, grouptype, authorization_bearer)](#Group.removeInheritance)
    * [.inheritFrom(id, inherited, grouptype, authorization_bearer)](#Group.inheritFrom)
    * [.setDefault(id, authorization_bearer)](#Group.setDefault)
    * [.delete(id, authorization_bearer)](#Group.delete)
    * [.edit(body, id, authorization_bearer)](#Group.edit)
    * [.get(id, authorization_bearer)](#Group.get)
    * [.createByName(id, authorization_bearer)](#Group.createByName)
    * [.create(body, authorization_bearer)](#Group.create)

<a name="Group.addPermission"></a>

### Group.addPermission(id, permission, authorization_bearer)
addPermission - Adds a permission to a group.

Path: api/v1/group/id/:id/insert/permission/:permission

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: anonymous) |
| permission | <code>any</code> | Permission (example: test-one-two-*) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.deletePermission"></a>

### Group.deletePermission(id, permission, authorization_bearer)
deletePermission - Removes a permission/route from a group.

Path: api/v1/group/id/:id/permission/:permission

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: anonymous) |
| permission | <code>any</code> | Name or Route (example: test-one-two-*) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.addRoute"></a>

### Group.addRoute(body, id, authorization_bearer)
addRoute - Adds a route to a group.

```javascript
{
    "route": "test/permissions/*", // optional
    "host": null, // optional, defaults to travelling host
    "method": "*", // optional, defaults to '*'
    "remove_from_path": 'test/', // optional 
    "name": "test-permissions-*"  // Required and needs to be unqiue, defaults to method + route seperated by '-' instead of `/`
}
```

Path: api/v1/group/id/:id/insert/route

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"route": "test/permissions/*",
    "host": null, 
    "method": "*", 
    "name": "test-permissions-*"  
}
```
<a name="Group.removeInheritance"></a>

### Group.removeInheritance(id, inherited, grouptype, authorization_bearer)
removeInheritance - Removes an inheritance from a group.

Path: api/v1/group/id/:id/remove/inheritance/:inherited/type/:grouptype

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: test1234) |
| inherited | <code>any</code> | Name of the group to inherit from (example: group4) |
| grouptype | <code>any</code> | The type of the inherited group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.inheritFrom"></a>

### Group.inheritFrom(id, inherited, grouptype, authorization_bearer)
inheritFrom - Adds an inheritance to a group.

Path: api/v1/group/id/:id/inherit/from/:inherited/type/:grouptype

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: test1234) |
| inherited | <code>any</code> | Name of the group to inherit from (example: group4) |
| grouptype | <code>any</code> | The type of the inherited group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.setDefault"></a>

### Group.setDefault(id, authorization_bearer)
setDefault - Sets the group to be the default group for new users.

Path: api/v1/group/id/:id/set/default

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name (example: group6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.delete"></a>

### Group.delete(id, authorization_bearer)
delete - delete group by its id or name

Path: api/v1/group/id/:id

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.edit"></a>

### Group.edit(body, id, authorization_bearer)
edit - Edits a group

Path: api/v1/group/id/:id

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | (example: ab31efc8-40a5-4d38-a347-adb4e38d0075) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
    "allowed": [
        {
            "route": "/travelling/portal/*",
            "host": null,
            "remove_from_path": "/travelling/portal",
            "method": "*",
            "name": "*-travelling-portal-*"
        },
        {
            "route": "/travelling/api/v1/auth/*",
            "host": null,
            "method": "*",
            "name": "*-travelling-api-v1-auth-*"
        },
        {
            "route": "/travelling/api/v1/user/me/route/allowed",
            "host": null,
            "method": "GET",
            "name": "get-travelling-api-v1-user-me-route-allowed"
        },
        {
            "route": "/travelling/api/v1/user/me/permission/allowed/*",
            "host": null,
            "method": "GET",
            "name": "get-travelling-api-v1-user-me-permission-allowed-*"
        },
        {
            "route": "/travelling/assets/*",
            "host": null,
            "remove_from_path": "/travelling/assets/",
            "method": "*",
            "name": "*-travelling-assets-*"
        },
        {
            "route": "travelling/api/v1/config/password",
            "host": null,
            "method": "get"
        }
    ]
}
```
<a name="Group.get"></a>

### Group.get(id, authorization_bearer)
get - Get a group by it's id or name.

Path: api/v1/group/id/:id

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name  (example: group1) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.createByName"></a>

### Group.createByName(id, authorization_bearer)
createByName - Add a new blank group with the set name.

Path: api/v1/group/id/:id

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the new group (example: test123) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.create"></a>

### Group.create(body, authorization_bearer)
create - Add a new group

Path: api/v1/group

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
    "name": "group1",
    "type": "accounts",
    "allowed": [
        {
            "route": "/test",
            "host": "http://127.0.0.1:1237/",
            "remove_from_path": "test",
            "method": "*",
            "name": "all-test"
        }
    ],
    "is_default": false
}
```
<a name="GroupUsers"></a>

## GroupUsers
**Kind**: global class  

* [GroupUsers](#GroupUsers)
    * [.inherited(id)](#GroupUsers.inherited)
    * [.get(id)](#GroupUsers.get)

<a name="GroupUsers.inherited"></a>

### GroupUsers.inherited(id)
inherited - Gets all the users that belong to the group and all of its inherited groups.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/group/id/:id/users/inherited

**Kind**: static method of [<code>GroupUsers</code>](#GroupUsers)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name (example: superadmin) |

<a name="GroupUsers.get"></a>

### GroupUsers.get(id)
get - Gets all the users that belong to the group.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/group/id/:id/users

**Kind**: static method of [<code>GroupUsers</code>](#GroupUsers)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name (example: superadmin) |

<a name="GroupUser"></a>

## GroupUser
**Kind**: global class  

* [GroupUser](#GroupUser)
    * [.delete(group, type, id, authorization_bearer)](#GroupUser.delete)
    * [.removeGroupInheritance(group, type, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#GroupUser.removeGroupInheritance)
    * [.addGroupInheritance(group, type, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#GroupUser.addGroupInheritance)
    * [.editPropertyValue(group, type, id, property, value, authorization_bearer)](#GroupUser.editPropertyValue)
    * [.editProperty(body, group, type, id, property, authorization_bearer)](#GroupUser.editProperty)
    * [.edit(body, group, type, id, authorization_bearer)](#GroupUser.edit)
    * [.getProperty(group, type, id, property, authorization_bearer)](#GroupUser.getProperty)
    * [.get(group, type, id, authorization_bearer)](#GroupUser.get)

<a name="GroupUser.delete"></a>

### GroupUser.delete(group, type, id, authorization_bearer)
delete - Delete a user by it's id or username from group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user7) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupUser.removeGroupInheritance"></a>

### GroupUser.removeGroupInheritance(group, type, id, inheritgroupid, inheritgrouptype, authorization_bearer)
removeGroupInheritance - Remove a user to a group of a particular type of group.

Path: api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group (example: group1) |
| type | <code>any</code> | type of group (example: group) |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupUser.addGroupInheritance"></a>

### GroupUser.addGroupInheritance(group, type, id, inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a group for the current user from a group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group (example: group1) |
| type | <code>any</code> | type of group (example: group) |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupUser.editPropertyValue"></a>

### GroupUser.editPropertyValue(group, type, id, property, value, authorization_bearer)
editPropertyValue - Edit a current user's property data as a path param from a group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id/property/:property/:value

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: group) |
| id | <code>any</code> | id or name (example: user5) |
| property | <code>any</code> | (example: email) |
| value | <code>any</code> | (example: swag@yolo.com) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupUser.editProperty"></a>

### GroupUser.editProperty(body, group, type, id, property, authorization_bearer)
editProperty - Edit a user's property by it's id or username from a group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id/property/:property

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| property | <code>any</code> | (example: email) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="GroupUser.edit"></a>

### GroupUser.edit(body, group, type, id, authorization_bearer)
edit - Edit a user by it's id or username from group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="GroupUser.getProperty"></a>

### GroupUser.getProperty(group, type, id, property, authorization_bearer)
getProperty - Get a user's property by it's id or username from group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id/property/:property

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| property | <code>any</code> | (example: email) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupUser.get"></a>

### GroupUser.get(group, type, id, authorization_bearer)
get - Get a user by it's id or username from group of a particular type.

Path: api/v1/group/id/:group/type/:type/user/:id

**Kind**: static method of [<code>GroupUser</code>](#GroupUser)  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>any</code> | id or name of the group |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType"></a>

## GroupType
**Kind**: global class  

* [GroupType](#GroupType)
    * [.deletePermission(id, type, permission, authorization_bearer)](#GroupType.deletePermission)
    * [.addPermission(id, type, permission, authorization_bearer)](#GroupType.addPermission)
    * [.addRoute(body, id, type, authorization_bearer)](#GroupType.addRoute)
    * [.removeInheritance(id, type, inherited, grouptype, authorization_bearer)](#GroupType.removeInheritance)
    * [.inheritFrom(id, type, inherited, grouptype, authorization_bearer)](#GroupType.inheritFrom)
    * [.setDefault(id, type)](#GroupType.setDefault)
    * [.delete(id, type, authorization_bearer)](#GroupType.delete)
    * [.get(id, type, authorization_bearer)](#GroupType.get)
    * [.edit(body, id, type, authorization_bearer)](#GroupType.edit)
    * [.createByName(id, type, authorization_bearer)](#GroupType.createByName)
    * [.create(body, type, authorization_bearer)](#GroupType.create)

<a name="GroupType.deletePermission"></a>

### GroupType.deletePermission(id, type, permission, authorization_bearer)
deletePermission - Removes a permission/route from a group of a particular type.

Path: api/v1/group/id/:id/type/:type/permission/:permission

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: anonymous) |
| type | <code>any</code> | Type of the group (example: group) |
| permission | <code>any</code> | Name or Route (example: test-one-three-*) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.addPermission"></a>

### GroupType.addPermission(id, type, permission, authorization_bearer)
addPermission - Adds a permission to a group of a particular type.

Path: api/v1/group/id/:id/type/:type/insert/permission/:permission

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: anonymous) |
| type | <code>any</code> | Type of the group (example: group) |
| permission | <code>any</code> | Permission  (example: test-one-three-*) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.addRoute"></a>

### GroupType.addRoute(body, id, type, authorization_bearer)
addRoute - Adds a route to a group of a particular type.

```javascript
{
    "route": "test/permissions/*", // optional
    "host": null, // optional, defaults to travelling host
    "method": "*", // optional, defaults to '*'
    "remove_from_path": 'test/', // optional 
    "name": "test-permissions-*"  // Required and needs to be unqiue, defaults to method + route seperated by '-' instead of `/`
}
```

Path: api/v1/group/id/:id/type/:type/insert/route

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | Name of the group |
| type | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"route": "test/permissions/*",
    "host": null, 
    "method": "*", 
    "name": "test-permissions-*"  
}
```
<a name="GroupType.removeInheritance"></a>

### GroupType.removeInheritance(id, type, inherited, grouptype, authorization_bearer)
removeInheritance - Removes an inheritance from a group of a particular type.

Path: api/v1/group/id/:id/type/:type/remove/inheritance/:inherited/type/:grouptype

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: test1234) |
| type | <code>any</code> | The type of the group (example: accounts) |
| inherited | <code>any</code> | Name of the group to inherit from (example: superadmin) |
| grouptype | <code>any</code> | The type of the inherited group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.inheritFrom"></a>

### GroupType.inheritFrom(id, type, inherited, grouptype, authorization_bearer)
inheritFrom - Adds an inheritance to a group of a particular type.

Path: api/v1/group/id/:id/type/:type/inherit/from/:inherited/type/:grouptype

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the group (example: group1) |
| type | <code>any</code> | The type of the group (example: testgroup) |
| inherited | <code>any</code> | Name of the group to inherit from (example: test123) |
| grouptype | <code>any</code> | The type of the inherited group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.setDefault"></a>

### GroupType.setDefault(id, type)
setDefault - Sets the group of a particular type to be the default group for new users.

Path: api/v1/group/id/:id/type/:type/set/default

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name (example: group1) |
| type | <code>any</code> | The type of the group (example: account) |

<a name="GroupType.delete"></a>

### GroupType.delete(id, type, authorization_bearer)
delete - delete group of a particular type by its name or id

Path: api/v1/group/id/:id/type/:type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name |
| type | <code>any</code> | The type of the group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.get"></a>

### GroupType.get(id, type, authorization_bearer)
get - Get a group by it's id or name of a particular type.

Path: api/v1/group/id/:id/type/:type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name  (example: group1) |
| type | <code>any</code> | The type of the group (example: accounts) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.edit"></a>

### GroupType.edit(body, id, type, authorization_bearer)
edit - Edits a group of a particular type

Path: api/v1/group/id/:id/type/:type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | id or name |
| type | <code>any</code> | The type of the group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{"inherited":["a717b880-b17b-4995-9610-cf451a06d015","7ec8c351-7b8a-4ea8-95cc-0d990b225768"]}
```
<a name="GroupType.createByName"></a>

### GroupType.createByName(id, type, authorization_bearer)
createByName - Add a new blank group with the set name and type

Path: api/v1/group/id/:id/type/:type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Name of the new group (example: test1234) |
| type | <code>any</code> | Type of the new group (example: accounts) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.create"></a>

### GroupType.create(body, type, authorization_bearer)
create - Add a new group of a particular type

Path: api/v1/group/type/:type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | The type of the group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
    "name": "group1",
    "type": "accounts",
    "allowed": [
        {
            "route": "/test",
            "host": "http://127.0.0.1:1237/",
            "remove_from_path": "test",
            "method": "*",
            "name": "all-test"
        }
    ],
    "is_default": false
}
```
<a name="GroupTypeUsers"></a>

## GroupTypeUsers
Both requests are disabled. Dont use.

**Kind**: global class  

* [GroupTypeUsers](#GroupTypeUsers)
    * [.get(id, type)](#GroupTypeUsers.get)
    * [.inherited(id, type)](#GroupTypeUsers.inherited)

<a name="GroupTypeUsers.get"></a>

### GroupTypeUsers.get(id, type)
get - Gets all the users that belong to the group  of a particular type by its name or id.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/group/id/:id/type/:type/users

**Kind**: static method of [<code>GroupTypeUsers</code>](#GroupTypeUsers)  

| Param | Type |
| --- | --- |
| id | <code>any</code> | 
| type | <code>any</code> | 

<a name="GroupTypeUsers.inherited"></a>

### GroupTypeUsers.inherited(id, type)
inherited - Gets all the users that belong to the group  of a particular type by its name or id and all of its inherited groups.

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/group/id/:id/type/:type/users/inherited

**Kind**: static method of [<code>GroupTypeUsers</code>](#GroupTypeUsers)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: group4) |
| type | <code>any</code> | The type of the group (example: groups) |

<a name="GroupTypeUser"></a>

## GroupTypeUser
**Kind**: global class  

* [GroupTypeUser](#GroupTypeUser)
    * [.delete(type, id, authorization_bearer)](#GroupTypeUser.delete)
    * [.removeGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#GroupTypeUser.removeGroupInheritance)
    * [.addGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#GroupTypeUser.addGroupInheritance)
    * [.editPropertyValue(type, id, property, value, authorization_bearer)](#GroupTypeUser.editPropertyValue)
    * [.editProperty(body, type, id, property, authorization_bearer)](#GroupTypeUser.editProperty)
    * [.edit(body, type, id, authorization_bearer)](#GroupTypeUser.edit)
    * [.getProperty(type, id, property, authorization_bearer)](#GroupTypeUser.getProperty)
    * [.get(type, id, authorization_bearer)](#GroupTypeUser.get)

<a name="GroupTypeUser.delete"></a>

### GroupTypeUser.delete(type, id, authorization_bearer)
delete - Delete a user by it's id or username from group of a particular type.

Path: api/v1/group/type/:type/user/:id

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user7) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupTypeUser.removeGroupInheritance"></a>

### GroupTypeUser.removeGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)
removeGroupInheritance - Remove a user to a group of a particular type of group.

Path: api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | type of group (example: group) |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupTypeUser.addGroupInheritance"></a>

### GroupTypeUser.addGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a user to a group of a particular type of group.

Path: api/v1/group/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | type of group (example: group) |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupTypeUser.editPropertyValue"></a>

### GroupTypeUser.editPropertyValue(type, id, property, value, authorization_bearer)
editPropertyValue - Edit a current user's property data as a path param from a group of a particular type.

Path: api/v1/group/type/:type/user/:id/property/:property/:value

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group (example: group) |
| id | <code>any</code> | id or name (example: user5) |
| property | <code>any</code> | (example: email) |
| value | <code>any</code> | (example: swag@yolo.com) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupTypeUser.editProperty"></a>

### GroupTypeUser.editProperty(body, type, id, property, authorization_bearer)
editProperty - Edit a user's property by it's id or username from a group of a particular type.

Path: api/v1/group/type/:type/user/:id/property/:property

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| property | <code>any</code> | (example: email) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="GroupTypeUser.edit"></a>

### GroupTypeUser.edit(body, type, id, authorization_bearer)
edit - Edit a user by it's id or username from group of a particular type.

Path: api/v1/group/type/:type/user/:id

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="GroupTypeUser.getProperty"></a>

### GroupTypeUser.getProperty(type, id, property, authorization_bearer)
getProperty - Get a user's property by it's id or username from group of a particular type.

Path: api/v1/group/type/:type/user/:id/property/:property

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| property | <code>any</code> | (example: email) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupTypeUser.get"></a>

### GroupTypeUser.get(type, id, authorization_bearer)
get - Get a user by it's id or username from group of a particular type.

Path: api/v1/group/type/:type/user/:id

**Kind**: static method of [<code>GroupTypeUser</code>](#GroupTypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupRequest"></a>

## GroupRequest
**Kind**: global class  
<a name="GroupRequestUser"></a>

## GroupRequestUser
**Kind**: global class  

* [GroupRequestUser](#GroupRequestUser)
    * [.delete(body, type, id, authorization_bearer)](#GroupRequestUser.delete)
    * [.addGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#GroupRequestUser.addGroupInheritance)
    * [.editProperty(body, type, id, property, authorization_bearer)](#GroupRequestUser.editProperty)
    * [.edit(body, type, id, authorization_bearer)](#GroupRequestUser.edit)

<a name="GroupRequestUser.delete"></a>

### GroupRequestUser.delete(body, type, id, authorization_bearer)
delete - Delete a user by it's id or username from the user's `group_request` of a particular type.

Path: api/v1/group/request/type/:type/user/:id

**Kind**: static method of [<code>GroupRequestUser</code>](#GroupRequestUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | (example: testgroup) |
| id | <code>any</code> | (example: user69) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="GroupRequestUser.addGroupInheritance"></a>

### GroupRequestUser.addGroupInheritance(type, id, inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a user to a group from the user's `group_request` of a particular type.

Path: api/v1/group/request/type/:type/user/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>GroupRequestUser</code>](#GroupRequestUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | type of group (example: group) |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupRequestUser.editProperty"></a>

### GroupRequestUser.editProperty(body, type, id, property, authorization_bearer)
editProperty - Edit a user's property by it's id or username from the user's `group_request` of a particular type.

Path: api/v1/group/request/type/:type/user/:id/property/:property

**Kind**: static method of [<code>GroupRequestUser</code>](#GroupRequestUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | (example: accounts) |
| id | <code>any</code> | (example: user6) |
| property | <code>any</code> | (example: email) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
"chad@yolo.com"
```
<a name="GroupRequestUser.edit"></a>

### GroupRequestUser.edit(body, type, id, authorization_bearer)
edit - Edit a user by it's id or username from the user's `group_request` of a particular type.

Path: api/v1/group/request/type/:type/user/:id

**Kind**: static method of [<code>GroupRequestUser</code>](#GroupRequestUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | (example: accounts) |
| id | <code>any</code> | (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"locked": false
}
```
<a name="Users"></a>

## Users
**Kind**: global class  

* [Users](#Users)
    * [.byGroupRequest(group_request, authorization_bearer)](#Users.byGroupRequest)
    * [.get(authorization_bearer)](#Users.get)

<a name="Users.byGroupRequest"></a>

### Users.byGroupRequest(group_request, authorization_bearer)
byGroupRequest - Gets all the users that have the specified group request

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/users/group/request/:group_request

**Kind**: static method of [<code>Users</code>](#Users)  

| Param | Type | Description |
| --- | --- | --- |
| group_request | <code>any</code> | name of the group  (example: superadmin) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Users.get"></a>

### Users.get(authorization_bearer)
get - Gets all the users

##### Optional Query Params

| Param | Description |
| --- | --- |
| id | *optional* (example:  26c6aeff-ab95-4bdd-8260-534cf92d1c23) |
| username | *optional* (example:  user7) |
| locked | *optional* (example:  true) |
| locked_reason | *optional* (example:  Activation Required email your admin to get your account activated) |
| group_request | *optional* (example:  superadmin) |
| failed_login_attempts | *optional* (example:  0) |
| change_username | *optional* (example:  false) |
| change_password | *optional* (example:  false) |
| reset_password | *optional* (example:  false) |
| email_verify | *optional* (example:  false) |
| group_id | *optional* (example:  7320292c-627e-4e5a-b059-583eabdd6264) |
| email | *optional* (example:  test@test.ai) |
| created_on | *optional* (example:  1568419646794) |
| last_login | *optional* (example:  null) |

Path: api/v1/users

**Kind**: static method of [<code>Users</code>](#Users)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User"></a>

## User
**Kind**: global class  

* [User](#User)
    * [.delete(id, authorization_bearer)](#User.delete)
    * [.removeGroupInheritance(id, inheritgroupid, inheritgrouptype, authorization_bearer)](#User.removeGroupInheritance)
    * [.addGroupInheritance(id, inheritgroupid, inheritgrouptype, authorization_bearer)](#User.addGroupInheritance)
    * [.editPropertyValue(id, property, value, authorization_bearer)](#User.editPropertyValue)
    * [.editProperty(body, id, property, authorization_bearer)](#User.editProperty)
    * [.edit(body, id, authorization_bearer)](#User.edit)
    * [.getProperty(id, property, authorization_bearer)](#User.getProperty)
    * [.get(id, authorization_bearer)](#User.get)

<a name="User.delete"></a>

### User.delete(id, authorization_bearer)
delete - Delete a user by it's Id.

Path: api/v1/user/id/:id

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.removeGroupInheritance"></a>

### User.removeGroupInheritance(id, inheritgroupid, inheritgrouptype, authorization_bearer)
removeGroupInheritance - Remove a user from a group.

Path: api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.addGroupInheritance"></a>

### User.addGroupInheritance(id, inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a user to a group.

Path: api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name of the user (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.editPropertyValue"></a>

### User.editPropertyValue(id, property, value, authorization_bearer)
editPropertyValue - Edit a current user's property data as a path param.

Path: api/v1/user/id/:id/property/:property/:value

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Id or Username |
| property | <code>any</code> | (example: group_id) |
| value | <code>any</code> | (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.editProperty"></a>

### User.editProperty(body, id, property, authorization_bearer)
editProperty - Edit a user's property by id.

Path: api/v1/user/id/:id/property/:property

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| property | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```text
user6
```
<a name="User.edit"></a>

### User.edit(body, id, authorization_bearer)
edit - Edit a user's by id.

Path: api/v1/user/id/:id

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"username" : "user6",
	"password" : "Awickednewawesomepasword4242!@"
}
```
<a name="User.getProperty"></a>

### User.getProperty(id, property, authorization_bearer)
getProperty - Get a user's property by it's id.

Path: api/v1/user/id/:id/property/:property

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| property | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.get"></a>

### User.get(id, authorization_bearer)
get - Get a user by it's id.

Path: api/v1/user/id/:id

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent"></a>

## UserCurrent
**Kind**: global class  

* [UserCurrent](#UserCurrent)
    * [.registerToken(body, authorization_bearer)](#UserCurrent.registerToken)
    * [.removeGroupInheritance(inheritgroupid, inheritgrouptype, authorization_bearer)](#UserCurrent.removeGroupInheritance)
    * [.addGroupInheritance(inheritgroupid, inheritgrouptype, authorization_bearer)](#UserCurrent.addGroupInheritance)
    * [.editPropertyValue(property, value, authorization_bearer)](#UserCurrent.editPropertyValue)
    * [.editProperty(body, property, authorization_bearer)](#UserCurrent.editProperty)
    * [.deleteToken(id, authorization_bearer)](#UserCurrent.deleteToken)
    * [.edit(body, authorization_bearer)](#UserCurrent.edit)
    * [.getProperty(property, authorization_bearer)](#UserCurrent.getProperty)
    * [.routeCheck(method, route, authorization_bearer)](#UserCurrent.routeCheck)
    * [.permissionCheck(permission, authorization_bearer)](#UserCurrent.permissionCheck)
    * [.get(authorization_bearer)](#UserCurrent.get)

<a name="UserCurrent.registerToken"></a>

### UserCurrent.registerToken(body, authorization_bearer)
registerToken - Registers a new credentials service for client_credentials based access token auth.

Path: api/v1/user/me/token

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"name": "conversate"
}
```
<a name="UserCurrent.removeGroupInheritance"></a>

### UserCurrent.removeGroupInheritance(inheritgroupid, inheritgrouptype, authorization_bearer)
removeGroupInheritance - Remove a user from a group.

Path: api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.addGroupInheritance"></a>

### UserCurrent.addGroupInheritance(inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a user to a group.

Path: api/v1/user/me/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.editPropertyValue"></a>

### UserCurrent.editPropertyValue(property, value, authorization_bearer)
editPropertyValue - Edit a current user's property data as a path param.

Path: api/v1/user/me/property/:property/:value

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>any</code> | (example: group_id) |
| value | <code>any</code> | (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.editProperty"></a>

### UserCurrent.editProperty(body, property, authorization_bearer)
editProperty - Edit a current user's property data.

Path: api/v1/user/me/property/:property

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| property | <code>any</code> | (example: user_data) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"test": 123
}
```
<a name="UserCurrent.deleteToken"></a>

### UserCurrent.deleteToken(id, authorization_bearer)
deleteToken - Deletes a client_credentials based access token auth.

Path: api/v1/user/me/token/:id

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name of the token |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.edit"></a>

### UserCurrent.edit(body, authorization_bearer)
edit - Updates the current logged in user.

Path: api/v1/user/me

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
    "username": "user6",
    "password": "Awickednewawesomepasword4242!@"
}
```
<a name="UserCurrent.getProperty"></a>

### UserCurrent.getProperty(property, authorization_bearer)
getProperty - Gets the currently logged in user's single property

Path: api/v1/user/me/property/:property

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>any</code> | (example: username) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.routeCheck"></a>

### UserCurrent.routeCheck(method, route, authorization_bearer)
routeCheck - Checks if current logged in user can access the route with method.

Path: api/v1/user/me/route/allowed

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>any</code> | (example: get) |
| route | <code>any</code> | (example: /travelling/api/v1/group/request/type/anonymous/user/) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.permissionCheck"></a>

### UserCurrent.permissionCheck(permission, authorization_bearer)
permissionCheck - Checks to see if the current user can access content based on permission.

Path: api/v1/user/me/permission/allowed/:permission

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| permission | <code>any</code> | name of the route/permission (example: get-travelling) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.get"></a>

### UserCurrent.get(authorization_bearer)
get - Gets the currently logged in user

Path: api/v1/user/me

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Auth"></a>

## Auth
#### Auth endpoints

**Kind**: global class  

* [Auth](#Auth)
    * [.accessToken()](#Auth.accessToken)
    * [.authorize(client_id, response_type, state, redirect_uri, group_request)](#Auth.authorize)
    * [.activate(token)](#Auth.activate)
    * [.resetPassword(body, token)](#Auth.resetPassword)
    * [.forgotPassword(body)](#Auth.forgotPassword)
    * [.logout()](#Auth.logout)
    * [.login(body)](#Auth.login)
    * [.register(body)](#Auth.register)

<a name="Auth.accessToken"></a>

### Auth.accessToken()
accessToken - Oauth2 `client_credentials` access token flow. Body must be `application/x-www-form-urlencoded` and must contain the `grant_type`. `client_id` & `client_secret` will be sent in a `Basic` Authorization header as `base64(client_id:client_secret)`

Path: api/v1/auth/token

**Kind**: static method of [<code>Auth</code>](#Auth)  
<a name="Auth.authorize"></a>

### Auth.authorize(client_id, response_type, state, redirect_uri, group_request)
authorize - Authorization Code Grant

Path: api/v1/auth/oauth/authorize

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type |
| --- | --- |
| client_id | <code>any</code> | 
| response_type | <code>any</code> | 
| state | <code>any</code> | 
| redirect_uri | <code>any</code> | 
| group_request | <code>any</code> | 

<a name="Auth.activate"></a>

### Auth.activate(token)
activate - Activates and unlocks user

Path: api/v1/auth/activate

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | (example: activation_token) |

<a name="Auth.resetPassword"></a>

### Auth.resetPassword(body, token)
resetPassword - Resets the password if the recovery token is vaild of the user.

Path: api/v1/auth/password/reset

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| token | <code>any</code> | (example: [thegeneratedtoken]) |

**Example**  
body
```json
{
	"password":"asdf"
}
```
<a name="Auth.forgotPassword"></a>

### Auth.forgotPassword(body)
forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist)

Path: api/v1/auth/password/forgot

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```json
{
	"email": "joseph@abe.ai",
    "domain": "default"
}
```
<a name="Auth.logout"></a>

### Auth.logout()
logout -

Path: api/v1/auth/logout

**Kind**: static method of [<code>Auth</code>](#Auth)  
<a name="Auth.login"></a>

### Auth.login(body)
login - Register a user

Path: api/v1/auth/login

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```json
{
	"username": "test",
	"password": "Pas5w0r!d",
    "domain": "default"
}
```
<a name="Auth.register"></a>

### Auth.register(body)
register - Register a user

`group_request`	is optional.

Path: api/v1/auth/register

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```json
{
	"username":"test",
	"password":"Pas5w0r!d",
	"email": "test@test.com",
    "domain": "default"
}
```
<a name="AuthDomain"></a>

## AuthDomain
**Kind**: global class  

* [AuthDomain](#AuthDomain)
    * [.login(body, domain)](#AuthDomain.login)
    * [.register(body, domain)](#AuthDomain.register)

<a name="AuthDomain.login"></a>

### AuthDomain.login(body, domain)
login - Register a user

Path: api/v1/auth/login/domain/:domain

**Kind**: static method of [<code>AuthDomain</code>](#AuthDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | (example: test.com) |

**Example**  
body
```json
{
	"username": "test",
	"password": "Pas5w0r!d",
    "domain": "default"
}
```
<a name="AuthDomain.register"></a>

### AuthDomain.register(body, domain)
register - Register a user

`group_request`	is optional.

Path: api/v1/auth/register/domain/:domain

**Kind**: static method of [<code>AuthDomain</code>](#AuthDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | (example: test) |

**Example**  
body
```json
{
	"username":"test",
	"password":"Pas5w0r!d",
	"email": "test@test.com"
}
```
<a name="SDK"></a>

## SDK(host, opts)
SDK - importing the SDK for use

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| host | <code>string</code> | the hostname to the service (example: http://127.0.0.1) |
| opts | <code>object</code> | options that will be appened to every request. [Fasquest Lib Options](https://github.com/Phara0h/Fasquest) (example: {headers: {'API-KEY':'34098hodf'}}) |

**Example**  
init
```js
const { Travelling } = require('./sdk.js')('http://127.0.0.1');
```
