# Déploiment du serveur
```
cd serveur
npm install
sudo docker build -t acrobat/serveur .
sudo docker run -d -e MYSQL_DATABASE=database -e MYSQL_USER=acrobat -e MYSQL_PASSWORD=acrobat -e MYSQL_ROOT_PASSWORD=acrobat -p 1419:3306 --name acrobat-bdd mysql:5.7
sudo docker run -d -p1418:1418 -e NODE_ENV=development -e BDD_URL=mysql://acrobat:acrobat@acrobat-bdd/database --name acrobat-serveur acrobat/serveur
sudo docker network create acrobat
sudo docker network connect acrobat acrobat-bdd
sudo docker network connect acrobat acrobat-serveur
sudo docker stop acrobat-serveur
sudo docker start acrobat-serveur
sudo docker exec acrobat-serveur npm run sync
```