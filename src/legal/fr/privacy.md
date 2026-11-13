# Politique de confidentialité

Ce que Modstoke collecte, pourquoi, combien de temps nous le conservons et ce que vous pouvez nous demander d'en faire.

Effective 12 November 2026

## Qui nous sommes et ce que couvre cette politique {#scope}

Modstoke est exploité par OpenACAI Inc (« OpenACAI », « nous »), une association à but non lucratif 501(c)(3) basée à Farmington, Missouri. Cette politique couvre modstoke.com, votre compte Modstoke et le panneau d'hébergement sur panel.modstoke.com, les serveurs de jeu que nous hébergeons, nos mods et outils, et les dons effectués via le site.

Nos applications Discord, Sentinel et Radio, sont couvertes par la [page de confidentialité des applications Discord](/apps/privacy/). Les autres services d'OpenACAI ont [leur propre politique](https://openacai.com/privacy-policy/).

La version courte :

- Nous collectons ce dont nous avons besoin pour faire fonctionner les comptes et les serveurs et pour les protéger.
- Nous ne vendons pas de données personnelles, n'affichons pas de publicité et n'utilisons pas vos données pour entraîner des modèles d'IA.
- Vous pouvez nous demander une copie de vos informations, ou leur correction ou leur suppression.

## Visite du site {#site}

Vous pouvez lire modstoke.com et télécharger nos mods et outils sans compte. Le site ne dépose aucun cookie publicitaire ni de suivi.

Comme tout site web, le nôtre reçoit votre adresse IP, des informations sur votre navigateur et les pages que vous demandez. Cloudflare se place devant nos sites pour les diffuser et bloquer les attaques, et voit donc aussi ce trafic ; il nous fournit des totaux de visites qui ne vous identifient pas. Nous conservons des journaux de serveur pour faire fonctionner et sécuriser le service.

## Votre compte {#account}

Lorsque vous créez un compte ou vous connectez, nous conservons :

- votre nom d'utilisateur et votre adresse e-mail, ainsi qu'une empreinte (hash) de votre mot de passe si vous en définissez un ;
- **Discord**, si vous vous connectez avec : votre identifiant Discord et l'e-mail de votre compte Discord ;
- **Steam**, si vous le liez : votre SteamID, et si ce compte possède Sons of the Forest, ce que nous vérifions auprès de Steam lorsque vous le liez puis de temps en temps par la suite. Les droits de propriétaire et d'équipe sur un serveur dépendent du SteamID ;
- **Nexus Mods**, si vous le liez : votre nom Nexus, votre avatar et si vous avez Premium, ainsi que les jetons d'accès que Nexus nous remet, que nous stockons chiffrés ;
- ce que vous nous dites lorsque vous demandez un serveur ou de l'aide ;
- vos réglages pour le bureau, comme le thème et la disposition, afin qu'ils vous suivent d'un appareil à l'autre.

### Journaux de connexion {#records}

Pour la sécurité, et pour pouvoir répondre à une demande légale, nous enregistrons chaque inscription, connexion, connexion échouée et déconnexion sur le panneau et par SFTP, avec :

- l'heure et la méthode utilisée ;
- votre adresse IP, le nom de réseau auquel elle correspond et le pays que Cloudflare indique pour elle ;
- votre navigateur, votre système d'exploitation et un identifiant aléatoire que nous conservons dans un cookie pour distinguer un navigateur d'un autre.

Nous conservons ces enregistrements pendant 365 jours. Seuls nos administrateurs seniors peuvent les ouvrir, et chaque fois que l'un d'eux le fait, cela est également consigné. Si la loi nous oblige à préserver les enregistrements d'un compte, nous les conservons jusqu'à la fin de cette obligation.

## Serveurs hébergés {#servers}

Pour un serveur que vous louez ou utilisez en essai, nous conservons :

- tout ce qui se trouve sur le serveur : les fichiers du jeu, votre monde, les mods, les réglages et tout ce que vous téléversez ;
- les sauvegardes, aussi longtemps que votre formule le prévoit, et les fichiers que vous supprimez, qui restent dans la corbeille pendant 7 jours ;
- l'état du serveur : utilisation du processeur, de la mémoire, du disque et du réseau, nombre de joueurs et mods installés, échantillonnés toutes les 10 minutes et conservés 30 jours ;
- le journal de la console, les événements et les rapports de plantage, afin que vous et nous puissions voir ce qui a mal tourné ;
- les résultats d'analyse antivirus des téléversements et des dossiers de mods : le chemin, la taille, l'empreinte et le verdict du fichier ;
- qui, dans votre équipe, a fait quoi, dans le journal d'activité du serveur, conservé 365 jours ;
- qui a actuellement le bureau du serveur ouvert, affiché au reste de l'équipe du serveur.

Notre équipe peut ouvrir les fichiers, la console et les journaux d'un serveur pour faire fonctionner le service, pour aider lorsque vous le demandez, pour enquêter sur un abus ou un problème de sécurité, et lorsque la loi l'exige.

