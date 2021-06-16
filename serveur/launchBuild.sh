echo "> Build de l'image"
sudo docker build -t registry.app.unistra.fr/equipe-31/projet-acrobatt/serveur .
echo "> Envoit de l'image sur le registry GitLab Unistra"
sudo docker push registry.app.unistra.fr/equipe-31/projet-acrobatt/serveur
echo "> Image build et envoyée!"