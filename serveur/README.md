# Serveur

## Architecture
Au niveau de l'API, le principal choix a été de développer l'API sous NodeJS avec la bibliothèque Express, et Sequelize comme ORM. Nous avons fait ce choix puisque NodeJS était la technologie que nous maitrisions le plus et nous pensions pouvoir avoir une API la plus simple possible grâce à cela.  
Le choix supplémentaire a été d'utiliser Docker et Docker-Compose pour le développement et la production, pour avoir un environnement de développement simple avec une base de donnée liée uniquement à l'application. Et grâce à Docker, on peut build notre conteneur en local, ensuite le mettre sur le dépot d'image Gitlab, avant de le récupérer sur notre serveur et de le déployer.  

Parmis les bibliothèques, le choix de Express a été rapide puisqu'il est qu'une légère surcouche au module HTTP de NodeJS, tout en nous fournissant une API bien plus simple à écrire. Sequelize lui a été choisit puisque c'est une bibliothèque à la fois très complête mais simple d'utilisateur, avec la possibilité d'utiliser différentes bases de données à notre convenance, ici MySQL.  

En plus de ça, nous utilisons Typescript pour la définition des routes, pour avoir une syntaxe d'écriture de celles ci rigoureuse et nous permetant de typer fortement les différents attributs, pour empecher des erreurs qui viendraient de routes non ou mal définies.

La sécuritée elle a été gérée via des JSON Web Token, la technologie la plus simple pour avoir un système unique entre le mobile et le web, surtout pour des applications distribuées sur des URL différentes.

Et enfin le choix de Nginx comme Reverse Proxy est très pragmatique, c'est celui qui était déjà sur notre serveur de déploiment. Il est plus léger et moins complexes que Appache, si on a juste besoin de servir des fichiers statiques et d'avoir un reverse proxy.

## Développeur (organisation du code)
L'organisation du code dans le dossier serveur/ qui contient tout le code est la suivante:

### ./
Tous les fichiers de configuration/autre du projet:
- **_types.ts**: Interface personnalisée du projet, principalement pour les routes
- **.dockerignore**: Comme un gitignore, mais pour Docker
- **.env.dist**: A copier dans un .env classique avec les varibles de connection de Google
- **.estlintrc.js**: Configuration de ESLint
- **.prettierrc.json**: Configuration de Prettier (mise en forme automatique du code)
- **docker-compose.yml et Dockerfile**: Fichier liés à la gestion du projet avec Docker
- **launchBuild.sh**: Script buildant une nouvelle image, et la mettant en ligne sur le Registry de Gitlab
- **tsconfig.json**: Configuration du compilateur Typescript

### ./cli/
Différents scripts accessible en ligne de commande, depuis package.json la plupart du temps:
- **doc/**: Script liés à la génération de documentation automatique
- **fixture_data**: Contient des images utilisés par loadDtaToBdd.js pour charger des données dans la base de donnée
- **test/**: Ancien fichier de test (remplacé depuis)
- **bdd_sync.js**: Syncronisation de la base de donnée sans supprimer les tables
- **loadDataToBdd.js**: Ajoute des challenges à la base de donnée, pour pouvoir tester depuis les Front-End

### ./models/
Toutes les entités de Sequelize ([http://sequelize.org/](http://sequelize.org/)). Le fichier **index.js** sert à charger toutes les entités et les renvoyer sous la forme d'un object. Globalement dans le projet, cet objet sera importé sous le nom de `bdd`.

### ./modules/
La grande majorité du code écrit dans ce projet se trouve ici, rangé en différentes parties.
- **index.js**: Déclare statiquement l'importation des différents modules, pour pouvoir tous les importer dans un seul objet. Globalement dans le projet il sera importé sous le nom `m`.
- **challengeValidation.js**: Algorithme de validation des challenges, via un parcours de graphs
- **utils.js**: Différentes fonctions utilitaires à différents endroits du projet

#### ./controller/
Tous le code répondant aux requêtes envoyés par le navigateur. Les fichiers portent les mêmes noms que les définition des routes, mais avec un _ctrl à la fin.

#### ./route/
La définition de toutes les routes. Chaque fichier exporte deux objets, un meta contenant un titre pour la documentation, et un tableau de Routes contenant la vrai définition. Les fichiers JS sont ceux qui seront utilisés par le serveur au lancement, mais le code s'édit dans les fichier .ts pour avoir accès à la validation du format des routes. Pour la structure des routes, voir dans le fichier `_types.ts`.  
Le fichier `index.ts` sera lui importé dans le fichier `serveur.js`, et va enregistrer toutes les routes auprès de Express.

### ./test/
Contient tous les tests Mocha. Dans le dossier assets, il y a certaines images nécéssaires pour les tests.  
**hooks.js** content les scripts pre et post tests de Mocha ainsi que le tableau contenant les variables passant d'un test à l'autre, via l'objet global.

### Dossier générés par le code
- **data**: Contient les différentes images des entités, au format webp
- **doc**: Contient la documentation générée à partir des routes, accessible à l'adresse */doc*
- **mochawesome-report**: Contient un rapport au format HTML des tests Mocha

