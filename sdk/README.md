## Classes

<dl>
<dt><a href="#Travelling">Travelling</a></dt>
<dd></dd>
<dt><a href="#User">User</a></dt>
<dd></dd>
<dt><a href="#Current">Current</a></dt>
<dd></dd>
<dt><a href="#Groups">Groups</a></dt>
<dd></dd>
<dt><a href="#Type">Type</a></dt>
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

<a name="User"></a>

## User
**Kind**: global class  

* [User](#User)
    * [.deleteByUsername(username, authorization_bearer)](#User.deleteByUsername)
    * [.deleteById(id, authorization_bearer)](#User.deleteById)
    * [.editByUsername(body, username, authorization_bearer)](#User.editByUsername)
    * [.editPropertyByUsername(body, username, prop, authorization_bearer)](#User.editPropertyByUsername)
    * [.editPropertyById(body, id, prop, authorization_bearer)](#User.editPropertyById)
    * [.editById(body, id, authorization_bearer)](#User.editById)
    * [.getUsers(group_request, locked, authorization_bearer)](#User.getUsers)
    * [.getAll(authorization_bearer)](#User.getAll)
    * [.getPropertyById(id, prop, authorization_bearer)](#User.getPropertyById)
    * [.getPropertyByUsername(username, prop, authorization_bearer)](#User.getPropertyByUsername)
    * [.getById(id, authorization_bearer)](#User.getById)
    * [.getByUsername(username, authorization_bearer)](#User.getByUsername)

<a name="User.deleteByUsername"></a>

### User.deleteByUsername(username, authorization_bearer)
deleteByUsername - Delete a user by it's username.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>any</code> | (example: test) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.deleteById"></a>

### User.deleteById(id, authorization_bearer)
deleteById - Delete a user by it's Id.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.editByUsername"></a>

### User.editByUsername(body, username, authorization_bearer)
editByUsername - Edit a user's by username.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| username | <code>any</code> | (example: test) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "username": "user6",
    "password": "Awickednewawesomepasword4242!@"
}
```
<a name="User.editPropertyByUsername"></a>

### User.editPropertyByUsername(body, username, prop, authorization_bearer)
editPropertyByUsername - Edit a user's property by Username.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| username | <code>any</code> | (example: test) |
| prop | <code>any</code> | (example: email) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "username": "user6",
    "password": "Awickednewawesomepasword4242!@"
}
```
<a name="User.editPropertyById"></a>

### User.editPropertyById(body, id, prop, authorization_bearer)
editPropertyById - Edit a user's property by id.

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
{
    "username": "user6",
    "password": "Awickednewawesomepasword4242!@"
}
```
<a name="User.editById"></a>

### User.editById(body, id, authorization_bearer)
editById - Edit a user's by id.

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
<a name="User.getUsers"></a>

### User.getUsers(group_request, locked, authorization_bearer)
getUsers - Gets users by each query param user prop.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| group_request | <code>any</code> | (example: superadmin) |
| locked | <code>any</code> | (example: true) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.getAll"></a>

### User.getAll(authorization_bearer)
getAll - Gets all the users

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.getPropertyById"></a>

### User.getPropertyById(id, prop, authorization_bearer)
getPropertyById - Get a user's property by it's id.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| prop | <code>any</code> | (example: username) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.getPropertyByUsername"></a>

### User.getPropertyByUsername(username, prop, authorization_bearer)
getPropertyByUsername - Gets the user's property

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>any</code> | (example: user1) |
| prop | <code>any</code> | (example: id) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.getById"></a>

### User.getById(id, authorization_bearer)
getById - Get a user by it's id.

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.getByUsername"></a>

### User.getByUsername(username, authorization_bearer)
getByUsername - Get user by their username

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>any</code> | (example: user1) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Current"></a>

## Current
**Kind**: global class  

* [Current](#Current)
    * [.editProperty(body, property, authorization_bearer)](#Current.editProperty)
    * [.deleteToken(body, id, authorization_bearer)](#Current.deleteToken)
    * [.registerToken(body, authorization_bearer)](#Current.registerToken)
    * [.edit(body, authorization_bearer)](#Current.edit)
    * [.getUserProperty(property, authorization_bearer)](#Current.getUserProperty)
    * [.routeCheck(method, route, authorization_bearer)](#Current.routeCheck)
    * [.permissionCheck(permission, authorization_bearer)](#Current.permissionCheck)
    * [.getUser(authorization_bearer)](#Current.getUser)

<a name="Current.editProperty"></a>

### Current.editProperty(body, property, authorization_bearer)
editProperty - Edit a current user's property data.

**Kind**: static method of [<code>Current</code>](#Current)  

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
<a name="Current.deleteToken"></a>

### Current.deleteToken(body, id, authorization_bearer)
deleteToken - Deletes a client_credentials based access token auth.

**Kind**: static method of [<code>Current</code>](#Current)  

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
<a name="Current.registerToken"></a>

### Current.registerToken(body, authorization_bearer)
registerToken - Registers a new credentials service for client_credentials based access token auth.

**Kind**: static method of [<code>Current</code>](#Current)  

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
<a name="Current.edit"></a>

### Current.edit(body, authorization_bearer)
edit - Updates the current logged in user.

**Kind**: static method of [<code>Current</code>](#Current)  

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
<a name="Current.getUserProperty"></a>

### Current.getUserProperty(property, authorization_bearer)
getUserProperty - Gets the currently logged in user's single property

**Kind**: static method of [<code>Current</code>](#Current)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>any</code> | (example: username) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Current.routeCheck"></a>

### Current.routeCheck(method, route, authorization_bearer)
routeCheck - Checks if current logged in user can access the route with method.

**Kind**: static method of [<code>Current</code>](#Current)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>any</code> | (example: get) |
| route | <code>any</code> | (example: /travelling/api/v1/users/me) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Current.permissionCheck"></a>

### Current.permissionCheck(permission, authorization_bearer)
permissionCheck - Checks to see if the current user can access content based on permission.

**Kind**: static method of [<code>Current</code>](#Current)  

| Param | Type | Description |
| --- | --- | --- |
| permission | <code>any</code> | name of the route/permission (example: get-travelling) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Current.getUser"></a>

### Current.getUser(authorization_bearer)
getUser - Gets the currently logged in user

**Kind**: static method of [<code>Current</code>](#Current)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Groups"></a>

## Groups
**Kind**: global class  

* [Groups](#Groups)
    * [.delete(body, name, type, authorization_bearer)](#Groups.delete)
    * [.getAllUsersInherited(name)](#Groups.getAllUsersInherited)
    * [.getAllUsers(name)](#Groups.getAllUsers)
    * [.getAll(authorization_bearer)](#Groups.getAll)
    * [.addRoute(body, groupname, authorization_bearer)](#Groups.addRoute)
    * [.setDefault(name)](#Groups.setDefault)
    * [.editByName(body, groupname, authorization_bearer)](#Groups.editByName)
    * [.create(body, authorization_bearer)](#Groups.create)

<a name="Groups.delete"></a>

### Groups.delete(body, name, type, authorization_bearer)
delete - delete group by its id or name

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| name | <code>any</code> | id or name |
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
<a name="Groups.getAllUsersInherited"></a>

### Groups.getAllUsersInherited(name)
getAllUsersInherited - Gets all the users that belong to the group and all of its inherited groups.

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name (example: superadmin) |

<a name="Groups.getAllUsers"></a>

### Groups.getAllUsers(name)
getAllUsers - Gets all the users that belong to the group.

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name (example: superadmin) |

<a name="Groups.getAll"></a>

### Groups.getAll(authorization_bearer)
getAll - Get all the groups

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Groups.addRoute"></a>

### Groups.addRoute(body, groupname, authorization_bearer)
addRoute - Adds a route to a group.

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| groupname | <code>any</code> | (example: superadmin) |
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
<a name="Groups.setDefault"></a>

### Groups.setDefault(name)
setDefault - Sets the group to be the default group for new users.

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name (example: group6) |

<a name="Groups.editByName"></a>

### Groups.editByName(body, groupname, authorization_bearer)
editByName - Edits a group

**Kind**: static method of [<code>Groups</code>](#Groups)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| groupname | <code>any</code> | id or name (example: superadmin) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "inherited": ["a717b880-b17b-4995-9610-cf451a06d015", "7ec8c351-7b8a-4ea8-95cc-0d990b225768"]
}
```
<a name="Groups.create"></a>

### Groups.create(body, authorization_bearer)
create - Add a new group

**Kind**: static method of [<code>Groups</code>](#Groups)  

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
<a name="Type"></a>

## Type
**Kind**: global class  

* [Type](#Type)
    * [.setDefault(name)](#Type.setDefault)
    * [.getAllUsersInherited(name, type)](#Type.getAllUsersInherited)
    * [.getAllUsers(name, type)](#Type.getAllUsers)
    * [.delete(body, name, type, authorization_bearer)](#Type.delete)
    * [.create(body, type, authorization_bearer)](#Type.create)
    * [.getTypesList(authorization_bearer)](#Type.getTypesList)
    * [.getAll(type, authorization_bearer)](#Type.getAll)
    * [.editByName(body, name, type, authorization_bearer)](#Type.editByName)

<a name="Type.setDefault"></a>

### Type.setDefault(name)
setDefault - Sets the group of a particular type to be the default group for new users.

**Kind**: static method of [<code>Type</code>](#Type)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name (example: group6) |

<a name="Type.getAllUsersInherited"></a>

### Type.getAllUsersInherited(name, type)
getAllUsersInherited - Gets all the users that belong to the group  of a particular type by its name or id and all of its inherited groups.

**Kind**: static method of [<code>Type</code>](#Type)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name  (example: superadmin) |
| type | <code>any</code> | The type of the group (example: group) |

<a name="Type.getAllUsers"></a>

### Type.getAllUsers(name, type)
getAllUsers - Gets all the users that belong to the group  of a particular type by its name or id.

**Kind**: static method of [<code>Type</code>](#Type)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>any</code> | id or name (example: superadmin) |
| type | <code>any</code> | The type of the group (example: group) |

<a name="Type.delete"></a>

### Type.delete(body, name, type, authorization_bearer)
delete - delete group of a particular type by its name or id

**Kind**: static method of [<code>Type</code>](#Type)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| name | <code>any</code> | id or name |
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
<a name="Type.create"></a>

### Type.create(body, type, authorization_bearer)
create - Add a new group of a particular type

**Kind**: static method of [<code>Type</code>](#Type)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| type | <code>any</code> | groups type (example: accounts) |
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
<a name="Type.getTypesList"></a>

### Type.getTypesList(authorization_bearer)
getTypesList - Gets all the types of groups currently made.

**Kind**: static method of [<code>Type</code>](#Type)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Type.getAll"></a>

### Type.getAll(type, authorization_bearer)
getAll - Gets all groups of a particular type

**Kind**: static method of [<code>Type</code>](#Type)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>any</code> | The groups type (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Type.editByName"></a>

### Type.editByName(body, name, type, authorization_bearer)
editByName - Edits a group of a particular type

**Kind**: static method of [<code>Type</code>](#Type)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| name | <code>any</code> | id or name (example: superadmin) |
| type | <code>any</code> | The groups type (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```js
{
    "inherited": ["a717b880-b17b-4995-9610-cf451a06d015", "7ec8c351-7b8a-4ea8-95cc-0d990b225768"]
}
```
<a name="Auth"></a>

## Auth
#### Auth endpoints

**Kind**: global class  

* [Auth](#Auth)
    * [.accessToken(authorization_client, authorization_secret)](#Auth.accessToken)
    * [.activate(token)](#Auth.activate)
    * [.resetPassword(body, token)](#Auth.resetPassword)
    * [.forgotPassword(body)](#Auth.forgotPassword)
    * [.logout()](#Auth.logout)
    * [.login(body)](#Auth.login)
    * [.register(body)](#Auth.register)

<a name="Auth.accessToken"></a>

### Auth.accessToken(authorization_client, authorization_secret)
accessToken - Oauth2 `client_credentials` access token flow. Body must be `application/x-www-form-urlencoded` and must contain the `grant_type`. `client_id` & `client_secret` will be sent in a `Basic` Authorization header as `base64(client_id:client_secret)`

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_client | <code>string</code> | username/client_id |
| authorization_secret | <code>string</code> | password/client_secret |

<a name="Auth.activate"></a>

### Auth.activate(token)
activate - Activates and unlocks user

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | (example: activation_token) |

<a name="Auth.resetPassword"></a>

### Auth.resetPassword(body, token)
resetPassword - Resets the password if the recovery token is vaild of the user.

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
    "username": "user7",
    "password": "swagmoney69xd420",
    "email": "jt4@abe.ai",
    "group_request": "superadmin"
}
```
