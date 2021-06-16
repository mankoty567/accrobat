docker stop acrobat-serveur
docker rm acrobat-serveur
docker pull registry.app.unistra.fr/equipe-31/projet-acrobatt/serveur:latest 
docker run -d -v /home/bigaston/acrobat-serveur:/app/data -e FRONT_HOST= -e GOOGLE_ID= -e GOOGLE_SECRET= -e DOC_HOST= -e DOC_NAME=Acrobatt -e HOST= -p1418:1418 -e JWT_SECRET= -e NODE_ENV=production -e BDD_URL=mysql://acrobat:acrobat@acrobat-bdd/database --name acrobat-serveur registry.app.unistra.fr/equipe-31/projet-acrobatt/serveur
docker network connect acrobat acrobat-serveur
docker start acrobat-serveur
docker exec acrobat-serveur npm run sync
docker exec acrobat-serveur npm run doc