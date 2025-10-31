# red-tetris

L'objectif de ce projet est de développer un jeu Tetris multijoueur en réseau en utilisant une pile logicielle exclusivement Full Stack JavaScript.

## Stack Requirements

### Frontend

- **Langage** : JavaScript (dernière version)
- **Framework** : React (recommandé) ou Vue (obligatoire d'en utiliser un)
- **Gestion d'État** : Redux (recommandé)
- **Communication** : Librairie cliente socket.io
- **Mise en Page** : CSS Flexbox ou CSS Grid
- **Rendu du Jeu** : Uniquement des éléments HTML (ex: <div>) stylisés avec CSS
- **Routing** : Librairie de routing SPA (ex: react-router-dom)

---

- **Programmation Fonctionnelle** : La logique doit être dans des fonctions pures.
- **Interdiction d'utiliser this** (sauf pour des classes d'erreur).
- **Interdiction d'utiliser jQuery, <canvas>, SVG ou les balises <TABLE>** pour la mise en page.

### Backend

- **Langage** : JavaScript (dernière version)
- **Environnement** : Node.js
- **Framework** : Un framework web comme Express (souvent inclus dans le boilerplate pour servir les fichiers et gérer les sockets)
- **Communication** : Serveur socket.io
- **Serveur Web** : Serveur HTTP pour les fichiers statiques (index.html, bundle.js)

---

- **Programmation Orientée Objet** : Utilisation des prototypes ou des classes.
- **Obligation de définir des classes/prototypes pour Player, Piece, et Game**.
