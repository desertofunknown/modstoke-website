# Política de privacidad

Qué recoge Modstoke, por qué, cuánto tiempo lo conservamos y qué puede pedirnos que hagamos con ello.

Effective 12 November 2026

## Quiénes somos y qué cubre esto {#scope}

Modstoke está gestionado por OpenACAI Inc («OpenACAI», «nosotros»), una organización sin ánimo de lucro 501(c)(3) con sede en Farmington, Misuri. Esta política cubre modstoke.com, su cuenta de Modstoke y el panel de alojamiento en panel.modstoke.com, los servidores de juego que alojamos, nuestros mods y herramientas, y las donaciones realizadas a través del sitio.

Nuestras aplicaciones de Discord, Sentinel y Radio, están cubiertas por la [página de privacidad de las aplicaciones de Discord](/apps/privacy/). Los demás servicios de OpenACAI tienen [su propia política](https://openacai.com/privacy-policy/).

La versión corta:

- Recogemos lo que necesitamos para gestionar cuentas y servidores y mantenerlos seguros.
- No vendemos información personal, no mostramos anuncios ni usamos sus datos para entrenar modelos de IA.
- Puede pedirnos una copia de su información, o que la corrijamos o eliminemos.

## Visita al sitio {#site}

Puede leer modstoke.com y descargar nuestros mods y herramientas sin una cuenta. El sitio no instala cookies publicitarias ni de seguimiento.

Como cualquier sitio web, el nuestro recibe su dirección IP, datos del navegador y las páginas que solicita. Cloudflare se sitúa delante de nuestros sitios para entregarlos y bloquear ataques, por lo que también ve ese tráfico, y nos facilita recuentos de visitas en total que no le identifican. Conservamos registros del servidor para gestionar y proteger el servicio.

## Su cuenta {#account}

Cuando crea una cuenta o inicia sesión, conservamos:

- su nombre de usuario y dirección de correo electrónico, y un hash de su contraseña si establece una;
- **Discord**, si inicia sesión con él: su ID de Discord y el correo electrónico de su cuenta de Discord;
- **Steam**, si lo vincula: su SteamID, y si esa cuenta posee Sons of the Forest, lo que comprobamos con Steam cuando lo vincula y de vez en cuando después. Los derechos de propietario y de personal en un servidor dependen del SteamID;
- **Nexus Mods**, si lo vincula: su nombre en Nexus, su avatar y si tiene Premium, además de los tokens de acceso que Nexus nos da, que almacenamos cifrados;
- lo que nos cuenta cuando solicita un servidor o pide ayuda;
- sus ajustes del escritorio, como el tema y la disposición, para que le acompañen entre dispositivos.

### Registros de inicio de sesión {#records}

Por seguridad, y para poder responder a una solicitud legal, registramos cada alta, inicio de sesión, inicio de sesión fallido y cierre de sesión en el panel y por SFTP, con:

- la hora y el método utilizado;
- su dirección IP, el nombre de red al que se resuelve y el país que Cloudflare indica para ella;
- su navegador, su sistema operativo y un ID aleatorio que guardamos en una cookie para distinguir un navegador de otro.

Conservamos estos registros durante 365 días. Solo nuestros administradores sénior pueden abrirlos, y cada vez que uno lo hace, eso también queda registrado. Si la ley nos obliga a preservar los registros de una cuenta, los conservamos hasta que termine esa obligación.

## Servidores alojados {#servers}

Para un servidor que usted alquila o utiliza en prueba, conservamos:

- todo lo que hay en el servidor: los archivos del juego, su mundo, mods, ajustes y lo que suba;
- copias de seguridad, durante el tiempo que indique su plan, y los archivos que elimine, que permanecen en la papelera durante 7 días;
- cómo va el servidor: uso de CPU, memoria, disco y red, número de jugadores y mods instalados, muestreados cada 10 minutos y conservados durante 30 días;
- el registro de la consola, los eventos y los informes de fallos, para que usted y nosotros podamos ver qué salió mal;
- los resultados del análisis de virus de las subidas y las carpetas de mods: la ruta, el tamaño, la huella y el veredicto del archivo;
- quién de su personal hizo qué, en el registro de actividad del servidor, conservado durante 365 días;
- quién tiene abierto ahora el escritorio del servidor, mostrado al resto del personal del servidor.

Nuestro personal puede abrir los archivos, la consola y los registros de un servidor para gestionar el servicio, para ayudar cuando usted lo pide, para investigar un abuso o un problema de seguridad, y cuando la ley lo exige.

### Personas que juegan en un servidor alojado {#players}

Un servidor que alojamos registra a las personas que entran en él. El propietario del servidor decide quién juega allí y quién es su personal, y conservamos esto para él y para mantener el servicio seguro:

- nombre de Steam y SteamID, y cuándo entró y salió cada jugador;
- chat, conservado durante 30 días;
- dónde están los jugadores en el mundo mientras juegan. Las posiciones solo existen en directo y desaparecen en unos minutos;
- moderación: silencios, encarcelamientos, expulsiones y vetos, la lista blanca y las notas que el personal escribe sobre un jugador;
- si un jugador usa el mod Modstoke Client, la salud y el inventario que informa su juego.

Solo el propietario y el personal de ese servidor, y nuestro propio personal, pueden verlo. Un listado público de servidores muestra el nombre del servidor y cuántos están jugando, nunca quiénes.

El registro de una visita se conserva durante un año después de que terminara. Cuando se elimina un servidor, todo lo que contenía sobre sus jugadores se elimina con él.

Si juega en un servidor y quiere saber qué guarda sobre usted, o quiere que se elimine antes, pregunte al propietario del servidor, o pregúntenos a nosotros.

### Ember {#ember}

Ember, el ayudante del escritorio, responde usando un modelo que se ejecuta en nuestra propia máquina. Sus preguntas y los datos sobre su servidor que las acompañan no se envían a una empresa de IA externa y no se usan para entrenar modelos.

## Mods y herramientas {#tools}

El Modstoke Manager y el Loader obtienen información de versiones, catálogos y descargas de modstoke.com, y de Nexus Mods o sotf-mods.com cuando usa esas tiendas. Esas solicitudes llevan su dirección IP, como cualquier descarga. Si inicia sesión en Nexus Mods en el Manager, eso es entre usted y Nexus.

## Donaciones y pagos {#payments}

Los pagos se realizan a través de PayPal. Nunca vemos ni almacenamos los datos de su tarjeta o de su banco. Para una donación conservamos el ID de pedido o de suscripción de PayPal, el importe, su estado y el ID de PayPal del pagador. Cuando se abra el alojamiento de pago, conservaremos lo mismo para un plan, junto con qué plan y qué servidor paga.

## Cookies y lo que se guarda en su navegador {#cookies}

El panel usa solo lo que necesita para funcionar:

- una cookie de sesión que le mantiene conectado, y un token que protege los formularios;
- `modstoke_device`, un ID aleatorio guardado durante dos años, usado únicamente en los registros de inicio de sesión mencionados arriba;
- los ajustes y la disposición de ventanas de su escritorio, guardados en el almacenamiento de su navegador;
- una copia sin conexión del escritorio de un servidor, si lo instala como aplicación. Al cerrar sesión se borra;
- una suscripción a notificaciones, si activa las alertas. Las alertas se entregan a través del propio servicio push de su navegador, gestionado por Google, Mozilla, Apple o Microsoft, y llegan cifradas.

No hay cookies publicitarias.

## Cómo usamos la información {#use}

Usamos lo que recogemos para:

- proporcionar cuentas, servidores y descargas, y repararlos cuando fallan;
- mantener seguras a las personas y los servidores: evitar abusos, trampas e intrusiones, y hacer cumplir nuestros [términos](/terms/);
- informarle sobre su servidor, por ejemplo cuando termina una prueba o hay un problema;
- cobrar pagos y donaciones, y conservar los registros que la ley exige a una organización sin ánimo de lucro;
- entender, en totales, cómo se usa el servicio para poder mejorarlo.

Cuando la ley pide una base jurídica, las nuestras son: la ejecución de nuestro acuerdo con usted, nuestro interés legítimo en gestionar un servicio seguro, su consentimiento cuando lo pedimos, y nuestras obligaciones legales.

## Con quién lo compartimos {#sharing}

No vendemos información personal. La compartimos únicamente:

- con los servicios que nos ayudan a gestionar Modstoke, para ese fin: Cloudflare (entrega, protección y recuentos de visitas), InterServer (el centro de datos de Nueva Jersey donde está nuestra máquina), PayPal (pagos), Discord y Steam (inicio de sesión y vinculación), y Nexus Mods y sotf-mods.com (cuando usa sus tiendas);
- con el propietario y el personal de un servidor, respecto a los jugadores y la actividad de ese servidor;
- cuando la ley lo exige, o cuando es necesario para proteger la seguridad de alguien o nuestros derechos;
- con una organización que se haga cargo de Modstoke, bajo esta misma política.

## Cuánto tiempo lo conservamos {#retention}

| Qué | Cuánto tiempo |
|---|---|
| Datos de la cuenta | Hasta que nos pida eliminar la cuenta |
| Registros de inicio de sesión | 365 días |
| Muestras de uso del servidor | 30 días |
| Chat en un servidor alojado | 30 días |
| Posiciones de los jugadores | Minutos |
| Sesiones de jugadores en un servidor alojado | Un año después de que terminara la sesión |
| Registros de moderación, la lista blanca y las notas del personal | Hasta que el personal del servidor los elimine |
| Todo lo que un servidor alojado guarda sobre sus jugadores | Se elimina cuando se elimina el servidor |
| El registro de actividad de un servidor | 365 días |
| Copias de seguridad | 3, 7 o 30 días, según el plan |
| Papelera de un servidor | 7 días |
| Los archivos de un servidor tras su terminación | 14 días, luego se eliminan |
| El mundo de una prueba tras eliminar el servidor | 30 días |
| Registros de donaciones y pagos | El tiempo que exijan las normas fiscales y contables |

Todo lo que esté bajo una retención legal se conserva hasta que esta termine.

## Mantenerlo seguro {#security}

Todo viaja por HTTPS. El servidor de cada cliente funciona en su propio espacio, separado de los demás y del panel. Las contraseñas se almacenan con hash y los tokens de las cuentas vinculadas cifrados. El acceso a los registros de inicio de sesión es limitado y queda registrado. Ningún sistema es perfectamente seguro, y si una brecha afecta a su información, se lo comunicaremos.

## Sus opciones y derechos {#rights}

Puede hacer lo siguiente usted mismo cuando el panel lo permita, o pedírnoslo:

- obtener una copia de la información que conservamos sobre usted;
- corregirla, o eliminar su cuenta y lo que la acompaña;
- desvincular Discord, Steam o Nexus Mods;
- descargar su mundo desde el panel en cualquier momento;
- desactivar las notificaciones, o borrar lo que está almacenado en su navegador.

Escriba a legal@openacai.com o pregunte en [nuestro Discord](https://discord.gg/T2Tjh5ECS). Es posible que necesitemos confirmar que es usted, y podemos conservar lo que la ley exija o lo que necesitemos para hacer frente a abusos. Dependiendo de dónde viva, la ley puede darle derechos adicionales, incluido el derecho a presentar una reclamación ante su autoridad de protección de datos. Los respetaremos.

## Dónde se conserva {#where}

Nuestra máquina está en Nueva Jersey, en Estados Unidos, y su información se trata allí. Si usa Modstoke desde otro país, su información llega a Estados Unidos.

## Menores {#children}

Modstoke no es para menores de 13 años, y no recogemos a sabiendas su información. Si cree que un menor de 13 años tiene una cuenta, avísenos y la eliminaremos. Las personas de 13 a 17 años necesitan el permiso de un padre, madre o tutor.

## Lo que aún estamos construyendo {#planned}

Algunas cosas que hemos anunciado aún no están en funcionamiento. Cuando lleguen, así funcionarán, y actualizaremos esta página antes de cada lanzamiento:

- **Planes de pago.** PayPal cobrará el pago. Conservaremos los registros descritos en Donaciones y pagos.
- **Correo electrónico.** Hoy no enviamos correos. Cuando empecemos, será para asuntos de su cuenta y su servidor, no para marketing.
- **Copias de seguridad en su propio almacenamiento en la nube.** Si conecta Google Drive o OneDrive, almacenaremos el acceso que conceda y enviaremos allí sus copias de seguridad, y nada más.
- **Canales de Discord para un servidor.** Si los activa, los anuncios de su servidor, y el chat si lo conecta, se publicarán en Discord.
- **Una tienda de mods, temas y aplicaciones.** Instalar algo informará a su origen de que se ha producido una descarga, como cualquier descarga.
- **Voz y radio en planes más grandes.** Diremos exactamente qué se graba y qué no antes de que abran.

## Cambios {#changes}

Cuando cambiemos esta política, publicaremos aquí la nueva versión con su fecha. Si un cambio es importante, lo anunciaremos en nuestro Discord o en el panel antes de que entre en vigor.

## Contacto {#contact}

Escriba a legal@openacai.com, o pregunte en [nuestro Discord](https://discord.gg/T2Tjh5ECS). OpenACAI Inc, Farmington, Missouri, United States.
