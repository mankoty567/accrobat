# Liste des modules disponible : 

Il ne faut pas hésiter à vérifier le [package.json](https://git.unistra.fr/equipe-3/projet-acrobatt/-/blob/feature/FrontWebCreation/web/package.json).
Il y a actuellement 2 modules mis en place : 
* **Eslint :** un module qui permet de bannir certaines syntaxes ou façon de faire, afin de maintenir la qualité du code.
* **Prettier :** un module qui fait office de code formatter pour le projet. Aucune configuration n'est donc requise, et le code est formatté toujours de la même manière.


# Architecture du projet

A la base se situe un fichier .env, dans lequel nous entrerons toutes les variable statiques, globales ou type token, afin que rien ne fuite.

Concernant l'arborescence :
* **Scenes :** Contiendra toutes les "pages" et sous-pages sur lesquelles tourneront l'application.
* **Components :** Contiendra tout les composants réutilisable, ainsi donc, dès la duplication d'une partie de template, il sera nécessaire de le placer ici (un bouton custom utilisable à plusieurs endroits par exemple).
* **EventApi :** Contiendra tout les appels à l'API, qui seront donc parfaitement asynchrone.

Pour les composants : 
* **ChallengeItem :** Utilisé dans plusieurs emplacement (publique et administrateur), il permet d'afficher les challenges avec un agencement particulier.
* **Navbar :** Evidemment, la barre de navigation sera présente dans toute l'application pour permettre au joueur de naviguer dans l'interface facilement.
* **ImageUploader :** Cela permet d'enregistrer une image et de l'envoyer en format base64, soit donc le format utilisé en base de données.
* **SmallMessage :** Un composant permettant d'afficher un petit message dans l'application.

Concernant les dossiers de scene : 
* **adminPanel :** Contient toutes les pages consultable du panel d'administration, autant l'éditeur que les interfaces.
* **challengePage :** Contient toutes les pages destinées à la consultation de participation, ou bien même d'une inscription à une channel.
* **loginForm :** Tout ce qui concerne la gestion de la connexion de l'utilisateur.
* **mainPage :** Le point d'entrée de toute les pages, qui sont donc affichée dans celle là. Contient la barre de navigation essentiellement.
* **profilePage :** La page de gestion de profile, pour qu'un utilisateur puisse modifier des informations le concernant.
