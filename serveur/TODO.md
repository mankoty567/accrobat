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
- obstacle:completed

## TODO TODAY
- [x] Récupération de l'image d'un obstacle
- [x] Modification d'obstacle
- [x] Gestion de l'event obstacle
- [ ] Renvoit de l'image soumise à un obstacle
- [ ] Renvoit de la position par rapport à la personne
- [ ] Vérification de la réponse à l'obstacle
- [ ] Ajout d'un obstacle type action
- [ ] Validation d'un obstacle type action
- [ ] récupération des obstacles type action