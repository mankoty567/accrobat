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

