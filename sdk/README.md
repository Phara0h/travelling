## Classes

<dl>
<dt><a href="#Travelling">Travelling</a></dt>
<dd></dd>
<dt><a href="#Audit">Audit</a></dt>
<dd></dd>
<dt><a href="#AuditUser">AuditUser</a></dt>
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
<dt><a href="#UsersDomain">UsersDomain</a></dt>
<dd></dd>
<dt><a href="#User">User</a></dt>
<dd></dd>
<dt><a href="#UserDomain">UserDomain</a></dt>
<dd></dd>
<dt><a href="#UserCurrent">UserCurrent</a></dt>
<dd></dd>
<dt><a href="#Auth">Auth</a></dt>
<dd><h4 id="auth-endpoints">Auth endpoints</h4>
</dd>
<dt><a href="#AuthToken">AuthToken</a></dt>
<dd></dd>
<dt><a href="#AuthDomain">AuthDomain</a></dt>
<dd></dd>
<dt><a href="#AuthDomainToken">AuthDomainToken</a></dt>
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

<a name="Audit"></a>

## Audit
**Kind**: global class  

* [Audit](#Audit)
    * [.byActionAndSubaction(action, subaction, limit, skip, sort, sortdir, filter, resolve, authorization_bearer)](#Audit.byActionAndSubaction)
    * [.bySubaction(subaction, limit, skip, sort, sortdir, filter, resolve, authorization_bearer)](#Audit.bySubaction)
    * [.byAction(action, limit, skip, sort, sortdir, filter, resolve, authorization_bearer)](#Audit.byAction)

<a name="Audit.byActionAndSubaction"></a>

### Audit.byActionAndSubaction(action, subaction, limit, skip, sort, sortdir, filter, resolve, authorization_bearer)
byActionAndSubaction - Gets audits by action and subaction type.

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example: id=415c87e9-eaad-4b8e-8ce8-655c911e20ae) |
| created_on | *optional* (example:  created_on>=2021-06-09) |
| prop | *optional* (example: prop=email) |
| old_val | *optional* (example:  old_val=swagger@email.69) |
| new_val | *optional* (example:  new_val=leet@teel.com) |

Path: api/v1/audit/action/:action/subaction/:subaction

**Kind**: static method of [<code>Audit</code>](#Audit)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>any</code> | Audti action type. (example: CREATE) |
| subaction | <code>any</code> | Audit subaction type. (example: GROUP) |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 2) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 1) |
| sort | <code>any</code> | Sort by any user object key (examples: created_on, action, etc.) (example: created_on) |
| sortdir | <code>any</code> | Sort direction (example ascending order: ASC) (example: ASC) |
| filter | <code>any</code> | Filter parameters (example: action=created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-03,created_on<2021-06-06) |
| resolve | <code>any</code> | Joins users table to obtain 'by_user_firstname' and 'by_user'lastname' fields (example: true) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Audit.bySubaction"></a>

### Audit.bySubaction(subaction, limit, skip, sort, sortdir, filter, resolve, authorization_bearer)
bySubaction - Gets audits by subaction type.

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example: id=415c87e9-eaad-4b8e-8ce8-655c911e20ae) |
| created_on | *optional* (example:  created_on>=2021-06-09) |
| prop | *optional* (example: prop=email) |
| old_val | *optional* (example:  old_val=swagger@email.69) |
| new_val | *optional* (example:  new_val=leet@teel.com) |

Path: api/v1/audit/subaction/:subaction

**Kind**: static method of [<code>Audit</code>](#Audit)  

| Param | Type | Description |
| --- | --- | --- |
| subaction | <code>any</code> | Audit subaction type. (example: USER) |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 2) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 1) |
| sort | <code>any</code> | Sort by any user object key (examples: created_on, action, etc.) (example: created_on) |
| sortdir | <code>any</code> | Sort direction (example ascending order: ASC) (example: ASC) |
| filter | <code>any</code> | Filter parameters (example: action=created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-03,created_on<2021-06-06) |
| resolve | <code>any</code> | Joins users table to obtain 'by_user_firstname' and 'by_user'lastname' fields (example: true) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Audit.byAction"></a>