### Les personnes qui jouent sur un serveur hébergé {#players}

Un serveur que nous hébergeons enregistre les personnes qui le rejoignent. Le propriétaire du serveur décide qui y joue et qui fait partie de son équipe, et nous conservons ces informations pour lui et pour protéger le service :

- le nom Steam et le SteamID, ainsi que le moment où chaque joueur est arrivé et reparti ;
- le chat, conservé 30 jours ;
- l'endroit où se trouvent les joueurs dans le monde pendant qu'ils jouent. Les positions n'existent qu'en direct et disparaissent en quelques minutes ;
- la modération : mises en sourdine, emprisonnements, expulsions et bannissements, la liste blanche, et les notes que l'équipe écrit sur un joueur ;
- si un joueur utilise le mod Modstoke Client, la santé et l'inventaire que son jeu communique.

Seuls le propriétaire et l'équipe de ce serveur, ainsi que notre propre équipe, peuvent voir ces informations. Une fiche de serveur publique affiche le nom du serveur et le nombre de joueurs, jamais lesquels.

L'enregistrement d'une visite est conservé un an après sa fin. Lorsqu'un serveur est supprimé, tout ce qu'il contenait sur ses joueurs est supprimé avec lui.

Si vous jouez sur un serveur et voulez savoir ce qu'il détient sur vous, ou souhaitez le faire supprimer plus tôt, demandez au propriétaire du serveur, ou demandez-nous.

### Ember {#ember}

Ember, l'assistant du bureau, répond à l'aide d'un modèle qui tourne sur notre propre machine. Vos questions et les informations sur votre serveur qui les accompagnent ne sont pas envoyées à une entreprise d'IA extérieure et ne servent pas à entraîner des modèles.

## Mods et outils {#tools}

Le Modstoke Manager et le Loader récupèrent des informations de version, des catalogues et des téléchargements sur modstoke.com, et sur Nexus Mods ou sotf-mods.com lorsque vous utilisez ces boutiques. Ces requêtes transportent votre adresse IP, comme tout téléchargement. Si vous vous connectez à Nexus Mods dans le Manager, cela se passe entre vous et Nexus.

## Dons et paiements {#payments}

Les paiements passent par PayPal. Nous ne voyons ni ne stockons jamais vos coordonnées de carte ou bancaires. Pour un don, nous conservons l'identifiant de commande ou d'abonnement PayPal, le montant, son statut et l'identifiant PayPal du payeur. À l'ouverture de l'hébergement payant, nous conserverons les mêmes éléments pour une formule, ainsi que la formule et le serveur qu'elle paie.

## Cookies et ce qui est conservé dans votre navigateur {#cookies}

Le panneau n'utilise que ce dont il a besoin pour fonctionner :

- un cookie de session qui vous maintient connecté, et un jeton qui protège les formulaires ;
- `modstoke_device`, un identifiant aléatoire conservé deux ans, utilisé uniquement dans les journaux de connexion ci-dessus ;
- les réglages et la disposition des fenêtres de votre bureau, conservés dans le stockage de votre navigateur ;
- une copie hors ligne du bureau d'un serveur, si vous l'installez comme application. La déconnexion l'efface ;
- un abonnement aux notifications, si vous activez les alertes. Les alertes sont acheminées par le service push propre à votre navigateur, exploité par Google, Mozilla, Apple ou Microsoft, et elles arrivent chiffrées.

Il n'y a aucun cookie publicitaire.

## Comment nous utilisons les informations {#use}

Nous utilisons ce que nous collectons pour :

- fournir les comptes, les serveurs et les téléchargements, et les réparer lorsqu'ils tombent en panne ;
- protéger les personnes et les serveurs : empêcher les abus, la triche et les intrusions, et faire respecter nos [conditions](/terms/) ;
- vous informer au sujet de votre serveur, par exemple la fin d'un essai ou un problème ;
- encaisser les paiements et les dons, et tenir les registres que la loi demande à une association à but non lucratif ;
- comprendre, en totaux, comment le service est utilisé afin de l'améliorer.

Lorsque la loi demande une base juridique, les nôtres sont : l'exécution de notre accord avec vous, notre intérêt légitime à faire fonctionner un service sûr, votre consentement lorsque nous le demandons, et nos obligations légales.

## Avec qui nous les partageons {#sharing}

Nous ne vendons pas de données personnelles. Nous les partageons uniquement :

- avec les services qui nous aident à faire fonctionner Modstoke, à cette fin : Cloudflare (diffusion, protection et totaux de visites), InterServer (le centre de données du New Jersey où se trouve notre machine), PayPal (paiements), Discord et Steam (connexion et liaison), et Nexus Mods et sotf-mods.com (lorsque vous utilisez leurs boutiques) ;
- avec le propriétaire et l'équipe d'un serveur, pour les joueurs et l'activité sur ce serveur ;
- lorsque la loi l'exige, ou lorsque c'est nécessaire pour protéger la sécurité de quelqu'un ou nos droits ;
- avec une organisation qui reprend Modstoke, dans le cadre de cette même politique.

