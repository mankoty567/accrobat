# Documentation de Déploiment
Pour déployer les applications vous aurez besoin:
- [NodeJS](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

Et en plus sur votre serveur si vous n'en avez pas, un serveur web comme [Nginx](https://www.nginx.com/)

Si vous n'avez pas configuré de Nginx, voici ci dessous deux exemple de configurations de sites, à mettre dans `/etc/nginx/sites-enabled`.
```
server {
  server_name VOTRE_HOST_DU_BACK;

  location / {
    proxy_pass http://127.0.0.1:VOTRE_PORT;
  } 
  proxy_read_timeout 300;

  client_max_body_size 10m;
}
```

```
server {
  server_name VOTRE_HOST_DU_FRONT;

  location / {
    root LE_CHEMIN_VERS_BUILD;
    try_files $uri /index.html;
  }
}
```

Sur votre configuration DNS, mettez en place deux redirection vers votre IP, une pour le front et une pour le back.

## Back-End
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

## Front-End Web
Pour déployer le frond-end, clonez le répertoire git sur votre serveur, ensuite à l'interieur du répertoire executez les commandes suivantes:
```
npm install
npm run build
```

Votre site apparaitra dans le dossier `build`. Vous pourrez alors le servir statiquement.

## Frond-End Mobile