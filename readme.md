## Usage

Quand on arrive sur le projet, d’abord il faut creer son propre fichier d’environnement !
Pour ça il faut copier le example.env et le transformer en env.
Il faut faire ça que la premiere fois, apres votre .env sera gardé, et comme il est dans le gitignore, il ne sera jamais push en ligne


cp example.env .env

Puis modifier le .env


docker compose up --build

Et ça lance tout les dockers.

### Stopper tous les conteners

Si on veut être sur que tout est stopé, on peut executer ce groupe de commande :


docker stop $(docker ps -aq); docker rm $(docker ps -aq); docker volume rm $(docker volume ls); docker system prune;docker volume prune;


### La visite guidée

- **Le front** : Commençons par aller voir le front en react.
Il faut aller sur http://localhost:3000

Attention, pas https !
- **Le back** : Pour voir si tout fonctionne, allons voir ces 2 urls
    - http://localhost:4000 → Censé ecrire un texte de joie ou de bienvenue
    - http://localhost:4000/sam-test → Fait une requete en bdd, la réponse est sous forme de json
    

    💡 Hésitez pas a prendre en main postman, il permet de tester les requestes de manière simple.
    Pratiquement indispensable si on travaille sur nest

    
- **Prisma** : Pour voir et surtout ajouter des éléments dans la bdd !
Pour cela, allez sur http://localhost:5555


💡 Attention, parfois au moment d’enregistrer ou de modifier un volume, il y aura des problemes de permissions.
Un bon ptit sudo nous regle le soucis en général ^^