## Combien de temps nous les conservons {#retention}

| Quoi | Combien de temps |
|---|---|
| Informations du compte | Jusqu'à ce que vous nous demandiez de supprimer le compte |
| Journaux de connexion | 365 jours |
| Échantillons d'utilisation du serveur | 30 jours |
| Chat sur un serveur hébergé | 30 jours |
| Positions des joueurs | Quelques minutes |
| Sessions des joueurs sur un serveur hébergé | Un an après la fin de la session |
| Dossiers de modération, liste blanche et notes de l'équipe | Jusqu'à ce que l'équipe du serveur les supprime |
| Tout ce qu'un serveur hébergé détient sur ses joueurs | Supprimé lorsque le serveur est supprimé |
| Le journal d'activité d'un serveur | 365 jours |
| Sauvegardes | 3, 7 ou 30 jours, selon la formule |
| Corbeille d'un serveur | 7 jours |
| Les fichiers d'un serveur après sa fin | 14 jours, puis supprimés |
| Le monde d'un essai après la suppression du serveur | 30 jours |
| Enregistrements de dons et de paiements | Aussi longtemps que l'exigent les règles fiscales et comptables |

Tout ce qui fait l'objet d'une conservation pour motif légal est conservé jusqu'à la fin de celle-ci.

## Sécurité {#security}

Tout transite par HTTPS. Le serveur de chaque client fonctionne dans son propre espace, séparé des autres et du panneau. Les mots de passe sont stockés sous forme hachée et les jetons des comptes liés chiffrés. L'accès aux journaux de connexion est limité et consigné. Aucun système n'est parfaitement sûr, et si une violation touche vos informations, nous vous le dirons.

## Vos choix et vos droits {#rights}

Vous pouvez faire les choses suivantes vous-même lorsque le panneau le permet, ou nous le demander :

- obtenir une copie des informations que nous détenons sur vous ;
- les corriger, ou supprimer votre compte et ce qui l'accompagne ;
- dissocier Discord, Steam ou Nexus Mods ;
- télécharger votre monde depuis le panneau à tout moment ;
- désactiver les notifications, ou effacer ce qui est stocké dans votre navigateur.

Écrivez à legal@openacai.com ou demandez sur [notre Discord](https://discord.gg/T2Tjh5ECS). Nous pouvons avoir besoin de confirmer que c'est bien vous, et nous pouvons conserver ce que la loi exige ou ce dont nous avons besoin pour traiter un abus. Selon l'endroit où vous vivez, la loi peut vous accorder d'autres droits, y compris le droit d'introduire une réclamation auprès de votre autorité de protection des données. Nous les respecterons.

## Où elles sont conservées {#where}

Notre machine se trouve dans le New Jersey, aux États-Unis, et vos informations y sont traitées. Si vous utilisez Modstoke depuis un autre pays, vos informations sont transférées aux États-Unis.

## Enfants {#children}

Modstoke n'est pas destiné aux enfants de moins de 13 ans, et nous ne collectons pas sciemment leurs informations. Si vous pensez qu'un enfant de moins de 13 ans a un compte, dites-le-nous et nous le supprimerons. Les personnes de 13 à 17 ans ont besoin de l'autorisation d'un parent ou d'un tuteur.

## Ce que nous construisons encore {#planned}

Certaines choses que nous avons annoncées ne sont pas encore en ligne. Lorsqu'elles arriveront, voici comment elles fonctionneront, et nous mettrons cette page à jour avant chaque lancement :

- **Formules payantes.** PayPal encaissera le paiement. Nous conserverons les enregistrements décrits sous Dons et paiements.
- **E-mail.** Nous n'envoyons pas d'e-mails aujourd'hui. Lorsque nous commencerons, ce sera pour des sujets concernant votre compte et votre serveur, pas du marketing.
- **Sauvegardes vers votre propre stockage cloud.** Si vous connectez Google Drive ou OneDrive, nous stockerons l'accès que vous accordez et y enverrons vos sauvegardes, et rien d'autre.
- **Salons Discord pour un serveur.** Si vous les activez, les annonces de votre serveur, et le chat si vous le relayez, seront publiés sur Discord.
- **Une boutique de mods, de thèmes et d'applications.** L'installation d'un élément indiquera à sa source qu'un téléchargement a eu lieu, comme tout téléchargement.
- **Voix et radio sur les formules plus grandes.** Nous dirons exactement ce qui est enregistré et ce qui ne l'est pas avant leur ouverture.

## Modifications {#changes}

Lorsque nous modifions cette politique, nous publions ici la nouvelle version avec sa date. Si une modification est importante, nous l'annonçons dans notre Discord ou sur le panneau avant son entrée en vigueur.

## Contact {#contact}

Écrivez à legal@openacai.com, ou demandez sur [notre Discord](https://discord.gg/T2Tjh5ECS). OpenACAI Inc, Farmington, Missouri, United States.