### Audit.byAction(action, limit, skip, sort, sortdir, filter, resolve, authorization_bearer)
byAction - Gets audits by action type.

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example: id=415c87e9-eaad-4b8e-8ce8-655c911e20ae) |
| created_on | *optional* (example:  created_on>=2021-06-09) |
| prop | *optional* (example: prop=email) |
| old_val | *optional* (example:  old_val=swagger@email.69) |
| new_val | *optional* (example:  new_val=leet@teel.com) |

Path: api/v1/audit/action/:action

**Kind**: static method of [<code>Audit</code>](#Audit)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>any</code> | Audit action type. (example: CREATE) |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 2) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 1) |
| sort | <code>any</code> | Sort by any user object key (examples: created_on, action, etc.) (example: created_on) |
| sortdir | <code>any</code> | Sort direction (example ascending order: ASC) (example: ASC) |
| filter | <code>any</code> | Filter parameters (example: action=created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-03,created_on<2021-06-06) |
| resolve | <code>any</code> | Joins users table to obtain 'by_user_firstname' and 'by_user'lastname' fields (example: true) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="AuditUser"></a>

## AuditUser
**Kind**: global class  

* [AuditUser](#AuditUser)
    * [.byuserId(id, filter, limit, skip, sort, sortdir, resolve, selfexclusion, authorization_bearer)](#AuditUser.byuserId)
    * [.ofuserId(id, filter, limit, skip, sort, sortdir, resolve, selfexclusion, authorization_bearer)](#AuditUser.ofuserId)

<a name="AuditUser.byuserId"></a>

### AuditUser.byuserId(id, filter, limit, skip, sort, sortdir, resolve, selfexclusion, authorization_bearer)
byuserId - Gets audits by by_user id.

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example: id=415c87e9-eaad-4b8e-8ce8-655c911e20ae) |
| created_on | *optional* (example:  created_on>=2021-06-09) |
| action | *optional* (example:  action=CREATE) |
| subaction | *optional* (example:  subaction=USER) |
| prop | *optional* (example:  prop=email) |
| old_val | *optional* (example:  old_val=swagger@email.69) |
| new_val | *optional* (example:  new_val=leet@teel.com) |

Path: api/v1/audit/user/byuser/:id

**Kind**: static method of [<code>AuditUser</code>](#AuditUser)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Id of user that committed the action. (example: 44aa2ae6-22e9-43ef-a6d3-3d7d39e78064) |
| filter | <code>any</code> | Filter parameters (example: action=CREATE,subaction=USER,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-03,created_on<2021-06-06) |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 2) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 1) |
| sort | <code>any</code> | Sort by any user object key (examples: created_on, action, etc.) (example: created_on) |
| sortdir | <code>any</code> | Sort direction (example ascending order: ASC) (example: ASC) |
| resolve | <code>any</code> | Joins users table to obtain 'by_user_firstname' and 'by_user'lastname' fields (example: true) |
| selfexclusion | <code>any</code> | Excludes audits with the same of_user_id. (example: true) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="AuditUser.ofuserId"></a>

### AuditUser.ofuserId(id, filter, limit, skip, sort, sortdir, resolve, selfexclusion, authorization_bearer)
ofuserId - Gets audits by of_user id.

##### Filter Params

| Param | Description |
| --- | --- |
| id | *optional* (example: id=415c87e9-eaad-4b8e-8ce8-655c911e20ae) |
| created_on | *optional* (example:  created_on>=2021-06-09) |
| action | *optional* (example:  action=CREATE) |
| subaction | *optional* (example:  subaction=USER) |
| prop | *optional* (example:  prop=email) |
| old_val | *optional* (example:  old_val=swagger@email.69) |
| new_val | *optional* (example:  new_val=leet@teel.com) |

Path: api/v1/audit/user/ofuser/:id

**Kind**: static method of [<code>AuditUser</code>](#AuditUser)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Id of user that committed the action. (example: 44aa2ae6-22e9-43ef-a6d3-3d7d39e78064) |
| filter | <code>any</code> | Filter parameters (example: action=CREATE,subaction=USER,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-03,created_on<2021-06-06) |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 2) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 10) |
| sort | <code>any</code> | Sort by any user object key (examples: created_on, action, etc.) (example: action) |
| sortdir | <code>any</code> | Sort direction (example ascending order: ASC) (example: DESC) |
| resolve | <code>any</code> | Joins users table to obtain 'by_user_firstname' and 'by_user'lastname' fields (example: true) |
| selfexclusion | <code>any</code> | Excludes audits with the same by_user_id. (example: true) |
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
| id | <code>any</code> | id or name  (example: group1) |
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
    "type": "testgroup",
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
    * [.count(id, filter, limit, skip, authorization_bearer)](#GroupUsers.count)
    * [.get(id, filter, limit, skip, sort, sortdir, authorization_bearer)](#GroupUsers.get)

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

<a name="GroupUsers.count"></a>

### GroupUsers.count(id, filter, limit, skip, authorization_bearer)
count - Gets all the users that belong to the group.

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

Path: api/v1/group/id/:id/users/count

**Kind**: static method of [<code>GroupUsers</code>](#GroupUsers)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Group name or ID. (example: superadmin) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) |
| limit | <code>any</code> | Number of maximum results. (example: 10) (example: 10) |
| skip | <code>any</code> | Number of db rows skipped. (example: 2) (example: 2) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupUsers.get"></a>

### GroupUsers.get(id, filter, limit, skip, sort, sortdir, authorization_bearer)
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
| id | <code>any</code> | Group name or ID. (example: superadmin) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) |
| limit | <code>any</code> | Number of maximum results. (example: 10) (example: 10) |
| skip | <code>any</code> | Number of db rows skipped. (example: 2) (example: 2) |
| sort | <code>any</code> | Sort by any user object key (examples: id, domain, locked, etc.) (example: created_on) |
| sortdir | <code>any</code> | Sort direction (example ascending order: ASC) (example: ASC) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

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
    * [.inherited(id, type)](#GroupTypeUsers.inherited)
    * [.count(id, type, filter, limit, skip, authorization_bearer)](#GroupTypeUsers.count)
    * [.get(id, type, filter, limit, skip, sort, sortdir, authorization_bearer)](#GroupTypeUsers.get)

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

<a name="GroupTypeUsers.count"></a>

### GroupTypeUsers.count(id, type, filter, limit, skip, authorization_bearer)
count - Gets all the users that belong to the group  of a particular type by its name or id.

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

Path: api/v1/group/id/:id/type/:type/users/count

**Kind**: static method of [<code>GroupTypeUsers</code>](#GroupTypeUsers)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Group name or ID. (example: superadmin) |
| type | <code>any</code> | Group type. (example: group) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) |
| limit | <code>any</code> | Number of maximum results. (example: 10) (example: 10) |
| skip | <code>any</code> | Number of db rows skipped. (example: 2) (example: 2) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="GroupTypeUsers.get"></a>

### GroupTypeUsers.get(id, type, filter, limit, skip, sort, sortdir, authorization_bearer)
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

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Group name or ID. (example: superadmin) |
| type | <code>any</code> | Group type. (example: group) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) |
| limit | <code>any</code> | Number of maximum results. (example: 10) (example: 10) |
| skip | <code>any</code> | Number of db rows skipped. (example: 2) (example: 2) |
| sort | <code>any</code> | Sort by any user object key (examples: id, domain, locked, etc.) (example: created_on) |
| sortdir | <code>any</code> | Sort direction (example ascending order: ASC) (example: ASC) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

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
    * [.count(limit, skip, filter, ids, authorization_bearer)](#Users.count)
    * [.get(sort, limit, skip, filter, sortdir, ids, authorization_bearer)](#Users.get)

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

<a name="Users.count"></a>

### Users.count(limit, skip, filter, ids, authorization_bearer)
count - Gets all the users

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

Path: api/v1/users/count

**Kind**: static method of [<code>Users</code>](#Users)  

| Param | Type | Description |
| --- | --- | --- |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 2) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 10) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-06,created_on<2021-06-08) |
| ids | <code>any</code> | Comma seperated id values used in inclusion query (example: d0323874-9b24-4bc5-ae38-fb8808c4e453,08c4c17f-317b-4be8-bfbd-451a274a3f7f) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Users.get"></a>

### Users.get(sort, limit, skip, filter, sortdir, ids, authorization_bearer)
get - Gets all the users

##### Filter Params

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
| sort | <code>any</code> | Sort by any user object key (examples: id, domain, locked, etc.) (example: created_on) |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 2) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 10) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) |
| sortdir | <code>any</code> | Sort direction (example ascending order: ASC) (example: ASC) |
| ids | <code>any</code> | Comma seperated id values used in inclusion query (example: d0323874-9b24-4bc5-ae38-fb8808c4e453,08c4c17f-317b-4be8-bfbd-451a274a3f7f) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UsersDomain"></a>

## UsersDomain
**Kind**: global class  

* [UsersDomain](#UsersDomain)
    * [.count(domain, limit, skip, filter, ids, authorization_bearer)](#UsersDomain.count)
    * [.get(domain, sort, limit, skip, filter, sortdir, ids, authorization_bearer)](#UsersDomain.get)

<a name="UsersDomain.count"></a>

### UsersDomain.count(domain, limit, skip, filter, ids, authorization_bearer)
count - Gets all the users

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

Path: api/v1/users/domain/:domain/count

**Kind**: static method of [<code>UsersDomain</code>](#UsersDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | (example: dragohmventures.com) |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 5) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 10) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2022-06-01,created_on<2022-06-08) |
| ids | <code>any</code> | Comma seperated id values used in inclusion query (example: d0323874-9b24-4bc5-ae38-fb8808c4e453,08c4c17f-317b-4be8-bfbd-451a274a3f7f) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UsersDomain.get"></a>

### UsersDomain.get(domain, sort, limit, skip, filter, sortdir, ids, authorization_bearer)
get - Gets all the users

##### Filter Params

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

Path: api/v1/users/domain/:domain

**Kind**: static method of [<code>UsersDomain</code>](#UsersDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | (example: dragohmventures.com) |
| sort | <code>any</code> | Sort by any user object key (examples: id, domain, locked, etc.) (example: created_on) |
| limit | <code>any</code> | Number of maximum results. (example: 2) (example: 1) |
| skip | <code>any</code> | Number of db rows skipped. (example: 10) (example: 10) |
| filter | <code>any</code> | Filter parameters (example: locked=false,created_on>2021-06-03,created_on<2021-06-06) (example: created_on>2021-06-01,created_on<2021-06-08) |
| sortdir | <code>any</code> | Sort direction (example ascending order: ASC) (example: ASC) |
| ids | <code>any</code> | Comma seperated id values used in inclusion query (example: d0323874-9b24-4bc5-ae38-fb8808c4e453,08c4c17f-317b-4be8-bfbd-451a274a3f7f) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User"></a>

## User
**Kind**: global class  

* [User](#User)
    * [.delete(id, authorization_bearer)](#User.delete)
    * [.removeGroupInheritance(id, inheritgroupid, inheritgrouptype, authorization_bearer)](#User.removeGroupInheritance)
    * [.addGroupInheritance(id, inheritgroupid, inheritgrouptype, authorization_bearer)](#User.addGroupInheritance)
    * [.editUserDataPropertyValue(id, property, value, authorization_bearer)](#User.editUserDataPropertyValue)
    * [.editPropertyValue(id, property, value, authorization_bearer)](#User.editPropertyValue)
    * [.editUserDataProperty(body, id, property, authorization_bearer)](#User.editUserDataProperty)
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
| id | <code>any</code> | id or name of the user (example: 99a64193-b5a8-448d-8933-05d27f366094) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: testgroup) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.addGroupInheritance"></a>

### User.addGroupInheritance(id, inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a user to a group.

Path: api/v1/user/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name of the user (example: 99a64193-b5a8-448d-8933-05d27f366094) |
| inheritgroupid | <code>any</code> | id or name of the  group to inherit (example: group1) |
| inheritgrouptype | <code>any</code> | type of the  group to inherit (example: testgroup) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="User.editUserDataPropertyValue"></a>

### User.editUserDataPropertyValue(id, property, value, authorization_bearer)
editUserDataPropertyValue - Edit a current user's property data as a path param.

Path: api/v1/user/id/:id/property/userdata/:property/:value

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | Id or Username  (example: 595d3f9a-5383-4da9-a465-b975d8a5e28e) |
| property | <code>any</code> | user_data object's property to edit. (example: notes) |
| value | <code>any</code> | user_data object's property value. (example: asdfa sdfa sdf) |
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

<a name="User.editUserDataProperty"></a>

### User.editUserDataProperty(body, id, property, authorization_bearer)
editUserDataProperty - Edit a user's property by id.

Path: api/v1/user/id/:id/property/userdata/:property

**Kind**: static method of [<code>User</code>](#User)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| id | <code>any</code> | Id or Username  (example: 39A2BC37-61AE-434C-B245-A731A27CF8DA) |
| property | <code>any</code> | user_data object's property to edit. (example: notes) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```text
asdfasdf
```
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

<a name="UserDomain"></a>

## UserDomain
**Kind**: global class  

* [UserDomain](#UserDomain)
    * [.delete(domain, id, authorization_bearer)](#UserDomain.delete)
    * [.removeGroupInheritance(domain, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#UserDomain.removeGroupInheritance)
    * [.addGroupInheritance(domain, id, inheritgroupid, inheritgrouptype, authorization_bearer)](#UserDomain.addGroupInheritance)
    * [.editUserDataPropertyValue(domain, id, property, value, authorization_bearer)](#UserDomain.editUserDataPropertyValue)
    * [.editPropertyValue(domain, id, property, value, authorization_bearer)](#UserDomain.editPropertyValue)
    * [.editUserDataProperty(body, domain, id, property, authorization_bearer)](#UserDomain.editUserDataProperty)
    * [.editProperty(body, domain, id, property, authorization_bearer)](#UserDomain.editProperty)
    * [.edit(body, domain, id, authorization_bearer)](#UserDomain.edit)
    * [.getProperty(domain, id, property, authorization_bearer)](#UserDomain.getProperty)
    * [.get(domain, id, authorization_bearer)](#UserDomain.get)

<a name="UserDomain.delete"></a>

### UserDomain.delete(domain, id, authorization_bearer)
delete - Delete a user by it's Id.

Path: api/v1/user/domain/:domain/id/:id

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain.removeGroupInheritance"></a>

### UserDomain.removeGroupInheritance(domain, id, inheritgroupid, inheritgrouptype, authorization_bearer)
removeGroupInheritance - Remove a user from a group.

Path: api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: d1bf9986-9938-4d47-b8aa-79184b37cc16) |
| inheritgroupid | <code>any</code> | id or name of the group to inherit (example: group1) |
| inheritgrouptype | <code>any</code> | type of the group to inherit (example: testgroup) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain.addGroupInheritance"></a>

### UserDomain.addGroupInheritance(domain, id, inheritgroupid, inheritgrouptype, authorization_bearer)
addGroupInheritance - Add a user to a group.

Path: api/v1/user/domain/:domain/id/:id/inheritance/group/:inheritgroupid/type/:inheritgrouptype

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: user5) |
| inheritgroupid | <code>any</code> | id or name of the group to inherit (example: group2) |
| inheritgrouptype | <code>any</code> | type of the group to inherit (example: group) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain.editUserDataPropertyValue"></a>

### UserDomain.editUserDataPropertyValue(domain, id, property, value, authorization_bearer)
editUserDataPropertyValue - Edit a current user's property data as a path param.

Path: api/v1/user/domain/:domain/id/:id/property/userdata/:property/:value

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| property | <code>any</code> | Property to modify (example: locked) (example: notes) |
| value | <code>any</code> | Value to change property to. (example: asdf asdfawsdf) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain.editPropertyValue"></a>

### UserDomain.editPropertyValue(domain, id, property, value, authorization_bearer)
editPropertyValue - Edit a current user's property data as a path param.

Path: api/v1/user/domain/:domain/id/:id/property/:property/:value

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| property | <code>any</code> | Property to modify (example: locked) (example: locked) |
| value | <code>any</code> | Value to change property to. (example: true) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain.editUserDataProperty"></a>

### UserDomain.editUserDataProperty(body, domain, id, property, authorization_bearer)
editUserDataProperty - Edit a user's property by id.

Path: api/v1/user/domain/:domain/id/:id/property/userdata/:property

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| property | <code>any</code> | Property to modify (example: locked) (example: notes) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```text
asdfasdf asdf
```
<a name="UserDomain.editProperty"></a>

### UserDomain.editProperty(body, domain, id, property, authorization_bearer)
editProperty - Edit a user's property by id.

Path: api/v1/user/domain/:domain/id/:id/property/:property

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| property | <code>any</code> | Property to modify (example: locked) (example: locked) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```text
false
```
<a name="UserDomain.edit"></a>

### UserDomain.edit(body, domain, id, authorization_bearer)
edit - Edit a user's by id.

Path: api/v1/user/domain/:domain/id/:id

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"username" : "user6",
	"password" : "Awickednewawesomepasword4242!@"
}
```
<a name="UserDomain.getProperty"></a>

### UserDomain.getProperty(domain, id, property, authorization_bearer)
getProperty - Get a user's property by it's id.

Path: api/v1/user/domain/:domain/id/:id/property/:property

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: 75d2ed5e-bc5b-4129-a1ec-657cf27e6294) |
| property | <code>any</code> | Property to get (example: locked) (example: locked) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserDomain.get"></a>

### UserDomain.get(domain, id, authorization_bearer)
get - Get a user by it's id.

Path: api/v1/user/domain/:domain/id/:id

**Kind**: static method of [<code>UserDomain</code>](#UserDomain)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | Domain (example: test.com) (example: test.com) |
| id | <code>any</code> | id, username or email. (example: d1bf9986-9938-4d47-b8aa-79184b37cc16) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="UserCurrent"></a>

## UserCurrent
**Kind**: global class  

* [UserCurrent](#UserCurrent)
    * [.registerToken(body, authorization_bearer)](#UserCurrent.registerToken)
    * [.removeGroupInheritance(inheritgroupid, inheritgrouptype, authorization_bearer)](#UserCurrent.removeGroupInheritance)
    * [.addGroupInheritance(inheritgroupid, inheritgrouptype, authorization_bearer)](#UserCurrent.addGroupInheritance)
    * [.editUserDataPropertyValue(property, value, authorization_bearer)](#UserCurrent.editUserDataPropertyValue)
    * [.editPropertyValue(property, value, authorization_bearer)](#UserCurrent.editPropertyValue)
    * [.editUserDataProperty(body, property, authorization_bearer)](#UserCurrent.editUserDataProperty)
    * [.editProperty(body, property, authorization_bearer)](#UserCurrent.editProperty)
    * [.deleteToken(id, authorization_bearer)](#UserCurrent.deleteToken)
    * [.edit(body, authorization_bearer)](#UserCurrent.edit)
    * [.getProperty(property, authorization_bearer)](#UserCurrent.getProperty)
    * [.routesCheck(body, authorization_bearer)](#UserCurrent.routesCheck)
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
    "urls": [
        "http://127.0.0.1",
        "http://checkpeople.com"
    ]
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

<a name="UserCurrent.editUserDataPropertyValue"></a>

### UserCurrent.editUserDataPropertyValue(property, value, authorization_bearer)
editUserDataPropertyValue - Edit a current user's property data as a path param.

Path: api/v1/user/me/property/userdata/:property/:value

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>any</code> | user_data object's property to edit. (example: notes) |
| value | <code>any</code> | user_data object's property value. (example: asdf asdfasdf asdf ) |
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

<a name="UserCurrent.editUserDataProperty"></a>

### UserCurrent.editUserDataProperty(body, property, authorization_bearer)
editUserDataProperty - Edit a current user's property data.

Path: api/v1/user/me/property/userdata/:property

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| property | <code>any</code> | user_data object's property to edit. (example: notes) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```text
asdfsasdfdsadf
```
<a name="UserCurrent.editProperty"></a>

### UserCurrent.editProperty(body, property, authorization_bearer)
editProperty - Edit a current user's property data.

Path: api/v1/user/me/property/:property

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| property | <code>any</code> | (example: password) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```text
newpasss
```
<a name="UserCurrent.deleteToken"></a>

### UserCurrent.deleteToken(id, authorization_bearer)
deleteToken - Deletes a client_credentials based access token auth.

Path: api/v1/user/me/token/:id

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | id or name of the token (example: 74b3c2f2-3f94-4b5d-b3e2-4b3bd2c5d6fe) |
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

<a name="UserCurrent.routesCheck"></a>

### UserCurrent.routesCheck(body, authorization_bearer)
routesCheck - Checks if current logged in user can access the routes specified within the body array.

Path: api/v1/user/me/routes/allowed

**Kind**: static method of [<code>UserCurrent</code>](#UserCurrent)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
[
    {
        "method": "GET",
        "route": "/account/api/user/me"
    },
    {
        "route": "/t/api/user/me/asdf"
    }
]
```
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
    * [.activate(token, authorization_bearer)](#Auth.activate)
    * [.resetPasswordAutoLogin(body, token, authorization_bearer)](#Auth.resetPasswordAutoLogin)
    * [.resetPassword(body, token, authorization_bearer)](#Auth.resetPassword)
    * [.forgotPassword(body, authorization_bearer)](#Auth.forgotPassword)
    * [.logout(authorization_bearer)](#Auth.logout)
    * [.loginOtp(token, authorization_bearer)](#Auth.loginOtp)
    * [.login(body, authorization_bearer)](#Auth.login)
    * [.register(body, randomPassword, authorization_bearer)](#Auth.register)

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

### Auth.activate(token, authorization_bearer)
activate - Activates and unlocks user

Path: api/v1/auth/activate

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | (example: activation_token) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Auth.resetPasswordAutoLogin"></a>

### Auth.resetPasswordAutoLogin(body, token, authorization_bearer)
resetPasswordAutoLogin - Resets the password if the recovery token is valid of the user, then authenticates the user and returns cookies.

Path: api/v1/auth/password/reset/login

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| token | <code>any</code> | (example: [thegeneratedtoken]) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"password":"asdf"
}
```
<a name="Auth.resetPassword"></a>

### Auth.resetPassword(body, token, authorization_bearer)
resetPassword - Resets the password if the recovery token is valid of the user.

Path: api/v1/auth/password/reset

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| token | <code>any</code> | (example: [thegeneratedtoken]) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"password":"asdf"
}
```
<a name="Auth.forgotPassword"></a>

### Auth.forgotPassword(body, authorization_bearer)
forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist)

Path: api/v1/auth/password/forgot

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"email": "test@test.com"
}
```
<a name="Auth.logout"></a>

### Auth.logout(authorization_bearer)
logout -

Path: api/v1/auth/logout

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Auth.loginOtp"></a>

### Auth.loginOtp(token, authorization_bearer)
loginOtp - Login via an OTP

Path: api/v1/auth/login/otp

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>any</code> | (example: JQHGH9QuIIhpGuFBG920TdnWkSECFp-ONP0NadfPCclsX708wYaXKHFb5nUj1fmZFHcN1KpKqzkOkjfZGYdfsIt0KnWV69mmt5Uqpw3HiMYD1mBfr4SQap2cg8vH78bb|6Rzt6ubKWXJKY6Pg4GAePg==) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="Auth.login"></a>

### Auth.login(body, authorization_bearer)
login - Login a user

##### Body Properties

| Prop | Description |
| --- | --- |
| email/username | *required* String (example:  test@test.com) |
| password | *required* String (example:  fakePassword123) |
| remember | *optional* Boolean if you would like to be logged in automatically (example:  true) |

Path: api/v1/auth/login

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"email": "test@test.com",
	"password": "Pas5w0r!d"
}
```
<a name="Auth.register"></a>

### Auth.register(body, randomPassword, authorization_bearer)
register - Register a user

`group_request`	is optional.

Path: api/v1/auth/register

**Kind**: static method of [<code>Auth</code>](#Auth)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| randomPassword | <code>any</code> | Generates a random password on the backend securely if set to `true` (example: true) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"username":"test",
	"email": "test34@test.com",
    "domain": "default",
    "password": "Pas5w0r!d"

}
```
<a name="AuthToken"></a>

## AuthToken
**Kind**: global class  

* [AuthToken](#AuthToken)
    * [.otp(id, authorization_bearer)](#AuthToken.otp)
    * [.forgotPassword(body)](#AuthToken.forgotPassword)

<a name="AuthToken.otp"></a>

### AuthToken.otp(id, authorization_bearer)
otp - Generates a one time use password and returns the token to the attached user (if they exist) instead of sending an email.
*CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**

Path: api/v1/auth/token/otp/id/:id

**Kind**: static method of [<code>AuthToken</code>](#AuthToken)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>any</code> | (example: test@test.com) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="AuthToken.forgotPassword"></a>

### AuthToken.forgotPassword(body)
forgotPassword - Generates a recovery token and returns the token to the attached user (if they exist) instead of sending an email.
*CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**

Path: api/v1/auth/token/password/forgot

**Kind**: static method of [<code>AuthToken</code>](#AuthToken)  

| Param | Type |
| --- | --- |
| body | <code>Object</code> | 

**Example**  
body
```json
{
	"email": "test@test.com"
}
```
<a name="AuthDomain"></a>

## AuthDomain
**Kind**: global class  

* [AuthDomain](#AuthDomain)
    * [.forgotPassword(body, domain, authorization_bearer)](#AuthDomain.forgotPassword)
    * [.login(body, domain, authorization_bearer)](#AuthDomain.login)
    * [.register(body, domain, randomPassword, authorization_bearer)](#AuthDomain.register)

<a name="AuthDomain.forgotPassword"></a>

### AuthDomain.forgotPassword(body, domain, authorization_bearer)
forgotPassword - Generates a recovery token and sends a email to the attached user (if they exist)

Path: api/v1/auth/password/forgot/domain/:domain

**Kind**: static method of [<code>AuthDomain</code>](#AuthDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | Domain name (example: test.com) (example: dragohmventures.com) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"email": "kelvin@dragohmventures.com"
}
```
<a name="AuthDomain.login"></a>

### AuthDomain.login(body, domain, authorization_bearer)
login - Login a user

##### Body Properties

| Prop | Description |
| --- | --- |
| email/username | *required* String (example:  test@test.com) |
| password | *required* String (example:  fakePassword123) |
| domain | *required* String (example:  test.com) |
| remember | *optional* Boolean if you would like to be logged in automatically (example:  true) |

Path: api/v1/auth/login/domain/:domain

**Kind**: static method of [<code>AuthDomain</code>](#AuthDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | Domain name (example: test.com) (example: dragohmventures.com) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
    "email": "test@test.com",
	"password": "Pas5w0r!d"
}
```
<a name="AuthDomain.register"></a>

### AuthDomain.register(body, domain, randomPassword, authorization_bearer)
register - Register a user

`group_request`	is optional.

Path: api/v1/auth/register/domain/:domain

**Kind**: static method of [<code>AuthDomain</code>](#AuthDomain)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> | Domain name (example: test.com) (example: dragohmventures.com) |
| randomPassword | <code>any</code> | Generates a random password on the backend securely if set to `true` (example: true) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
	"email": "test@test.com",
	"password": "Pas5w0r!d"
}
```
<a name="AuthDomainToken"></a>

## AuthDomainToken
**Kind**: global class  

* [AuthDomainToken](#AuthDomainToken)
    * [.otp(domain, id, authorization_bearer)](#AuthDomainToken.otp)
    * [.forgotPassword(body, domain, authorization_bearer)](#AuthDomainToken.forgotPassword)

<a name="AuthDomainToken.otp"></a>

### AuthDomainToken.otp(domain, id, authorization_bearer)
otp - Generates a one time use password and returns the token to the attached user (if they exist) instead of sending an email.
*CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**

Path: api/v1/auth/token/otp/domain/:domain/id/:id

**Kind**: static method of [<code>AuthDomainToken</code>](#AuthDomainToken)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>any</code> | (example: dragohmventures.com) |
| id | <code>any</code> | (example: test@test.com) |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

<a name="AuthDomainToken.forgotPassword"></a>

### AuthDomainToken.forgotPassword(body, domain, authorization_bearer)
forgotPassword - Generates a recovery token and returns the token to the attached user (if they exist) instead of sending an email.
*CAUTION SECURITY RISK: Would not expose this URL publicly or have it be allowed by anyone who is not a superadmin type level**

Path: api/v1/auth/token/password/forgot/domain/:domain

**Kind**: static method of [<code>AuthDomainToken</code>](#AuthDomainToken)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> |  |
| domain | <code>any</code> |  |
| authorization_bearer | <code>string</code> | The client_credentials generated OAUth2 access token. |

**Example**  
body
```json
{
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
