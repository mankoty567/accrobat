docker run -d -e MYSQL_DATABASE=database -e MYSQL_USER=acrobat -e MYSQL_PASSWORD=acrobat -e MYSQL_ROOT_PASSWORD=acrobat -p 1419:3306 --name acrobat-bdd mysql:5.7
docker network create acrobat
docker network connect acrobat acrobat-bdd