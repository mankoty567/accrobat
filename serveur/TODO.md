- Evenement : date, type, challenge, data -> Sauvegarde les différentes évènements
- Client Nazi: Quand tu arrive à un obstacle, ça n'avance plus, tu dois faire l'enigme sinon ça avance plus
- Point de passage : Aussi un choix à faire, l'app s'arrête, popup pour le choix, si le choix n'est pas fait ça arrête tout


type:
- marche [Distance]
- course [Distance]
- velo [Distance]
- pointpassage:arrivee
- pointpassage:depart [Segment choisis]
- obstacle:arrivee [Id de l'obstacle]
- obstacle:image
- obstacle:image_ok
- obstacle:image_refused [Id de l'obstacle]
- obstacle:bad_answer [Id de l'obstacle]
- obstacle:completed

## TODO TODAY
- [x] Récupération de l'image d'un obstacle
- [x] Modification d'obstacle
- [x] Gestion de l'event obstacle
- [x] Sauvegarde des images sur le disque
- [x] Supprimer la description obligatoire du point de passage
- [x] Ajouter paramètre custom quand on crée un point
- [x] Renvoit de l'image soumise à un obstacle
- [ ] Renvoit de la position par rapport à la personne
- [x] Vérification de la réponse à l'obstacle question
- [x] Ajout d'une image à obstacle type action
- [x] Validation d'un obstacle type action
- [x] récupération de toutes les images submitions type action
- [x] Ajouter un status dans un challenge (en cours, ou disponible)
- [x] Ajouter la possibilitée de dupliquer un challenge
- [x] Ajouter une route de vérification du challenge avant la publication
- [x] Ajouter une route qui publie un challenge
- [x] Ajouter un petit avatar pour le challenge
- [x] Ajouter un moyen de mettre pleins de données de tests
- [x] Connection de l'utilisateur
- [x] Route whoami
- [ ] Middleware de connection (verification de l'utilisateur, vérification de si bon l'utilisateur)