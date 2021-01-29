# Liste des modules disponible : 

Il ne faut pas hésiter à vérifier le [package.json](https://git.unistra.fr/equipe-3/projet-acrobatt/-/blob/feature/FrontWebCreation/web/package.json).
Il y a actuellement 2 modules mis en place : 
* **Eslint :** un module qui permet de bannir certaines syntaxes ou façon de faire, afin de maintenir la qualité du code.
* **Prettier :** un module qui fait office de code formatter pour le projet. Aucune configuration n'est donc requise, et le code est formatté toujours de la même manière.


# Architecture du projet

A la base se situe un fichier .env, dans lequel nous entrerons toutes les variable statiques, globales ou type token, afin que rien ne fuite.

Concernant l'arborescence :
* scenes contiendra toutes les "pages" sur lesquelles tourneront l'application.
* components contiendra tout les composants réutilisable, ainsi donc, dès la duplication d'une partie de template, il sera nécessaire de le placer ici (un bouton custom utilisable à plusieurs endroits par exemple).
* eventApi contiendra tout les appels à l'API, qui seront donc parfaitement asynchrone.
