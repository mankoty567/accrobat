# Liste des routes

## Challenge
- **GET** `/api/challenge/:id` : Récupération d'un challenge ainsi que de ses points
```JSON

```
- **POST** `/api/challenge` : Création d'un challenge
```JSON
{
  "title": "",
  "description": "",
  "img_fond": "data:"
}
```
*200*
```JSON
{
  "id": 0,
  "title": "",
  "description": "",
  "img_fond": "data:image/",
  "createdAt": "date",
  "updatedAt": "date",
}
```
*400* `Bad Request`
```
Bad Request
``` 

## PointPassage
- **POST** `/api/challenge/:id/point` : Création d'un point de passage
-> `:id` : Id du challenge auquel il appartient 
```JSON
{
  "id": 0,
  "title": "",
  "description": "",
  "type": "start/end/point",
  "x": 0,
  "y": 0,
}
```
*200*
```JSON
{
    "id": 0,
    "title": "",
    "description": "",
    "type": "start/end/point",
    "x": 0,
    "y": 0,
    "ChallengeId": "",
    "updatedAt": "date",
    "createdAt": "date"
}
```
*400* `Bad request`
*404* `Challenge not exist`