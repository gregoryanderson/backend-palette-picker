# Palette Picker API

## About

Palette Picker is a website that generates random color combinations (palettes) of 5 colors. The API allows for saving palettes in folders. 

The available endpoints are: 

##### Folders

* GET /api/v1/folders to get all folders in the database
* GET /api/v1/folders?name=[name] to get a specific folder by name
* GET /api/v1/folders/:id to get a specific folder by id
* POST /api/v1/folders to post a new folder to the database
* PATCH /api/v1/folders/:id to edit an existing folder by id
* DELETE /api/v1/folders/:id to delete a folder and it's associated palettes from the database

##### Palettes

* GET /api/v1/palettes to get all palettes in the database
* GET /api/v1/palettes/:id to get a specific palette by id
* POST /api/v1/palettes to post a new palette to the database
* PATCH /api/v1/palettes/:id to edit an existing palette by id
* DELETE /api/v1/palettes/:id to delete a palette from the database

## Endpoints

#### List all folders

```
GET /api/v1/folders
```


##### Parameters

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `id` | `number` | Unique id of folder |
| `name` | `string` | User-created name of folder |

##### Response

Returns an array containing all folders in database.

` Status: 200 OK `

```json
[
    {
        "id": 3,
        "name": "Test Folder 2",
        "created_at": "2019-10-09T01:35:09.554Z",
        "updated_at": "2019-10-09T01:35:09.554Z"
    },
    {
        "id": 4,
        "name": "Blah",
        "created_at": "2019-10-10T19:09:12.843Z",
        "updated_at": "2019-10-10T19:09:12.843Z"
    }
]

```





---
#### Find specific folder by id

```
GET /api/v1/folders/:id
```

##### Parameters

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `id` | `number` | Unique id of folder |
| `name` | `string` | User-created name of folder |

##### Response

Returns an array containing folder matching the `id` parameter

```json
[
    {
        "id": 3,
        "name": "Test Folder 2",
        "created_at": "2019-10-09T01:35:09.554Z",
        "updated_at": "2019-10-09T01:35:09.554Z"
    }
]

```

##### Error

`Status: 404 Not Found`

```json
{
    "error": "Could not find folder with id 9"
}
```

---
#### Find specific folder by name

```
GET /api/v1/folders?name=[search term]
```

`search term` is a string without quotes and is not case-sensitive

##### Parameters

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `id` | `number` | Unique id of folder |
| `name` | `string` | User-created name of folder |

##### Response

Returns an array containing the folder with a name matching the search term in request

`Status: 200 OK`

```json
[
    {
        "id": 3,
        "name": "Test Folder 2",
        "created_at": "2019-10-09T01:35:09.554Z",
        "updated_at": "2019-10-09T01:35:09.554Z"
    }
]

```

##### Error

`Status: 404 Not Found`

```json
{
    "error": "Could not find folder with name Winter Palettes"
}
```

----
#### Add new folder

```
POST /api/v1/folders
```


##### Input (Request Body)

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `name` | `string` | User-created name of folder |

##### Response

Returns an object with the id of the newly-created folder

`Status: 201 Created`

```json
{
    "id": 5
}
```

##### Error

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot POST /api/v1/folders/3</pre>
</body>
</html>
```


----
#### Edit existing folder

```
PATCH /api/v1/folders/:id
```

##### Input (Request Body)

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `name` | `string` | **Required** User-created name of folder |

##### Response

Returns object with id of edited folder.

`Status: 202 Accepted`

```
{
    "id": 5
}
```

##### Error 

`Status: 422 Unprocessable Entry`

```json
{"error":"Expected format { name: <String>. You are missing a name property}"}
```

---
#### Delete folder

```
DELETE /api/v1/folders/:id
```

##### Response

`Status: 200 OK`

```
"Folder with the id of 6 has been deleted."
```

##### Error

`Status: 404 Not Found`

```json
{"error":"Could not find folder with the id of 399"}
```



---
#### List all palettes

```
GET /api/v1/palettes
```

##### Parameters

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `id` | `number` | Unique id of palette |
| `color1` | `string` | String containing hex code of color |
| `color2` | `string` | String containing hex code of color |
| `color3` | `string` | String containing hex code of color |
| `color4` | `string` | String containing hex code of color |
| `color5` | `string` | String containing hex code of color |
| `name` | `string` | User-created name of palette |
| `folder_id` | `number` | id of associated folder containing palette |


##### Response

Returns array of all palettes in database

`Status: 200 OK`

```json

