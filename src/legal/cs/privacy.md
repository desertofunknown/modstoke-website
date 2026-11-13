# Zásady ochrany osobních údajů

Jaké údaje Modstoke shromažďuje, proč, jak dlouho je uchováváme a co můžete požadovat, abychom s nimi udělali.

Effective 12 November 2026

## Kdo jsme a co tyto zásady zahrnují {#scope}

Modstoke provozuje OpenACAI Inc („OpenACAI“, „my“, „nás“), nezisková organizace podle 501(c)(3) se sídlem ve Farmingtonu, Missouri. Tyto zásady se vztahují na modstoke.com, váš účet Modstoke a hostingový panel na panel.modstoke.com, herní servery, které hostujeme, naše mody a nástroje a dary poskytnuté prostřednictvím webu.

Naše aplikace pro Discord, Sentinel a Radio, upravuje [stránka o ochraně osobních údajů aplikací pro Discord](/apps/privacy/). Ostatní služby OpenACAI mají [své vlastní zásady](https://openacai.com/privacy-policy/).

Ve stručnosti:

- Shromažďujeme to, co potřebujeme k provozu účtů a serverů a k jejich zabezpečení.
- Osobní údaje neprodáváme, nezobrazujeme reklamy a vaše údaje nepoužíváme k trénování modelů umělé inteligence.
- Můžete nás požádat o kopii svých údajů nebo o jejich opravu či výmaz.

## Návštěva webu {#site}

Web modstoke.com si můžete číst a naše mody a nástroje stahovat bez účtu. Web nenastavuje žádné reklamní ani sledovací soubory cookie.

Jako každý web dostává i ten náš vaši IP adresu, údaje o prohlížeči a stránky, o které požádáte. Před našimi weby stojí Cloudflare, který je doručuje a blokuje útoky, takže tento provoz vidí také, a poskytuje nám souhrnné počty návštěv, které vás neidentifikují. Uchováváme serverové protokoly, abychom službu provozovali a zabezpečili.

## Váš účet {#account}

Když si vytvoříte účet nebo se přihlásíte, uchováváme:

- vaše uživatelské jméno a e-mailovou adresu a otisk (hash) vašeho hesla, pokud jste si je nastavili;
- **Discord**, pokud se jím přihlašujete: vaše Discord ID a e-mail ke svému účtu na Discordu;
- **Steam**, pokud jej propojíte: vaše SteamID a informaci, zda tento účet vlastní hru Sons of the Forest, což ověřujeme u Steamu při propojení a poté čas od času. Práva vlastníka a personálu na serveru se řídí podle SteamID;
- **Nexus Mods**, pokud je propojíte: vaše jméno na Nexus, avatar a informaci, zda máte Premium, a přístupové tokeny, které nám Nexus poskytuje a které ukládáme zašifrované;
- to, co nám sdělíte, když požádáte o server nebo o pomoc;
- vaše nastavení plochy, například motiv a rozvržení, aby vás sledovala mezi zařízeními.

### Záznamy o přihlášení {#records}

Z bezpečnostních důvodů a abychom mohli odpovědět na zákonnou žádost zaznamenáváme každou registraci, přihlášení, neúspěšné přihlášení a odhlášení v panelu a přes SFTP, a to včetně:

- času a použité metody;
- vaší IP adresy, názvu sítě, na který se přeloží, a země, kterou pro ni uvádí Cloudflare;
- vašeho prohlížeče, operačního systému a náhodného ID, které uchováváme v cookie, abychom od sebe rozlišili jednotlivé prohlížeče.

Tyto záznamy uchováváme 365 dní. Otevřít je mohou pouze naši vedoucí správci a pokaždé, když to někdo udělá, také se to zaznamená. Pokud nám zákon ukládá uchovat záznamy účtu, uchováváme je, dokud tato povinnost trvá.

## Hostované servery {#servers}

U serveru, který si pronajmete nebo používáte na zkoušku, uchováváme:

- vše, co je na serveru: soubory hry, váš svět, mody, nastavení a cokoli nahrajete;
- zálohy po dobu, kterou stanoví váš tarif, a soubory, které smažete a které zůstanou v koši 7 dní;
- stav serveru: využití procesoru, paměti, disku a sítě, počty hráčů a nainstalované mody, vzorkované každých 10 minut a uchovávané 30 dní;
- protokol konzole, události a zprávy o pádech, abychom my i vy viděli, co se pokazilo;
- výsledky kontroly virů u nahraných souborů a složek s mody: cestu k souboru, velikost, otisk a verdikt;
- kdo z vašeho personálu co dělal, v protokolu aktivity serveru, který se uchovává 365 dní;
- kdo má právě otevřenou plochu serveru, což se zobrazuje ostatnímu personálu serveru.

Náš personál může otevřít soubory, konzoli a protokoly serveru, aby službu provozoval, pomohl, když o to požádáte, prošetřil zneužití nebo bezpečnostní problém a když to vyžaduje zákon.

### Lidé, kteří hrají na hostovaném serveru {#players}

Server, který hostujeme, zaznamenává lidi, kteří se k němu připojí. Vlastník serveru rozhoduje o tom, kdo tam hraje a kdo je jeho personál, a my to uchováváme pro něj a kvůli zabezpečení služby:

- jméno na Steamu a SteamID a kdy se každý hráč připojil a odpojil;
- chat, uchovávaný 30 dní;
- kde se hráči ve světě nacházejí, zatímco hrají. Polohy jsou pouze živé a během několika minut zmizí;
- moderování: umlčení, uvěznění, vyhození a zákazy, whitelist a poznámky, které personál o hráči píše;
- pokud hráč používá mod Modstoke Client, zdraví a inventář, které jeho hra hlásí.

Vidět to může pouze vlastník a personál daného serveru a náš vlastní personál. Veřejný seznam serverů zobrazuje název serveru a kolik lidí hraje, nikdy ne kdo.

Záznam o návštěvě se uchovává rok po jejím skončení. Když je server smazán, smaže se s ním vše, co o jeho hráčích obsahoval.

Pokud na serveru hrajete a chcete vědět, co o vás uchovává, nebo chcete, aby to bylo odstraněno dříve, zeptejte se vlastníka serveru nebo se zeptejte nás.

### Ember {#ember}

Ember, pomocník na ploše, odpovídá pomocí modelu, který běží na našem vlastním stroji. Vaše dotazy a údaje o vašem serveru, které k nim patří, se neposílají externí společnosti zabývající se umělou inteligencí a nepoužívají se k trénování modelů.

## Mody a nástroje {#tools}

Modstoke Manager a Loader stahují informace o vydáních, katalogy a soubory ke stažení z modstoke.com a z Nexus Mods nebo sotf-mods.com, když používáte tyto obchody. Tyto požadavky nesou vaši IP adresu, jako každé stahování. Pokud se v Manageru přihlásíte do Nexus Mods, je to záležitost mezi vámi a Nexus.

## Dary a platby {#payments}

Platby probíhají přes PayPal. Údaje o vaší kartě ani bankovním účtu nikdy nevidíme ani neukládáme. U daru uchováváme ID objednávky nebo předplatného od PayPalu, částku, stav a ID plátce u PayPalu. Až se otevře placený hosting, budeme uchovávat totéž u tarifu spolu s tím, o jaký tarif a server jde.

## Soubory cookie a to, co se ukládá ve vašem prohlížeči {#cookies}

Panel používá pouze to, co potřebuje k fungování:

- relační cookie, která vás udržuje přihlášené, a token, který chrání formuláře;
- `modstoke_device`, náhodné ID uchovávané dva roky, používané pouze ve výše uvedených záznamech o přihlášení;
- nastavení vaší plochy a rozvržení oken, uložené v úložišti vašeho prohlížeče;
- offline kopii plochy serveru, pokud si ji nainstalujete jako aplikaci. Odhlášením se vymaže;
- odběr oznámení, pokud zapnete upozornění. Upozornění doručuje vlastní služba push vašeho prohlížeče, kterou provozuje Google, Mozilla, Apple nebo Microsoft, a přicházejí šifrovaně.

Žádné reklamní soubory cookie neexistují.

## Jak údaje používáme {#use}

To, co shromažďujeme, používáme k tomu, abychom:

- poskytovali účty, servery a stahování a opravovali je, když se pokazí;
- chránili lidi a servery: zamezovali zneužití, podvádění a vloupání a vymáhali naše [podmínky](/terms/);
- vás informovali o vašem serveru, například o konci zkušebního provozu nebo o problému s ním;
- přijímali platby a dary a vedli záznamy, které zákon od neziskové organizace vyžaduje;
- chápali, v souhrnných číslech, jak se služba používá, abychom ji mohli zlepšovat.

Pokud zákon požaduje právní základ, naším základem jsou: plnění naší smlouvy s vámi, náš oprávněný zájem provozovat bezpečnou službu, váš souhlas, kde o něj žádáme, a naše zákonné povinnosti.

## S kým údaje sdílíme {#sharing}

Osobní údaje neprodáváme. Sdílíme je pouze:

- se službami, které nám pomáhají Modstoke provozovat, a to k tomuto účelu: Cloudflare (doručování, ochrana a počty návštěv), InterServer (datové centrum v New Jersey, kde je náš stroj), PayPal (platby), Discord a Steam (přihlášení a propojení) a Nexus Mods a sotf-mods.com (když používáte jejich obchody);
- s vlastníkem a personálem serveru, pokud jde o hráče a aktivitu na tomto serveru;
- když to vyžaduje zákon nebo když je to potřeba k ochraně něčí bezpečnosti nebo našich práv;
- s organizací, která Modstoke převezme, podle týchž zásad.

## Jak dlouho údaje uchováváme {#retention}

| Co | Jak dlouho |
|---|---|
| Údaje o účtu | Dokud nás nepožádáte o smazání účtu |
| Záznamy o přihlášení | 365 dní |
| Vzorky využití serveru | 30 dní |
| Chat na hostovaném serveru | 30 dní |
| Polohy hráčů | Minuty |
| Relace hráčů na hostovaném serveru | Rok po skončení relace |
| Záznamy o moderování, whitelist a poznámky personálu | Dokud je personál serveru neodstraní |
| Vše, co hostovaný server uchovává o svých hráčích | Smaže se, když je server smazán |
| Protokol aktivity serveru | 365 dní |
| Zálohy | 3, 7 nebo 30 dní podle tarifu |
| Koš na serveru | 7 dní |
| Soubory serveru po jeho ukončení | 14 dní, poté smazány |
| Svět zkušebního serveru po smazání serveru | 30 dní |
| Záznamy o darech a platbách | Po dobu, kterou vyžadují daňová a účetní pravidla |

Cokoli, co podléhá zákonnému zákazu likvidace, se uchovává, dokud toto omezení neskončí.

## Jak je chráníme {#security}

Vše putuje přes HTTPS. Server každého zákazníka běží ve vlastním prostoru, odděleně od ostatních i od panelu. Hesla se ukládají jako hash a tokeny propojených účtů zašifrovaně. Přístup k záznamům o přihlášení je omezený a zaznamenávaný. Žádný systém není dokonale bezpečný a pokud porušení zabezpečení ovlivní vaše údaje, řekneme vám to.

## Vaše volby a práva {#rights}

Tyto věci můžete udělat sami, kde to panel umožňuje, nebo nás o ně požádat:

- získat kopii údajů, které o vás uchováváme;
- opravit je nebo smazat svůj účet a vše, co k němu patří;
- zrušit propojení s Discordem, Steamem nebo Nexus Mods;
- kdykoli si z panelu stáhnout svůj svět;
- vypnout oznámení nebo vymazat to, co je uloženo ve vašem prohlížeči.

Napište na legal@openacai.com nebo se zeptejte na [našem Discordu](https://discord.gg/T2Tjh5ECS). Můžeme potřebovat ověřit, že jste to vy, a můžeme si ponechat to, co vyžaduje zákon nebo co potřebujeme k řešení zneužití. V závislosti na tom, kde žijete, vám zákon může dávat další práva, včetně práva podat stížnost u vašeho úřadu pro ochranu osobních údajů. Ta budeme respektovat.

## Kde jsou údaje uloženy {#where}

Náš stroj je v New Jersey ve Spojených státech a vaše údaje se zpracovávají tam. Pokud používáte Modstoke z jiné země, vaše údaje putují do Spojených států.

## Děti {#children}

Modstoke není určen dětem do 13 let a vědomě o nich neshromažďujeme žádné údaje. Pokud se domníváte, že dítě do 13 let má účet, dejte nám vědět a my jej odstraníme. Lidé ve věku 13 až 17 let potřebují svolení rodiče nebo zákonného zástupce.

## Věci, které ještě budujeme {#planned}

Některé věci, které jsme oznámili, ještě nejsou spuštěny. Až přijdou, bude to s nimi fungovat takto a tuto stránku před každým spuštěním aktualizujeme:

- **Placené tarify.** Platbu přijme PayPal. Uchováme záznamy popsané v části Dary a platby.
- **E-mail.** Dnes žádné e-maily neposíláme. Až začneme, bude to kvůli věcem týkajícím se vašeho účtu a serveru, nikoli marketingu.
- **Zálohy do vašeho vlastního cloudového úložiště.** Pokud připojíte Google Drive nebo OneDrive, uložíme přístup, který udělíte, a pošleme tam vaše zálohy, a nic jiného.
- **Kanály na Discordu pro server.** Pokud je zapnete, budou na Discord odesílána oznámení vašeho serveru a chat, pokud jej propojíte.
- **Obchod s mody, motivy a aplikacemi.** Instalace něčeho dá jeho zdroji vědět, že proběhlo stažení, jako každé stahování.
- **Hlas a rádio ve větších tarifech.** Řekneme přesně, co se nahrává a co ne, než se otevřou.

## Změny {#changes}

Když tyto zásady změníme, zveřejníme zde novou verzi s jejím datem. Pokud je změna podstatná, oznámíme ji na našem Discordu nebo v panelu před tím, než nabude účinnosti.

## Kontakt {#contact}

Napište na legal@openacai.com nebo se zeptejte na [našem Discordu](https://discord.gg/T2Tjh5ECS). OpenACAI Inc, Farmington, Missouri, United States.
