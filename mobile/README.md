# Mobile

Au cours de l'année, nous avons étudié le développement d'applications mobiles par Android Studio. Notre choix de développement fut alors évident afin d'éviter de se jeter dans du développement pouvant nous faire perdre du temps suite à un manque de connaissance. Par ailleurs, nos connaissances en Java sont bien meilleurs que dans d'autres langages de programmation mobile. Nous n'avons donc pas utilisé le Kotlin sur Android Studio. 

De plus java est bien plus performant qu'une application développée en react native ce qui dans notre cas permet d'economiser de l'energie.

## Architecture


Pour ce qui est des bibliothèques nous nous sommes tourner vers Volley qui simplifie le développement des communications HTTP entre le mobile et l'API,
le reste a été fais à la main.


## Développeur (organisation du code)

Le code est organisé en suivant l'architecture MVC (Modèle Vue Controller), les controllers réseaux et les controllers IHM sont dans des fichiers distincs (respectivement ./Network  et ./Controller)
Le modèle dans ./Model et les vues dans ./View
Les ressources 
- graphiques dans App/drawables
- d'interfacage dans App/layout, App/menu et App/navigation
- contenant les constantes dans App/values


Nous avons aussi fais le choix de mettre en place une base de donées locale afin de pouvoir jouer hors ligne, l'interface
permettant de communiquer avec est la classe DataBase contenant toute les methodes statiques utiles à la sauvegarde.

Afin de gérer au mieux les pertes de connexion un gestionnaire du réseaux ./Network/ConnectionManager restorera ce qui n'a pas pu être envoyé.
Pour créer vos requêtes nous avons créer des class requête automatisant la communication avec notre api, elles se trouvent dans 
./Network/APIRequestGET et ./Network/APIRequestPOST.

Il est quasiment indispensable d'utiliser android studio qui est le mieux pour le développement android.


## Déploiement

Pour le déploiement rendez-vous dans android studio dans l'onglet Build -> Generate signed bundle or APK 
puis cochez APK -> suivant, créez ensuite une clef puis suivant puis selectionnez 
- release 
- V1 (Jar signature)
- V2 (Jar signature)
et enfin finish.

Patientez un petit peu puis dans la popup qui apparaît en bas à droit cliquez sur 'locate'.
Rendez-vous dans le répertoire release et votre APK se trouvera là.
Téléversez votre APK dans votre appareil android et ça devrais marcher.

Pour plus d'informations ou si vous rencontrez des problèmes rendez-vous ici : 
https://developer.android.com/studio/run
Si vous ne souhaitez pas build le projet avec android studio je vous invite à suivre ce lien:
https://developer.android.com/studio/build/building-cmdline

