## Classes

<dl>
<dt><a href="#Travelling">Travelling</a></dt>
<dd></dd>
<dt><a href="#TravellingUsers">TravellingUsers</a></dt>
<dd></dd>
<dt><a href="#TravellingUser">TravellingUser</a></dt>
<dd></dd>
<dt><a href="#UserCurrent">UserCurrent</a></dt>
<dd></dd>
<dt><a href="#TravellingGroups">TravellingGroups</a></dt>
<dd></dd>
<dt><a href="#GroupsUsers">GroupsUsers</a></dt>
<dd></dd>
<dt><a href="#GroupsType">GroupsType</a></dt>
<dd></dd>
<dt><a href="#TypeUsers">TypeUsers</a></dt>
<dd></dd>
<dt><a href="#TypeUser">TypeUser</a></dt>
<dd></dd>
<dt><a href="#TravellingAuth">TravellingAuth</a></dt>
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

<a name="TravellingUsers"></a>

## TravellingUsers
**Kind**: global class  

* [TravellingUsers](#TravellingUsers)
    * [.allByGroupRequest(group_request, authorization_bearer)](#TravellingUsers.allByGroupRequest)
    * [.all(authorization_bearer)](#TravellingUsers.all)

<a name="TravellingUsers.allByGroupRequest"></a>

### TravellingUsers.allByGroupRequest(group_request, authorization_bearer)
allByGroupRequest - Gets all the users that have the specified group request

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

**Kind**: static method of [<code>TravellingUsers</code>](#TravellingUsers)  

| Param | Type | Description |
| --- | --- | --- |
| group_request | <code>any</code> | name of the group  (example: superadmin) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="TravellingUsers.all"></a>

### TravellingUsers.all(authorization_bearer)
all - Gets all the users

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

**Kind**: static method of [<code>TravellingUsers</code>](#TravellingUsers)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="TravellingUser"></a>

## TravellingUser
**Kind**: global class  

* [TravellingUser](#TravellingUser)
    * [.delete(id, authorization_bearer)](#TravellingUser.delete)
    * [.editProperty(body, id, prop, authorization_bearer)](#TravellingUser.editProperty)
    * [.edit(body, id, authorization_bearer)](#TravellingUser.edit)
    * [.getProperty(id, prop, authorization_bearer)](#TravellingUser.getProperty)
    * [.get(id, authorization_bearer)](#TravellingUser.get)

<a name="TravellingUser.delete"></a>

### TravellingUser.delete(id, authorization_bearer)
delete - Delete a user by it's Id.

**Kind**: static method of [<code>TravellingUser</code>](#TravellingUser)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="TravellingUser.editProperty"></a>

### TravellingUser.editProperty(body, id, prop, authorization_bearer)
editProperty - Edit a user's property by id.

**Kind**: static method of [<code>TravellingUser</code>](#TravellingUser)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| prop | <code>any</code> | (example: username) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "username": "user6",
    "password": "Awickednewawesomepasword4242!@"
}
```
<a name="TravellingUser.edit"></a>

### TravellingUser.edit(body, id, authorization_bearer)
edit - Edit a user's by id.

**Kind**: static method of [<code>TravellingUser</code>](#TravellingUser)  

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
<a name="TravellingUser.getProperty"></a>

### TravellingUser.getProperty(id, prop, authorization_bearer)
getProperty - Get a user's property by it's id.

**Kind**: static method of [<code>TravellingUser</code>](#TravellingUser)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| prop | <code>any</code> | (example: username) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="TravellingUser.get"></a>

### TravellingUser.get(id, authorization_bearer)
get - Get a user by it's id.

**Kind**: static method of [<code>TravellingUser</code>](#TravellingUser)  

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
    * [.getUserProperty(property, authorization_bearer)](#UserCurrent.getUserProperty)
    * [.routeCheck(method, route, authorization_bearer)](#UserCurrent.routeCheck)
    * [.permissionCheck(permission, authorization_bearer)](#UserCurrent.permissionCheck)
    * [.getUser(authorization_bearer)](#UserCurrent.getUser)

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
    "name": "test"
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
<a name="UserCurrent.getUserProperty"></a>

### UserCurrent.getUserProperty(property, authorization_bearer)
getUserProperty - Gets the currently logged in user's single property

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

<a name="UserCurrent.getUser"></a>

### UserCurrent.getUser(authorization_bearer)
getUser - Gets the currently logged in user

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="TravellingGroups"></a>

## TravellingGroups
**Kind**: global class  

* [TravellingGroups](#TravellingGroups)
    * [.delete(body, name, authorization_bearer)](#TravellingGroups.delete)
    * [.all(authorization_bearer)](#TravellingGroups.all)
    * [.addRoute(body, name, authorization_bearer)](#TravellingGroups.addRoute)
    * [.setDefault(name)](#TravellingGroups.setDefault)
    * [.editByName(body, name, authorization_bearer)](#TravellingGroups.editByName)
    * [.create(body, authorization_bearer)](#TravellingGroups.create)

<a name="TravellingGroups.delete"></a>

### TravellingGroups.delete(body, name, authorization_bearer)
delete - delete group by its id or name

**Kind**: static method of [<code>TravellingGroups</code>](#TravellingGroups)  

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
<a name="TravellingGroups.all"></a>

### TravellingGroups.all(authorization_bearer)
all - Get all the groups

**Kind**: static method of [<code>TravellingGroups</code>](#TravellingGroups)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="TravellingGroups.addRoute"></a>

### TravellingGroups.addRoute(body, name, authorization_bearer)
addRoute - Adds a route to a group.

**Kind**: static method of [<code>TravellingGroups</code>](#TravellingGroups)  

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
<a name="TravellingGroups.setDefault"></a>

### TravellingGroups.setDefault(name)
setDefault - Sets the group to be the default group for new users.

**Kind**: static method of [<code>TravellingGroups</code>](#TravellingGroups)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name (example: group6) |

<a name="TravellingGroups.editByName"></a>

### TravellingGroups.editByName(body, name, authorization_bearer)
editByName - Edits a group

**Kind**: static method of [<code>TravellingGroups</code>](#TravellingGroups)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| name | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "inherited": ["a717b880-b17b-4995-9610-cf451a06d015", "7ec8c351-7b8a-4ea8-95cc-0d990b225768"]
}
```
<a name="TravellingGroups.create"></a>

### TravellingGroups.create(body, authorization_bearer)
create - Add a new group

**Kind**: static method of [<code>TravellingGroups</code>](#TravellingGroups)  

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
<a name="GroupsUsers"></a>

## GroupsUsers
**Kind**: global class  

* [GroupsUsers](#GroupsUsers)
    * [.all_Inherited(name)](#GroupsUsers.all_Inherited)
    * [.all(name)](#GroupsUsers.all)

<a name="GroupsUsers.all_Inherited"></a>

### GroupsUsers.all\_Inherited(name)
all_Inherited - Gets all the users that belong to the group and all of its inherited groups.

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

**Kind**: static method of [<code>GroupsUsers</code>](#GroupsUsers)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name (example: superadmin) |

<a name="GroupsUsers.all"></a>

### GroupsUsers.all(name)
all - Gets all the users that belong to the group.

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

**Kind**: static method of [<code>GroupsUsers</code>](#GroupsUsers)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name (example: superadmin) |

<a name="GroupsType"></a>

## GroupsType
**Kind**: global class  

* [GroupsType](#GroupsType)
    * [.addRoute(body, type, name, authorization_bearer)](#GroupsType.addRoute)
    * [.setDefault(type, name)](#GroupsType.setDefault)
    * [.delete(body, type, name, authorization_bearer)](#GroupsType.delete)
    * [.create(body, type, authorization_bearer)](#GroupsType.create)
    * [.getTypesList(authorization_bearer)](#GroupsType.getTypesList)
    * [.all(type, authorization_bearer)](#GroupsType.all)
    * [.editByName(body, type, name, authorization_bearer)](#GroupsType.editByName)

<a name="GroupsType.addRoute"></a>

### GroupsType.addRoute(body, type, name, authorization_bearer)
addRoute - Adds a route to a group of a particular type.

**Kind**: static method of [<code>GroupsType</code>](#GroupsType)  

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
<a name="GroupsType.setDefault"></a>

### GroupsType.setDefault(type, name)
setDefault - Sets the group of a particular type to be the default group for new users.

**Kind**: static method of [<code>GroupsType</code>](#GroupsType)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | (example: account) |
| name | <code>any</code> | id or name (example: group1) |

<a name="GroupsType.delete"></a>

### GroupsType.delete(body, type, name, authorization_bearer)
delete - delete group of a particular type by its name or id

**Kind**: static method of [<code>GroupsType</code>](#GroupsType)  

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
<a name="GroupsType.create"></a>

### GroupsType.create(body, type, authorization_bearer)
create - Add a new group of a particular type

**Kind**: static method of [<code>GroupsType</code>](#GroupsType)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> |  |
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
<a name="GroupsType.getTypesList"></a>

### GroupsType.getTypesList(authorization_bearer)
getTypesList - Gets all the types of groups currently made.

**Kind**: static method of [<code>GroupsType</code>](#GroupsType)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupsType.all"></a>

### GroupsType.all(type, authorization_bearer)
all - Gets all groups of a particular type

**Kind**: static method of [<code>GroupsType</code>](#GroupsType)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupsType.editByName"></a>

### GroupsType.editByName(body, type, name, authorization_bearer)
editByName - Edits a group of a particular type

**Kind**: static method of [<code>GroupsType</code>](#GroupsType)  

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
    "inherited": ["a717b880-b17b-4995-9610-cf451a06d015", "7ec8c351-7b8a-4ea8-95cc-0d990b225768"]
}
```
<a name="TypeUsers"></a>

## TypeUsers
**Kind**: global class  

* [TypeUsers](#TypeUsers)
    * [.all(type, name)](#TypeUsers.all)
    * [.all_Inherited(type, name)](#TypeUsers.all_Inherited)

<a name="TypeUsers.all"></a>

### TypeUsers.all(type, name)
all - Gets all the users that belong to the group  of a particular type by its name or id.

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

<a name="TypeUsers.all_Inherited"></a>

### TypeUsers.all\_Inherited(type, name)
all_Inherited - Gets all the users that belong to the group  of a particular type by its name or id and all of its inherited groups.

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

<a name="TravellingAuth"></a>

## TravellingAuth
#### Auth endpoints

**Kind**: global class  

* [TravellingAuth](#TravellingAuth)
    * [.accessToken(authorization_client, authorization_secret)](#TravellingAuth.accessToken)
    * [.activate(token)](#TravellingAuth.activate)
    * [.resetPassword(body, token)](#TravellingAuth.resetPassword)
    * [.forgotPassword(body)](#TravellingAuth.forgotPassword)
    * [.logout()](#TravellingAuth.logout)
    * [.login(body)](#TravellingAuth.login)
    * [.register(body)](#TravellingAuth.register)

<a name="TravellingAuth.accessToken"></a>

### TravellingAuth.accessToken(authorization_client, authorization_secret)
accessToken - Oauth2 `client_credentials` access token flow. Body must be `application/x-www-form-urlencoded` and must contain the `grant_type`. `client_id` & `client_secret` will be sent in a `Basic` Authorization header as `base64(client_id:client_secret)`

**Kind**: static method of [<code>TravellingAuth</code>](#TravellingAuth)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_client | <code>string</code> | username/client_id |
| authorization_secret | <code>string</code> | password/client_secret |

<a name="TravellingAuth.activate"></a>

### TravellingAuth.activate(token)
activate - Activates and unlocks user

**Kind**: static method of [<code>TravellingAuth</code>](#TravellingAuth)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | (example: activation_token) |

<a name="TravellingAuth.resetPassword"></a>

### TravellingAuth.resetPassword(body, token)
resetPassword - Resets the password if the recovery token is vaild of the user.

**Kind**: static method of [<code>TravellingAuth</code>](#TravellingAuth)  

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
<a name="TravellingAuth.forgotPassword"></a>

### TravellingAuth.forgotPassword(body)
forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist)

**Kind**: static method of [<code>TravellingAuth</code>](#TravellingAuth)  

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
<a name="TravellingAuth.logout"></a>

### TravellingAuth.logout()
logout -

**Kind**: static method of [<code>TravellingAuth</code>](#TravellingAuth)  
<a name="TravellingAuth.login"></a>

### TravellingAuth.login(body)
login - Register a user

**Kind**: static method of [<code>TravellingAuth</code>](#TravellingAuth)  

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
<a name="TravellingAuth.register"></a>

### TravellingAuth.register(body)
register - Register a user

    `group_request`	is optional.

**Kind**: static method of [<code>TravellingAuth</code>](#TravellingAuth)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```js
{
    "username": "user5",
    "password": "swagmoney69xd420",
    "email": "jt@abe.ai",
    "group_request": "superadmin"
}
```
