# Liste des routes

## Challenge
- **GET** `/api/challenge/:id` : Récupération d'un challenge ainsi que de ses points
*Query Param* : 
-> include=point : Les points de passage reliés au challenge se retrouvent dans PointPassages
-> include=pointsegment : Les Points de Passage reliés au challenge se retrouvent dans PointPassage, et les segments reliés aux points se retrouvent dans PointStarts et PointEnds 
```JSON
{
    "id": 0,
    "title": "",
    "description": "",
    "img_fond": "data:image/",
    "createdAt": "date",
    "updatedAt": "date",
    "PointPassages": [
      {
        ...
        "pointStarts": [{
          "distance": 0,
          "PointStartId": 0,
          "PointEndId": 0,
          "path": [[0,0]]
        }],
        "pointEnds": []
      }
    ]
}
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

- **POST** `/api/challenge/:id` : Modification d'un challenge (tous les champs sont optionnels)
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
*404* `Challenge not found`

- **DELETE** `/api/challenge/:id` : Suppression d'un challenge
*200* `Deleted`
*400* `Bad request`
*404* `Challenge not found`

## PointPassage
- **GET** `/api/challenge/:id/point` : Récupération de tous les points de passage d'un segment
*Query Param* : 
-> include=segment : Les segments reliés aux points se retrouvent dans pointStarts et pointEnds 
```JSON
[
  {
    "id": 0,
    "title": "",
    "description": "",
    "type": "start/end/point",
    "x": 0,
    "y": 0,
    "createdAt": "date",
    "updatedAt": "date",
    "ChallengeId": 0,
    "pointStarts": [],
    "pointEnds": []
  }
]
```

- **POST** `/api/challenge/:id/point` : Création d'un point de passage
-> `:id` : Id du challenge auquel il appartient 
```JSON
{
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

- **POST** `/api/pointpassage/:id` : Modification d'un point de passage (tous les champs sont optionnels)
```JSON
{
  "title": "",
  "description": "",
  "x": 0,
  "y": 0
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
  "createdAt": "date",
  "updatedAt": "date",
  "ChallengeId": 0
}
```
*400* `Bad Request`
*404* `PointPassage not found`

- **DELETE** `/api/pointpassage/:id`
*200* `Deleted`  
*400* `Bad Request/Error`  
*404* `PointPassage not found`

## Segment
- **POST** `/api/segment` : Création d'un segment
```JSON
{
  "distance": 0,
  "PointStartId": 0,
  "PointEndId": 0
}
```
*200*
```JSON
{
  "id": 1,
  "distance": 100,
  "PointStartId": 1,
  "PointEndId": 1,
  "updatedAt": "2021-02-04T14:07:55.619Z",
  "createdAt": "2021-02-04T14:07:55.619Z"
}
```
*400* `Bad request`
*404* `PointStartId or PointEndId not exist`

## ChallengeCurrent
- **GET** `/api/challengecurrent/get_all` : Récupération de tous les challenges courrants de l'utilisateur
*200*
```JSON
{
  "id": 0,
  "Participation": {
    "startDate": "date",
    "id": 0,
    "Challenge": {
      "title": "",
      "description": "",
      "id": 0
    }
  }
}
```
- **GET** `/api/challengecurrent/:id` : Récupération des informations sur un ChallengeCurrent
*200*
```JSON
{
    "id": 0,
    "SegmentId": null,
    "PointPassageId": null,
    "Participation": {
        "startDate": "",
        "id": 0,
        "ChallengeId": 0
    }
}
```
*404* `Not Found`
- **POST** `/api/challengecurrent/:id/save` : Sauvegarde de la progression
```JSON
{
  "PointPassageId": 0
}
```
OU
```JSON
{
  "SegmentId": 0,
  "distance": 0
}
```
*200*
```JSON
{
  "id": 0,
  "distance": 0/null,
  "createdAt": "date",
  "updatedAt": "date",
  "ParticipationId": 0,
  "SegmentId": 0/null,
  "PointPassageId": 0/null,
  "Participation": {}
}
```