# framework1
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

# Modules :

Modules

Il y'a une notion de module avec les caractéristiques décrites dans le sujet

- nom/description [+0.5pt] DONE
- restriction du nombre de place [+0.5pt] DONE
- date de début et fin d'inscription [+0.5pt] DONE
- date de début et fin du module [+0.5pt] DONE
- valeur du module en crédits [+1pt] DONE
- création automatique de la catégorie dans le forum à la création du module [+1pt] (RIDA) DONE
- crédits attribués à la fin [+0.5pt] DONE
- notion de grade [+0.5pt]

Arrondissez à la graduation supérieure au besoin.


# Activites :

Activités

Il y'a des activités avec les caractéristiques décrites dans le sujet

- nom/description/sujet(.pdf) [+0.5pt] DONE
- nombre de place [+0.5pt] DONE
- date de début et fin d'inscription [+0.5pt] DONE
- date de début et fin de l'activité [+0.5pt] DONE
- inscription par groupe de taille variable [+1pt] DONE
- choix du nombre de pairs (peer correcting) pour les projets [+0.5pt] DONE
- génération des groupes ou inscription manuelle [+0.5pt] DONE
- une activité appartient forcément à un module [+0.5pt] DONE
- un type (projet, exam ou TD) [+0.5pt] DONE

Arrondissez à la graduation supérieure au besoin.


# Baremes :

Barèmes

Il y a des barèmes avec les caractéristiques décrites dans le sujet:

- association entre un barème et une activité DONE
- une note est attribuée à la fin du barème en fonction du contenu du barème DONE


# Admin :

Admin

Les 3 entités Modules / Activités / Barèmes sont administrables via une zone admin. DONE


# Notes / Correction :

- Génération de pairs pour les activité de type 'projet' lorsque la date de fin de projet est atteinte [+1pt] DONE
- Un utilisateur peut noter un projet d'un de ses pairs via un barème [+2pt] DONE
- À la fin d'un exam on upload un fichier .csv pour attribuer une note pour chaque inscrits. [+2pt]


# Autologin :

L'autologin est fonctionnel pour les utilisateurs (à éviter pour les comptes admin qui sont plus sensibles)


# E-learning :

- À chaque création de module et de projet, les catégories sont créées dans une zone E-learning [+2pt] DONE
- On peut ajouter un cours au module, sous la forme de .pdf ou de vidéo [+3pts] DONE

