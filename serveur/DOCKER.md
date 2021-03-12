# Déploiment du serveur
```
cd serveur
npm install
sudo docker build -t acrobat/serveur .
sudo docker run -d -e MYSQL_DATABASE=database -e MYSQL_USER=acrobat -e MYSQL_PASSWORD=acrobat -e MYSQL_ROOT_PASSWORD=acrobat -p 1419:3306 --name acrobat-bdd mysql:5.7
sudo docker run -d -p1418:1418 -e NODE_ENV=development -e BDD_URL=mysql://acrobat:acrobat@acrobat-bdd/database --name acrobat-serveur registry.app.unistra.fr/equipe-3/projet-acrobatt/serveur
sudo docker network create acrobat
sudo docker network connect acrobat acrobat-bdd
sudo docker network connect acrobat acrobat-serveur
sudo docker stop acrobat-serveur
sudo docker start acrobat-serveur
sudo docker exec acrobat-serveur npm run sync
```

# Redémarage du serveur
```
sudo docker stop acrobat-serveur
sudo docker rm acrobat-serveur
sudo docker pull registry.app.unistra.fr/equipe-3/projet-acrobatt/serveur:latest 
sudo docker run --network acrobat -d -p1418:1418 -e NODE_ENV=development -e BDD_URL=mysql://acrobat:acrobat@acrobat-bdd/database --name acrobat-serveur registry.app.unistra.fr/equipe-3/projet-acrobatt/serveur:latest
sudo docker network connect acrobat acrobat-serveur
sudo docker start acrobat-serveur
sudo docker exec acrobat-serveur npm run sync
```

# Build + Push vers l'unistra
```
sudo docker build -t registry.app.unistra.fr/equipe-3/projet-acrobatt/serveur .
sudo docker push registry.app.unistra.fr/equipe-3/projet-acrobatt/serveur
```