# Red-Tetris

L'objectif de ce projet est de développer un jeu **Tetris multijoueur en réseau** en utilisant une pile logicielle **Full Stack JavaScript**.

## Stack Requirements

### Frontend

- **Langage** : JavaScript (dernière version)
- **Framework** : React (recommandé) ou Vue (obligatoire d'en utiliser un)
- **Gestion d'État** : Redux (recommandé)
- **Communication** : Librairie cliente **socket.io**
- **Mise en Page** : **CSS Flexbox** ou **CSS Grid**
- **Rendu du Jeu** : uniquement des éléments **HTML** (ex : `<div>`) stylisés avec **CSS**
- **Routing** : Librairie de routing SPA (ex : `react-router-dom`)

---

#### Contraintes de développement

- **Programmation fonctionnelle** : la logique doit être implémentée avec des fonctions pures.
- **Interdiction d'utiliser `this`** (sauf dans des classes d'erreur).
- **Interdiction d'utiliser `jQuery`, `<canvas>`, `SVG` ou les balises `<table>`** pour la mise en page.

---

### Backend

- **Langage** : JavaScript (dernière version)
- **Environnement** : Node.js
- **Framework** : un framework web comme **Express** (souvent inclus dans le boilerplate pour servir les fichiers et gérer les sockets)
- **Communication** : Serveur **socket.io**
- **Serveur Web** : Serveur HTTP pour les fichiers statiques (`index.html`, `bundle.js`)

---

#### Structure Objet

- **Programmation orientée objet** : utilisation de **prototypes** ou de **classes**.
- **Obligation de définir des classes/prototypes pour `Player`, `Piece` et `Game`.**