[
    {
        "id": 3,
        "color1": "#FF5733",
        "color2": "#0D1E6D",
        "color3": "#176D0D",
        "color4": "#C2E436",
        "color5": "#570E43",
        "name": "Test Palette 3",
        "folder_id": 3,
        "created_at": "2019-10-09T01:35:09.560Z",
        "updated_at": "2019-10-09T01:35:09.560Z"
    },
    {
        "id": 4,
        "color1": "#20570E",
        "color2": "#1316C4",
        "color3": "#ABADFF",
        "color4": "#00F997",
        "color5": "#900C3F",
        "name": "Test Palette 4",
        "folder_id": 3,
        "created_at": "2019-10-09T01:35:09.560Z",
        "updated_at": "2019-10-09T01:35:09.560Z"
    }
]
```


----
#### Find specific palette by id

```
GET /api/v1/palettes/:id
```

##### Parameters

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `id` | `number` | Unique id of palette |
| `color1` | `string` | String containing hex code of color |
| `color2` | `string` | String containing hex code of color |
| `color3` | `string` | String containing hex code of color |
| `color4` | `string` | String containing hex code of color |
| `color5` | `string` | String containing hex code of color |
| `name` | `string` | User-created name of palette |
| `folder_id` | `number` | id of associated folder containing palette |

##### Response

Returns array containing palette that matches id in request

`Status: 200 OK`

```json

[
    {
        "id": 3,
        "color1": "#FF5733",
        "color2": "#0D1E6D",
        "color3": "#176D0D",
        "color4": "#C2E436",
        "color5": "#570E43",
        "name": "Test Palette 3",
        "folder_id": 3,
        "created_at": "2019-10-09T01:35:09.560Z",
        "updated_at": "2019-10-09T01:35:09.560Z"
    }
]
```
##### Error
`Status: 404 Not Found`

```json
{
    "error": "Could not find palette with id 300"
}
```

----
#### Add new palette

```
POST /api/v1/palettes
```

##### Input

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `color1` | `string` | **Required** String containing hex code of color |
| `color2` | `string` | **Required** String containing hex code of color |
| `color3` | `string` | **Required** String containing hex code of color |
| `color4` | `string` | **Required** String containing hex code of color |
| `color5` | `string` | **Required** String containing hex code of color |
| `name` | `string` | **Required** User-created name of palette |
| `folder_id` | `number` | **Required** id of associated folder containing palette |

##### Response

Returns id of newly-created palette 

`Status: 201 Created`

```json
{
    "id": 7
}
```
##### Error

`Status: 422 Unprocessable Entry`

```json
{
    "error": "Expected format: { folder_id: <String>, color1: <Number>, color2: <Number>, color3: <Number>, color4: <Number>, color5: <Number>, name: <String> }. Youre missing a \"folder_id\" property."
}
```

---

#### Edit existing palette

```
PATCH /api/v1/palettes/:id
```

##### Input

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `color1` | `string` | **Required** String containing hex code of color |
| `color2` | `string` | **Required** String containing hex code of color |
| `color3` | `string` | **Required** String containing hex code of color |
| `color4` | `string` | **Required** String containing hex code of color |
| `color5` | `string` | **Required** String containing hex code of color |
| `name` | `string` | **Required** User-created name of palette |
| `folder_id` | `number` | **Required** id of associated folder containing palette |

##### Response

Returns object containing id of successfully-updated palette

`Status: 202 Accepted`

```json
{
    "id": "7"
}
```

##### Error

`Status: 422 Unprocessable Entry`

```json
{
    "error": "Expected format: { folder_id: <String>, color1: <Number>, color2: <Number>, color3: <Number>, color4: <Number>, color5: <Number>, name: <String> }. You're missing a \"folder_id\" property."
}
```



---

#### Delete palette

```
DELETE /api/v1/palettes/:id
```

##### Response

`Status: 200 OK `

```
"Palette with the id of 7 has been deleted"
```

##### Error

`Status: 402 Not Found`

```json
"Could not find palette with the id of 3999"
```