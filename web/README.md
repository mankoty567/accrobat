# Documentation développeur :

## 1.Introduction

Cette application web est une application qui fonctionne avec le framework [React](https://reactjs.org/).
Pour démarrer l'application en développement, rien de plus simple : 
* Ayez tout d'abord nodeJS et npm d'installé sur votre machine. Pour windows, cela s'installe [ici](https://nodejs.org/en/), sur Linux, utilisez votre gestionnaire de paquet.
* Si le projet est lancé pour la première fois, lancez un `npm install`
* Enfin, à chaque fois que l'on souhaite essayer l'interface, il suffit d'exécuter `npm run start`

## 2.Architecture de l'application

Vous trouverez plus d'informations sur l'architecture du projet sur [ce lien](https://gitlab.unistra.fr/equipe-31/projet-acrobatt/-/blob/develop/web/Architecture-LA1.md). Vous y trouverez tout ce qui concerne l'arborescence du fichier, ainsi que l'utiliser de chaque dossier.

## 3.Organisation du code

Le coeur de l'application débute par [App.js](https://gitlab.unistra.fr/equipe-31/projet-acrobatt/-/blob/master/web/src/App.js), qui est le fichier contenant le thème générique de l'application, s'appliquant à tout les éléments de cette application. Puis ensuite, tout transite par la mainPage, avant d'arriver dans les différent dossier, propre à chaque endroit. Le tout est plus détaillé dans le dossier d'architecture.

Chaque fichier de composants est en général organisé par plusieurs partie s'il ne dispose pas de sous-composant propre à sa page : 
* Les variables d'interface
* Les fonctions
* Les appels d'API
Le tout est d'essayer au maximum d'encapsuler les fonction données au compsants, si elle font plus de 2 instructions, afin de permettre une mutualisation, et une simplicité pour modifier le code.

Il ne faut pas non plus hésiter à mettre des commentaires de fonctions, qui se font en tapant `/**` puis entrer. Plus qu'à renseigner les paramètre et sûrement la valeur de retour.

Les nommages se font en général en camelCase, concernant les variables d'interface ou même de fonction, soit donc début en minuscule, puis chaque mot débute d'une majuscule.

# 4.Liste des modules utilisés : 

Il ne faut pas hésiter à consulter le [package.json](https://git.unistra.fr/equipe-3/projet-acrobatt/-/blob/feature/FrontWebCreation/web/package.json).

Voici la liste exhaustive des modules mis en place : 
* **Eslint :** un module qui permet de bannir certaines syntaxes ou façon de faire, afin de maintenir la qualité du code. Autement configurable, mais encore non mis en place. [Lien de la documentation](https://eslint.org/docs/user-guide/configuring/).
* **Prettier :** un module qui fait office de code formatter pour le projet. Aucune configuration n'est donc requise, et le code est formatté toujours de la même manière, évitant d'avoir des syntaxes différentes pour chaques parties du projet.
* **Material-ui :** framework CSS très complet bien que légèrement rigide sur certaines opérations, qui permet de mettre en place facilement une interface material design, ainsi qu'un thème mutualisé et de la responsivité. [Lien de la documentation](https://material-ui.com/), puis naviguez sur le menu déroulant de gauche.
* **Tiptap :** Un éditeur de texte web, disposant de nombreuses extensions et laissant la main au développeur pour intégrer facilement ce qu'il souhaite. Utilisé surtout pour les descriptions en texte riche de challenge. [Lien de la documentation](https://www.tiptap.dev/installation).
* **Leaflet :** Un module permettant de gérer un système de CRS, et ainsi permettant de créer une carte. Très complet, open-source, bien qu'il demande d'installer une surcouche afin de fonctionner sur React, ce qui rend les fonction de base difficile à utiliser parfois. [Lien de la documentation](https://leafletjs.com/reference-1.7.1.html) et pour la [surcouche react](https://react-leaflet.js.org/docs/example-popup-marker).
* **Recoil :** Il s'agit d'un module implémentant des server-state globaux. Cela est notamment utile pour conserver et utiliser facilement les données de l'utilisateur connecté, afin d'éviter bon nombre de requêtes inutiles. [Lien de la documentation](https://recoiljs.org/docs/introduction/installation).
* **Sass :** Un module permettant d'utiliser le SCSS, qui est un CSS avec de nouvelles fonctionnalités. Très peu utilisées pour le moment, il est tout de même possible de s'en servir. [Lien de la documentation](https://sass-lang.com/documentation).
