# Documentation pour Développeur

## Back-End
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

## Front-End Web

## Frond-End Mobile