## Déploiement
Pour déployer les applications vous aurez besoin:
- [NodeJS](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

Et en plus sur votre serveur si vous n'en avez pas, un serveur web comme [Nginx](https://www.nginx.com/)

### Développement
Pour la partie développement, le déploiment se fait de la manière suivante:
```
docker-compose up 
docker-compose exec web npm run sync
```

Cela va lancer tous les conteneurs, lancer le conteneur de serveur en mode développement, et ensuite syncroniser la base de donnée. Il est possible que cela marche moins bien sur Windows à cause d'une bibliothèque de redirection d'images qui utilise des fichiers binaires en fonction du système d'exploitation.

Pour lancer les tests, utilisez la commande
```
docker-compose exec test npm run test
```

### Production
Pour le déploiment du Back-End on a voulu faire simple. Nous utilisons le répertoir de conteneur de Gitlab sur lequel on va mettre en ligne l'image de notre serveur qu'on build en local. Ensuite pour le déploiment, on va créer un premier conteneur contenant notre base de donnée, un réseau contenant les deux, et ensuite démarrer notre conteneur.

En local il y a un fichier `./script/build.sh` que vous pouvez utiliser pour build l'image et la mettre en ligne. Avant il faudra activer le répertoire de conteneur sur votre répertoire Gitlab dans les options de celui ci. Ensuite vous connecter en local via la commande `docker login registry.app.unistra.fr`, et vos identifiants Unistra. Après vous pouvez utiliser le Script, mais pensez à modifier le nom de l'image pour avoir la bonne adresse de votre conteneur.

Pour le déploiment, vous pouvez copier sur votre serveur les script `./script/firstLaunch.sh` et `./script/restartAcrobat.sh`. Il faut dedans changer à nouveau l'adresse de l'image du serveur, mais aussi définir toutes les variables d'environnement. Voici leurs paramètres pour l'image du serveur (si il y a un ? devant, elles doivent être présente mais peuvent être une chaine vide). Pour MySQL [voir la doc officielle](https://hub.docker.com/_/mysql).

- NODE_ENV: L'environnement NodeJS
- BDD_URL: Adresse de la base de donnée
- DEBUG: Le domaine des logs de debugs [Voir la doc de Debug](https://www.npmjs.com/package/debug#windows-command-prompt-notes)
- JWT_SECRET: Une chaine aléatoire pour les JsonWebToken
- HOST: L'host de l'API
- DOC_NAME: Le nom affiché dans le documentation
- DOC_HOST: L'host de l'API (pour la documentation)
- ? GOOGLE_ID: Le Token Public de Google
- ? GOOGLE_SECRET: Le Token Secret de Google
- ? FRONT_HOST: L'host du front (Pour la connection Google)

Les variables déjà remplis dans le script peuvent rester comme ça, sinon il faut les modifier avec des bons paramètres. 

Executez dans l'ordre `firstLaunch.sh` au début, puis `restartAcrobat.sh` à chaque modifications de l'image.

Pour voir comment publier son site avec Nginx [voir ce document](../Documentation/Nginx.md)