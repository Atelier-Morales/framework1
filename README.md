# framework project (RIP)
Big Web Project for 42

Installation:

- installer node.js (soit avec NVM soit avec Managed software centre)
- installer redis, mongodb et nginx avec brew
- changer la config de nginx avec la config incluse dans le dossier /nginx
- lancer les commandes "mongod --dbpath /goinfre/nom_du_dossier_bdd" (il faut juste faire un mkdir dans goinfre pour creer la bdd, sinon on peut y mettre un copie d'une base existante), nginx et redis-server
- faire npm install bcrypt dans le dossier de rendu.
- aller dans le dossier /backend et lancer node routes.js.
- localhost:3000
- Pour le css, c'est du SASS, donc il faut modifier uniquement les fichier .scss et compiler le tout avec codekit ou lancer la commande grunt à la racine du dépot.

Enjoy
