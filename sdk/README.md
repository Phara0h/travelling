## Classes

<dl>
<dt><a href="#Travelling">Travelling</a></dt>
<dd></dd>
<dt><a href="#Users">Users</a></dt>
<dd></dd>
<dt><a href="#User">User</a></dt>
<dd></dd>
<dt><a href="#UserCurrent">UserCurrent</a></dt>
<dd></dd>
<dt><a href="#Groups">Groups</a></dt>
<dd></dd>
<dt><a href="#Group">Group</a></dt>
<dd></dd>
<dt><a href="#GroupUsers">GroupUsers</a></dt>
<dd></dd>
<dt><a href="#GroupType">GroupType</a></dt>
<dd></dd>
<dt><a href="#TypeUsers">TypeUsers</a></dt>
<dd></dd>
<dt><a href="#TypeUser">TypeUser</a></dt>
<dd></dd>
<dt><a href="#Auth">Auth</a></dt>
<dd><h4 id="auth-endpoints">Auth endpoints</h4>
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

**Kind**: static method of [<code>Travelling</code>](#Travelling)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Travelling.metrics"></a>

### Travelling.metrics(authorization_bearer)
metrics - servers metrics

**Kind**: static method of [<code>Travelling</code>](#Travelling)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

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

**Kind**: static method of [<code>Users</code>](#Users)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User"></a>

## User
**Kind**: global class  

* [User](#User)
    * [.delete(id, authorization_bearer)](#User.delete)
    * [.editProperty(body, id, prop, authorization_bearer)](#User.editProperty)
    * [.edit(body, id, authorization_bearer)](#User.edit)
    * [.getProperty(id, prop, authorization_bearer)](#User.getProperty)
    * [.get(id, authorization_bearer)](#User.get)

<a name="User.delete"></a>

### User.delete(id, authorization_bearer)
delete - Delete a user by it's Id.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.editProperty"></a>

### User.editProperty(body, id, prop, authorization_bearer)
editProperty - Edit a user's property by id.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| prop | <code>any</code> | (example: username) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
user6
```
<a name="User.edit"></a>

### User.edit(body, id, authorization_bearer)
edit - Edit a user's by id.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "username": "user6",
    "password": "Awickednewawesomepasword4242!@"
}
```
<a name="User.getProperty"></a>

### User.getProperty(id, prop, authorization_bearer)
getProperty - Get a user's property by it's id.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| prop | <code>any</code> | (example: username) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.get"></a>

### User.get(id, authorization_bearer)
get - Get a user by it's id.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent"></a>

## UserCurrent
**Kind**: global class  

* [UserCurrent](#UserCurrent)
    * [.editProperty(body, property, authorization_bearer)](#UserCurrent.editProperty)
    * [.deleteToken(body, id, authorization_bearer)](#UserCurrent.deleteToken)
    * [.registerToken(body, authorization_bearer)](#UserCurrent.registerToken)
    * [.edit(body, authorization_bearer)](#UserCurrent.edit)
    * [.getProperty(property, authorization_bearer)](#UserCurrent.getProperty)
    * [.routeCheck(method, route, authorization_bearer)](#UserCurrent.routeCheck)
    * [.permissionCheck(permission, authorization_bearer)](#UserCurrent.permissionCheck)
    * [.get(authorization_bearer)](#UserCurrent.get)

<a name="UserCurrent.editProperty"></a>

### UserCurrent.editProperty(body, property, authorization_bearer)
editProperty - Edit a current user's property data.

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| property | <code>any</code> | (example: user_data) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "test": 123
}
```
<a name="UserCurrent.deleteToken"></a>

### UserCurrent.deleteToken(body, id, authorization_bearer)
deleteToken - Deletes a client_credentials based access token auth.

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | id or name of the token |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "name": "test"
}
```
<a name="UserCurrent.registerToken"></a>

### UserCurrent.registerToken(body, authorization_bearer)
registerToken - Registers a new credentials service for client_credentials based access token auth.

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "name": "conversate"
}
```
<a name="UserCurrent.edit"></a>

### UserCurrent.edit(body, authorization_bearer)
edit - Updates the current logged in user.

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "username": "user6",
    "password": "Awickednewawesomepasword4242!@"
}
```
<a name="UserCurrent.getProperty"></a>

### UserCurrent.getProperty(property, authorization_bearer)
getProperty - Gets the currently logged in user's single property

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>any</code> | (example: username) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.routeCheck"></a>

### UserCurrent.routeCheck(method, route, authorization_bearer)
routeCheck - Checks if current logged in user can access the route with method.

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>any</code> | (example: get) |
| route | <code>any</code> | (example: /travelling/api/v1/users/me) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.permissionCheck"></a>

### UserCurrent.permissionCheck(permission, authorization_bearer)
permissionCheck - Checks to see if the current user can access content based on permission.

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| permission | <code>any</code> | name of the route/permission (example: get-travelling) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent.get"></a>

### UserCurrent.get(authorization_bearer)
get - Gets the currently logged in user

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Groups"></a>

## Groups
**Kind**: global class  

* [Groups](#Groups)
    * [.export(body, authorization_bearer)](#Groups.export)
    * [.import(body, authorization_bearer)](#Groups.import)
    * [.get(authorization_bearer)](#Groups.get)

<a name="Groups.export"></a>

### Groups.export(body, authorization_bearer)
export - Exports all groups in the proper format to be imported.

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "anonymous": {
        "type": "group",
        "allowed": [{
                "route": "/travelling/portal/*",
                "host": null,
                "removeFromPath": "/travelling/portal",
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
                "removeFromPath": "/travelling/assets/",
                "method": "*",
                "name": "*-travelling-assets-*"
            },
            {
                "route": "travelling/api/v1/config/password",
                "host": null,
                "method": "GET",
                "name": "gettravelling-api-v1-config-password"
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
    "group2": {
        "type": "accounts",
        "allowed": null,
        "inherited": [
            "group1"
        ],
        "is_default": false
    },
    "group4": {
        "type": "accounts",
        "allowed": null,
        "inherited": [
            "group2",
            "group3"
        ],
        "is_default": false
    },
    "group1": {
        "type": "accounts",
        "allowed": null,
        "inherited": null,
        "is_default": false
    },
    "group3": {
        "type": "accounts",
        "allowed": null,
        "inherited": [
            "group9"
        ],
        "is_default": false
    },
    "group9": {
        "type": "swag2",
        "allowed": null,
        "inherited": null,
        "is_default": true
    },
    "superadmin": {
        "type": "group",
        "allowed": [{
            "host": null,
            "route": "/travelling/*",
            "method": "*",
            "name": "*-travelling-*"
        }],
        "inherited": [
            "anonymous"
        ],
        "is_default": false
    }
}
```
<a name="Groups.import"></a>

### Groups.import(body, authorization_bearer)
import - Imports all groups from the exported format.

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "anonymous": {
        "type": "group",
        "allowed": [{
                "route": "/travelling/portal/*",
                "host": null,
                "removeFromPath": "/travelling/portal",
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
                "removeFromPath": "/travelling/assets/",
                "method": "*",
                "name": "*-travelling-assets-*"
            },
            {
                "route": "travelling/api/v1/config/password",
                "host": null,
                "method": "GET",
                "name": "gettravelling-api-v1-config-password"
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
    "group2": {
        "type": "accounts",
        "allowed": null,
        "inherited": [
            "group1"
        ],
        "is_default": false
    },
    "group4": {
        "type": "accounts",
        "allowed": null,
        "inherited": [
            "group2",
            "group3"
        ],
        "is_default": false
    },
    "group1": {
        "type": "accounts",
        "allowed": null,
        "inherited": null,
        "is_default": false
    },
    "group3": {
        "type": "accounts",
        "allowed": null,
        "inherited": [
            "group9"
        ],
        "is_default": false
    },
    "group9": {
        "type": "swag2",
        "allowed": null,
        "inherited": null,
        "is_default": true
    },
    "superadmin": {
        "type": "group",
        "allowed": [{
            "host": null,
            "route": "/travelling/*",
            "method": "*",
            "name": "*-travelling-*"
        }],
        "inherited": [
            "anonymous"
        ],
        "is_default": false
    }
}
```
<a name="Groups.get"></a>

### Groups.get(authorization_bearer)
get - Get all the groups

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group"></a>

## Group
**Kind**: global class  

* [Group](#Group)
    * [.delete(body, name, authorization_bearer)](#Group.delete)
    * [.addRoute(body, name, authorization_bearer)](#Group.addRoute)
    * [.setDefault(name)](#Group.setDefault)
    * [.get(id, authorization_bearer)](#Group.get)
    * [.edit(body, name, authorization_bearer)](#Group.edit)
    * [.create(body, authorization_bearer)](#Group.create)

<a name="Group.delete"></a>

### Group.delete(body, name, authorization_bearer)
delete - delete group by its id or name

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| name | <code>any</code> | id or name |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "name": "group1",
    "type": "accounts",
    "allowed": [{
        "route": "/test",
        "host": "http://127.0.0.1:1237/",
        "removeFromPath": "test",
        "method": "*",
        "name": "all-test"
    }],
    "is_default": false
}
```
<a name="Group.addRoute"></a>

### Group.addRoute(body, name, authorization_bearer)
addRoute - Adds a route to a group.

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| name | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "route": "cui/permissions/*",
    "host": null,
    "method": "*",
    "name": "cui-*"
}
```
<a name="Group.setDefault"></a>

### Group.setDefault(name)
setDefault - Sets the group to be the default group for new users.

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name (example: group6) |

<a name="Group.get"></a>

### Group.get(id, authorization_bearer)
get - Get a group by it's id or name.

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name  (example: group1) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Group.edit"></a>

### Group.edit(body, name, authorization_bearer)
edit - Edits a group

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| name | <code>any</code> | (example: ab31efc8-40a5-4d38-a347-adb4e38d0075) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "allowed": [{
            "route": "/travelling/portal/*",
            "host": null,
            "removeFromPath": "/travelling/portal",
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
            "removeFromPath": "/travelling/assets/",
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
<a name="Group.create"></a>

### Group.create(body, authorization_bearer)
create - Add a new group

**Kind**: static method of [<code>Group</code>](#Group)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "name": "group1",
    "type": "accounts",
    "allowed": [{
        "route": "/test",
        "host": "http://127.0.0.1:1237/",
        "removeFromPath": "test",
        "method": "*",
        "name": "all-test"
    }],
    "is_default": false
}
```
<a name="GroupUsers"></a>

## GroupUsers
**Kind**: global class  

* [GroupUsers](#GroupUsers)
    * [.inherited(name)](#GroupUsers.inherited)
    * [.get(name)](#GroupUsers.get)

<a name="GroupUsers.inherited"></a>

### GroupUsers.inherited(name)
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

**Kind**: static method of [<code>GroupUsers</code>](#GroupUsers)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name (example: superadmin) |

<a name="GroupUsers.get"></a>

### GroupUsers.get(name)
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

**Kind**: static method of [<code>GroupUsers</code>](#GroupUsers)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name (example: superadmin) |

<a name="GroupType"></a>

## GroupType
**Kind**: global class  

* [GroupType](#GroupType)
    * [.addRoute(body, type, name, authorization_bearer)](#GroupType.addRoute)
    * [.setDefault(type, name)](#GroupType.setDefault)
    * [.delete(body, type, name, authorization_bearer)](#GroupType.delete)
    * [.create(body, type, authorization_bearer)](#GroupType.create)
    * [.getTypesList(authorization_bearer)](#GroupType.getTypesList)
    * [.get(type, id, authorization_bearer)](#GroupType.get)
    * [.all(type, authorization_bearer)](#GroupType.all)
    * [.editByName(body, type, name, authorization_bearer)](#GroupType.editByName)

<a name="GroupType.addRoute"></a>

### GroupType.addRoute(body, type, name, authorization_bearer)
addRoute - Adds a route to a group of a particular type.

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> |  |
| name | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "route": "cui/permissions/*",
    "host": null,
    "method": "*",
    "name": "cui-*"
}
```
<a name="GroupType.setDefault"></a>

### GroupType.setDefault(type, name)
setDefault - Sets the group of a particular type to be the default group for new users.

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | (example: account) |
| name | <code>any</code> | id or name (example: group1) |

<a name="GroupType.delete"></a>

### GroupType.delete(body, type, name, authorization_bearer)
delete - delete group of a particular type by its name or id

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | The type of the group |
| name | <code>any</code> | id or name |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "name": "group1",
    "type": "accounts",
    "allowed": [{
        "route": "/test",
        "host": "http://127.0.0.1:1237/",
        "removeFromPath": "test",
        "method": "*",
        "name": "all-test"
    }],
    "is_default": false
}
```
<a name="GroupType.create"></a>

### GroupType.create(body, type, authorization_bearer)
create - Add a new group of a particular type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | The type of the group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "name": "group1",
    "type": "accounts",
    "allowed": [{
        "route": "/test",
        "host": "http://127.0.0.1:1237/",
        "removeFromPath": "test",
        "method": "*",
        "name": "all-test"
    }],
    "is_default": false
}
```
<a name="GroupType.getTypesList"></a>

### GroupType.getTypesList(authorization_bearer)
getTypesList - Gets all the types of groups currently made.

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.get"></a>

### GroupType.get(type, id, authorization_bearer)
get - Get a group by it's id or name of a particular type.

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group (example: accounts) |
| id | <code>any</code> | id or name  (example: group1) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.all"></a>

### GroupType.all(type, authorization_bearer)
all - Gets all groups of a particular type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupType.editByName"></a>

### GroupType.editByName(body, type, name, authorization_bearer)
editByName - Edits a group of a particular type

**Kind**: static method of [<code>GroupType</code>](#GroupType)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | The type of the group |
| name | <code>any</code> | id or name |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "inherited": ["a717b880-b17b-4995-9610-cf451a06d015", "7ec8c351-7b8a-4ea8-95cc-0d990b225768"]
}
```
<a name="TypeUsers"></a>

## TypeUsers
**Kind**: global class  

* [TypeUsers](#TypeUsers)
    * [.get(type, name)](#TypeUsers.get)
    * [.inherited(type, name)](#TypeUsers.inherited)

<a name="TypeUsers.get"></a>

### TypeUsers.get(type, name)
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

**Kind**: static method of [<code>TypeUsers</code>](#TypeUsers)  

| Param | Type |
| --- | --- |
| type | <code>any</code> | 
| name | <code>any</code> | 

<a name="TypeUsers.inherited"></a>

### TypeUsers.inherited(type, name)
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

**Kind**: static method of [<code>TypeUsers</code>](#TypeUsers)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The type of the group (example: groups) |
| name | <code>any</code> | (example: group4) |

<a name="TypeUser"></a>

## TypeUser
**Kind**: global class  

* [TypeUser](#TypeUser)
    * [.delete(type, id, authorization_bearer)](#TypeUser.delete)
    * [.edit(body, type, id, authorization_bearer)](#TypeUser.edit)
    * [.get(type, id, authorization_bearer)](#TypeUser.get)

<a name="TypeUser.delete"></a>

### TypeUser.delete(type, id, authorization_bearer)
delete - Delete a user by it's id or username from group of a particular type.

**Kind**: static method of [<code>TypeUser</code>](#TypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | (example: accounts) |
| id | <code>any</code> | (example: user7) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="TypeUser.edit"></a>

### TypeUser.edit(body, type, id, authorization_bearer)
edit - Edit a user by it's id or username from group of a particular type.

**Kind**: static method of [<code>TypeUser</code>](#TypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | (example: accounts) |
| id | <code>any</code> | (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "locked": false
}
```
<a name="TypeUser.get"></a>

### TypeUser.get(type, id, authorization_bearer)
get - Get a user by it's id or username from group of a particular type.

**Kind**: static method of [<code>TypeUser</code>](#TypeUser)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | (example: accounts) |
| id | <code>any</code> | (example: user6) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Auth"></a>

## Auth
#### Auth endpoints

**Kind**: global class  

* [Auth](#Auth)
    * [.accessToken()](#Auth.accessToken)
    * [.activate(token)](#Auth.activate)
    * [.resetPassword(body, token)](#Auth.resetPassword)
    * [.forgotPassword(body)](#Auth.forgotPassword)
    * [.logout()](#Auth.logout)
    * [.login(body)](#Auth.login)
    * [.register(body)](#Auth.register)

<a name="Auth.accessToken"></a>

### Auth.accessToken()
accessToken - Oauth2 `client_credentials` access token flow. Body must be `application/x-www-form-urlencoded` and must contain the `grant_type`. `client_id` & `client_secret` will be sent in a `Basic` Authorization header as `base64(client_id:client_secret)`

**Kind**: static method of [<code>Auth</code>](#Auth)  
<a name="Auth.activate"></a>

### Auth.activate(token)
activate - Activates and unlocks user

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | (example: activation_token) |

<a name="Auth.resetPassword"></a>

### Auth.resetPassword(body, token)
resetPassword - Resets the password if the recovery token is valid of the user.

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| token | <code>any</code> | (example: [thegeneratedtoken]) |

**Example**  
body
```js
{
    "password": "asdf"
}
```
<a name="Auth.forgotPassword"></a>

### Auth.forgotPassword(body)
forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist)

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```js
{
    "email": "joseph@abe.ai"
}
```
<a name="Auth.logout"></a>

### Auth.logout()
logout -

**Kind**: static method of [<code>Auth</code>](#Auth)  
<a name="Auth.login"></a>

### Auth.login(body)
login - Register a user

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```js
{
    "username": "user5",
    "password": "swagmoney69xd420"
}
```
<a name="Auth.register"></a>

### Auth.register(body)
register - Register a user

    `group_request`	is optional.

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```js
{
    "username": "user5",
    "password": "swagmoney69xd420",
    "email": "test@test.com"
}
```
