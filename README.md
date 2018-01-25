## BankinChallenge (rendu le 25 Janvier 2017)

Anaël CHARDAN aka Nanou 🤪, élève ingénieur à l'école des Mines de Nantes en alternance chez Akeneo.

### Technologies choisies 🐒:
- NodeJS (avec transpileur Typescript), le choix de Typescript s'est fait pour avoir une meilleure gestion des types. En effet, n'ayant jamais fait de NodeJS auparavant, avoir un système de type pour m'aider à commencer m'a été très utile.
- Chrome Headless avec puppeteer

### Lancement 🚀

```
yarn install //pour installer les dépendances
yarn tsc //pour transpiler en nodejs
yarn scrap //pour scrapper
```

Les transactions récupérées sont stockeés dans un fichier `results/transactions.json`

### Architecture 🏢

L'architecture choisie est celle des Ports/Adapters et plus précisément l'OnionArchitecture qui
permet de bien dissocier le métier, les entrées sorties, très utilisées dans le Domain Driven Design.

Dossiers:
* `Application`: c'est notre use case, c'est à dire, récupérer toutes les transactions! Il est abstrait de là où nous allons chercher ces fameuses transactions. Le point d'entrée est `TransactionsFetcher.js` qui grâce à une queue permet de récupérer des transactions en parallèle, par batch de 30 pages ici. 
* `Domain`: ce sont nos objets métiers!, les Transactions par exemple.
* `Infrasctructure`: C'est nos portes d'entrées et de sorties, autrement appelés les adapters.

### Comment ça se passe là dedans? ⁉️

Pour scrapper une page, plusieurs scénarios peuvent arrivés (#coderAvecLesPieds)

- Une _magnifique_ alerte pop, on clique dessus, et on clique sur reload
- Ensuite deux possibilités:
  - Le tableau est chargé dans une iframe
  - Le tableau est chargé dans la page directement (ce qui peut aussi arrivé sans la popup)

Le résultat est obtenu en environ 23 secondes sachant que des choix ont été fait:
- L'écriture dans un fichier (avec trie) est coûteux ~2secondes
- On ne sait potentiellement pas combien de page il faut scrapper (même si on pourrais assumer le start=5000) et ça c'est coûteux aussi parce que la queue enfile les processus les uns après les autres et donc va surement empiler des pages à ne pas scrapper (problème de l'asynchrone, mais l'on pourrait très bien imaginer annuler  les tâches inutiles quand on sait que la dernière page a été atteinte) ~8secondes

## Le mot de la fin 😎

Le challenge était cool, ça m'a permis de jouer avec NodeJS (ce que je n'avais jamais eu l'occasion) et jouer avec Puppeeter.

Une question, on pourra avoir votre solution? 😁

Bisous 😙