# Política de Privacidade

O que o Modstoke coleta, por quê, por quanto tempo guardamos e o que você pode nos pedir para fazer com isso.

Effective 12 November 2026

## Quem somos e o que esta política abrange {#scope}

O Modstoke é operado pela OpenACAI Inc ("OpenACAI", "nós"), uma organização sem fins lucrativos 501(c)(3) sediada em Farmington, Missouri. Esta política abrange o modstoke.com, sua conta Modstoke e o painel de hospedagem em panel.modstoke.com, os servidores de jogo que hospedamos, nossos mods e ferramentas e as doações feitas pelo site.

Nossos apps para Discord, Sentinel e Radio, são abrangidos pela [página de privacidade dos apps para Discord](/apps/privacy/). Os outros serviços da OpenACAI têm [sua própria política](https://openacai.com/privacy-policy/).

A versão curta:

- Coletamos o que precisamos para operar contas e servidores e mantê-los seguros.
- Não vendemos informações pessoais, não exibimos anúncios e não usamos seus dados para treinar modelos de IA.
- Você pode nos pedir uma cópia das suas informações, ou que as corrijamos ou excluamos.

## Visitando o site {#site}

Você pode ler o modstoke.com e baixar nossos mods e ferramentas sem uma conta. O site não define cookies de publicidade nem de rastreamento.

Como qualquer site, o nosso recebe seu endereço IP, dados do navegador e as páginas que você pede. A Cloudflare fica na frente dos nossos sites para entregá-los e bloquear ataques, então ela também vê esse tráfego, e nos fornece contagens de visitas no total que não identificam você. Guardamos logs do servidor para operar e proteger o serviço.

## Sua conta {#account}

Quando você cria uma conta ou entra, guardamos:

- seu nome de usuário e endereço de e-mail, e um hash da sua senha, se você definir uma;
- **Discord**, se você entrar com ele: seu ID do Discord e o e-mail da sua conta do Discord;
- **Steam**, se você a vincular: seu SteamID e se essa conta possui Sons of the Forest, o que verificamos com a Steam quando você vincula e de tempos em tempos depois. Os direitos de proprietário e de equipe em um servidor são dados pelo SteamID;
- **Nexus Mods**, se você o vincular: seu nome na Nexus, o avatar e se você tem Premium, além dos tokens de acesso que a Nexus nos fornece, que guardamos criptografados;
- o que você nos diz quando se candidata a um servidor ou pede ajuda;
- suas configurações do desktop, como tema e layout, para que o acompanhem entre dispositivos.

### Registros de acesso {#records}

Por segurança, e para podermos responder a uma solicitação legal, registramos cada cadastro, login, login com falha e logout no painel e por SFTP, com:

- o horário e o método usado;
- seu endereço IP, o nome da rede a que ele corresponde e o país que a Cloudflare informa para ele;
- seu navegador, sistema operacional e um ID aleatório que guardamos em um cookie para distinguir um navegador de outro.

Guardamos esses registros por 365 dias. Somente nossos administradores sêniores podem abri-los, e cada vez que um deles o faz, isso também é registrado. Se a lei nos exigir preservar os registros de uma conta, nós os guardamos até que isso termine.

## Servidores hospedados {#servers}

Para um servidor que você aluga ou usa em período de teste, guardamos:

- tudo o que está no servidor: os arquivos do jogo, seu mundo, mods, configurações e qualquer coisa que você envie;
- backups, pelo tempo que seu plano indicar, e arquivos que você exclui, que ficam na Lixeira por 7 dias;
- como o servidor está indo: uso de CPU, memória, disco e rede, número de jogadores e mods instalados, amostrados a cada 10 minutos e guardados por 30 dias;
- o log do console, eventos e relatórios de falha, para que você e nós possamos ver o que deu errado;
- resultados da verificação de vírus de uploads e pastas de mods: o caminho do arquivo, o tamanho, a impressão digital e o resultado;
- quem da sua equipe fez o quê, no registro de atividades do servidor, guardado por 365 dias;
- quem está com o desktop do servidor aberto agora, mostrado aos outros membros da equipe do servidor.

Nossa equipe pode abrir os arquivos, o console e os logs de um servidor para operar o serviço, para ajudar quando você pedir, para investigar abuso ou um problema de segurança e quando a lei exigir.

### Pessoas que jogam em um servidor hospedado {#players}

Um servidor que hospedamos registra as pessoas que entram nele. O proprietário do servidor decide quem joga ali e quem é da equipe, e nós guardamos isso por ele e para manter o serviço seguro:

- nome na Steam e SteamID, e quando cada jogador entrou e saiu;
- chat, guardado por 30 dias;
- onde os jogadores estão no mundo enquanto jogam. As posições são apenas em tempo real e somem em poucos minutos;
- moderação: silenciamentos, prisões, expulsões e banimentos, a whitelist e anotações que a equipe escreve sobre um jogador;
- se um jogador usa o mod Modstoke Client, a saúde e o inventário que o jogo dele informa.

Somente o proprietário e a equipe desse servidor, e a nossa equipe, podem ver isso. A listagem pública de um servidor mostra o nome do servidor e quantos estão jogando, nunca quem.

O registro de uma visita é guardado por um ano depois que ela terminou. Quando um servidor é excluído, tudo o que ele guardava sobre seus jogadores é excluído junto.

Se você joga em um servidor e quer saber o que ele guarda sobre você, ou quer que isso seja removido mais cedo, pergunte ao proprietário do servidor ou pergunte a nós.

### Ember {#ember}

O Ember, o assistente no desktop, responde usando um modelo que roda na nossa própria máquina. Suas perguntas e as informações sobre o seu servidor que as acompanham não são enviadas a uma empresa de IA externa e não são usadas para treinar modelos.

## Mods e ferramentas {#tools}

O Modstoke Manager e o Loader buscam informações de versões, catálogos e downloads no modstoke.com, e na Nexus Mods ou no sotf-mods.com quando você usa essas lojas. Essas requisições levam seu endereço IP, como qualquer download. Se você entrar na Nexus Mods no Manager, isso é entre você e a Nexus.

## Doações e pagamentos {#payments}

Os pagamentos são feitos pelo PayPal. Nunca vemos nem guardamos os dados do seu cartão ou conta bancária. Para uma doação, guardamos o ID do pedido ou da assinatura do PayPal, o valor, seu status e o ID do pagador no PayPal. Quando a hospedagem paga for aberta, guardaremos o mesmo para um plano, junto com qual plano e qual servidor o pagamento cobre.

## Cookies e o que fica guardado no seu navegador {#cookies}

O painel usa apenas o que precisa para funcionar:

- um cookie de sessão que mantém você conectado e um token que protege os formulários;
- `modstoke_device`, um ID aleatório guardado por dois anos, usado somente nos registros de acesso acima;
- as configurações do seu desktop e o layout das janelas, guardados no armazenamento do seu navegador;
- uma cópia offline do desktop de um servidor, se você o instalar como app. Sair da conta a apaga;
- uma assinatura de notificações, se você ativar os alertas. Os alertas são entregues pelo serviço de push do seu próprio navegador, operado pelo Google, Mozilla, Apple ou Microsoft, e chegam criptografados.

Não há cookies de publicidade.

## Como usamos as informações {#use}

Usamos o que coletamos para:

- fornecer contas, servidores e downloads, e consertá-los quando quebram;
- manter pessoas e servidores seguros: impedir abuso, trapaça e invasões, e fazer cumprir nossos [termos](/terms/);
- avisar você sobre seu servidor, como o fim de um teste ou um problema com ele;
- receber pagamentos e doações e manter os registros que a lei exige de uma organização sem fins lucrativos;
- entender, em totais, como o serviço é usado para podermos melhorá-lo.

Quando a lei pede uma base legal, as nossas são: a execução do nosso acordo com você, nosso interesse legítimo em operar um serviço seguro, seu consentimento quando o pedimos e nossas obrigações legais.

## Com quem compartilhamos {#sharing}

Não vendemos informações pessoais. Só as compartilhamos:

- com os serviços que nos ajudam a operar o Modstoke, para essa finalidade: Cloudflare (entrega, proteção e contagem de visitas), InterServer (o datacenter em Nova Jersey onde fica nossa máquina), PayPal (pagamentos), Discord e Steam (login e vinculação), e Nexus Mods e sotf-mods.com (quando você usa as lojas deles);
- com o proprietário e a equipe de um servidor, no que diz respeito aos jogadores e à atividade nesse servidor;
- quando a lei exigir, ou quando for necessário para proteger a segurança de alguém ou nossos direitos;
- com uma organização que assuma o Modstoke, sob esta mesma política.

## Por quanto tempo guardamos {#retention}

| O quê | Por quanto tempo |
|---|---|
| Dados da conta | Até você nos pedir para excluir a conta |
| Registros de acesso | 365 dias |
| Amostras de uso do servidor | 30 dias |
| Chat em um servidor hospedado | 30 dias |
| Posições dos jogadores | Minutos |
| Sessões de jogadores em um servidor hospedado | Um ano depois do fim da sessão |
| Registros de moderação, a whitelist e anotações da equipe | Até a equipe do servidor removê-los |
| Tudo o que um servidor hospedado guarda sobre seus jogadores | Excluído quando o servidor é excluído |
| Registro de atividades de um servidor | 365 dias |
| Backups | 3, 7 ou 30 dias, conforme o plano |
| Lixeira de um servidor | 7 dias |
| Os arquivos de um servidor depois que ele termina | 14 dias, depois excluídos |
| O mundo de um teste depois que o servidor é excluído | 30 dias |
| Registros de doações e pagamentos | Pelo tempo que as regras fiscais e contábeis exigirem |

Tudo o que estiver sob bloqueio legal é guardado até o bloqueio terminar.

## Mantendo tudo seguro {#security}

Tudo trafega por HTTPS. O servidor de cada cliente roda em seu próprio espaço, separado dos outros e do painel. As senhas são guardadas com hash e os tokens de contas vinculadas, criptografados. O acesso aos registros de acesso é limitado e registrado. Nenhum sistema é perfeitamente seguro, e, se uma violação afetar suas informações, avisaremos você.

## Suas escolhas e seus direitos {#rights}

Você mesmo pode fazer isto onde o painel permitir, ou pedir que façamos:

- obter uma cópia das informações que guardamos sobre você;
- corrigi-las, ou excluir sua conta e o que vai junto com ela;
- desvincular Discord, Steam ou Nexus Mods;
- baixar seu mundo pelo painel a qualquer momento;
- desativar as notificações ou limpar o que está guardado no seu navegador.

Envie um e-mail para legal@openacai.com ou pergunte no [nosso Discord](https://discord.gg/T2Tjh5ECS). Podemos precisar confirmar que é você, e podemos guardar o que a lei exigir ou o que precisarmos para lidar com abusos. Dependendo de onde você mora, a lei pode lhe dar direitos adicionais, incluindo o direito de apresentar reclamação à sua autoridade de proteção de dados. Nós os respeitaremos.

## Onde as informações ficam {#where}

Nossa máquina fica em Nova Jersey, nos Estados Unidos, e suas informações são processadas lá. Se você usar o Modstoke a partir de outro país, suas informações vão para os Estados Unidos.

## Crianças {#children}

O Modstoke não é destinado a crianças menores de 13 anos, e não coletamos conscientemente informações delas. Se você acredita que uma criança menor de 13 anos tem uma conta, avise-nos e a removeremos. Pessoas de 13 a 17 anos precisam da permissão de um pai, mãe ou responsável.

## Coisas que ainda estamos construindo {#planned}

Algumas coisas que anunciamos ainda não estão no ar. Quando chegarem, é assim que funcionarão, e atualizaremos esta página antes de cada lançamento:

- **Planos pagos.** O PayPal receberá o pagamento. Guardaremos os registros descritos em Doações e pagamentos.
- **E-mail.** Hoje não enviamos e-mail. Quando começarmos, será para assuntos sobre sua conta e seu servidor, não para marketing.
- **Backups no seu próprio armazenamento em nuvem.** Se você conectar o Google Drive ou o OneDrive, guardaremos o acesso que você conceder e enviaremos seus backups para lá, e nada além disso.
- **Canais do Discord para um servidor.** Se você os ativar, os anúncios do seu servidor, e o chat, se você o conectar, serão publicados no Discord.
- **Uma loja de mods, temas e apps.** Instalar algo informará à sua origem que um download aconteceu, como qualquer download.
- **Voz e rádio em planos maiores.** Diremos exatamente o que é e o que não é gravado antes de abrirem.

## Alterações {#changes}

Quando alterarmos esta política, publicaremos aqui a nova versão com sua data. Se uma mudança for relevante, vamos anunciá-la no nosso Discord ou no painel antes de ela entrar em vigor.

## Contato {#contact}

Envie um e-mail para legal@openacai.com ou pergunte no [nosso Discord](https://discord.gg/T2Tjh5ECS). OpenACAI Inc, Farmington, Missouri, United States.
