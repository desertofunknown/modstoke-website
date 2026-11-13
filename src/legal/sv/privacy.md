# Integritetspolicy

Vad Modstoke samlar in, varför, hur länge vi sparar det och vad du kan be oss göra med det.

Effective 12 November 2026

## Vilka vi är och vad detta omfattar {#scope}

Modstoke drivs av OpenACAI Inc ("OpenACAI", "vi", "oss"), en ideell organisation enligt 501(c)(3) med säte i Farmington, Missouri. Policyn omfattar modstoke.com, ditt Modstoke-konto och hostingpanelen på panel.modstoke.com, de spelservrar vi hostar, våra moddar och verktyg samt donationer som görs via webbplatsen.

Våra Discord-appar, Sentinel och Radio, omfattas av [integritetssidan för Discord-apparna](/apps/privacy/). OpenACAI:s övriga tjänster har [en egen policy](https://openacai.com/privacy-policy/).

Den korta versionen:

- Vi samlar in det vi behöver för att driva konton och servrar och hålla dem säkra.
- Vi säljer inte personuppgifter, visar inga annonser och använder inte dina data för att träna AI-modeller.
- Du kan be oss om en kopia av dina uppgifter, eller om att få dem rättade eller raderade.

## Besök på webbplatsen {#site}

Du kan läsa modstoke.com och ladda ned våra moddar och verktyg utan konto. Webbplatsen sätter inga reklam- eller spårningscookies.

Som alla webbplatser får vår din IP-adress, uppgifter om din webbläsare och de sidor du begär. Cloudflare står framför våra webbplatser för att leverera dem och blockera attacker, så det ser också den trafiken, och det ger oss besöksantal i sammanlagda siffror som inte identifierar dig. Vi sparar serverloggar för att driva och skydda tjänsten.

## Ditt konto {#account}

När du skapar ett konto eller loggar in sparar vi:

- ditt användarnamn och din e-postadress, samt en hash av ditt lösenord om du har angett ett;
- **Discord**, om du loggar in med det: ditt Discord-ID och e-postadressen på ditt Discord-konto;
- **Steam**, om du länkar det: ditt SteamID och huruvida kontot äger Sons of the Forest, vilket vi kontrollerar med Steam när du länkar och därefter då och då. Ägar- och personalbehörigheter på en server går efter SteamID;
- **Nexus Mods**, om du länkar det: ditt Nexus-namn, din avatar och om du har Premium, samt de åtkomsttoken som Nexus ger oss, vilka vi lagrar krypterade;
- det du berättar för oss när du ansöker om en server eller ber om hjälp;
- dina inställningar för skrivbordet, till exempel tema och layout, så att de följer dig mellan enheter.

### Inloggningsregister {#records}

Av säkerhetsskäl, och för att vi ska kunna besvara en laglig begäran, registrerar vi varje registrering, inloggning, misslyckad inloggning och utloggning på panelen och via SFTP, med:

- tidpunkt och vilken metod som användes;
- din IP-adress, nätverksnamnet den motsvarar och det land som Cloudflare rapporterar för den;
- din webbläsare, ditt operativsystem och ett slumpmässigt ID som vi sparar i en cookie för att skilja en webbläsare från en annan.

Vi sparar dessa register i 365 dagar. Endast våra seniora administratörer kan öppna dem, och varje gång någon gör det loggas även det. Om lagen kräver att vi bevarar ett kontos register sparar vi dem tills det upphör.

## Hostade servrar {#servers}

För en server som du hyr eller kör som provperiod sparar vi:

- allt på servern: spelets filer, din värld, moddar, inställningar och allt du laddar upp;
- säkerhetskopior, så länge din plan anger, samt filer du raderar, som ligger kvar i papperskorgen i 7 dagar;
- hur servern mår: användning av processor, minne, disk och nätverk, spelarantal och installerade moddar, uppmätt var 10:e minut och sparad i 30 dagar;
- konsolloggen, händelser och kraschrapporter, så att du och vi kan se vad som gick fel;
- resultat av virusskanning för uppladdningar och modmappar: filens sökväg, storlek, fingeravtryck och utlåtande;
- vem i din personal som gjorde vad, i serverns aktivitetslogg, som sparas i 365 dagar;
- vem som just nu har serverns skrivbord öppet, vilket visas för serverns övriga personal.

Vår personal kan öppna en servers filer, konsol och loggar för att driva tjänsten, för att hjälpa till när du ber om det, för att utreda missbruk eller ett säkerhetsproblem och när lagen kräver det.

### Personer som spelar på en hostad server {#players}

En server som vi hostar registrerar de personer som går med i den. Serverns ägare bestämmer vem som spelar där och vilka som är personal, och vi sparar detta åt dem och för att hålla tjänsten säker:

- Steam-namn och SteamID samt när varje spelare gick med och lämnade;
- chatt, som sparas i 30 dagar;
- var spelarna befinner sig i världen medan de spelar. Positioner är bara live och är borta inom några minuter;
- moderering: tystningar, inspärrningar, kickar och bannlysningar, vitlistan och anteckningar som personalen skriver om en spelare;
- om en spelare använder modden Modstoke Client, den hälsa och det inventarie som spelet rapporterar.

Endast den serverns ägare och personal samt vår egen personal kan se detta. En offentlig serverlista visar serverns namn och hur många som spelar, aldrig vilka.

Uppgifterna om ett besök sparas i ett år efter att det tog slut. När en server raderas raderas allt den höll om sina spelare med den.

Om du spelar på en server och vill veta vad den har om dig, eller vill att det tas bort tidigare, fråga serverns ägare, eller fråga oss.

### Ember {#ember}

Ember, hjälparen i skrivbordet, svarar med en modell som körs på vår egen maskin. Dina frågor och de fakta om din server som följer med dem skickas inte till något externt AI-företag och används inte för att träna modeller.

## Moddar och verktyg {#tools}

Modstoke Manager och Loader hämtar versionsinformation, kataloger och nedladdningar från modstoke.com, och från Nexus Mods eller sotf-mods.com när du använder de butikerna. Dessa förfrågningar innehåller din IP-adress, som vid vilken nedladdning som helst. Om du loggar in på Nexus Mods i Manager är det en sak mellan dig och Nexus.

## Donationer och betalningar {#payments}

Betalningar går via PayPal. Vi ser eller lagrar aldrig dina kort- eller bankuppgifter. För en donation sparar vi PayPals order- eller prenumerations-ID, beloppet, dess status och PayPals ID för betalaren. När betald hosting öppnar sparar vi samma uppgifter för en plan, tillsammans med vilken plan och vilken server den betalar för.

## Cookies och vad som sparas i din webbläsare {#cookies}

Panelen använder bara det den behöver för att fungera:

- en sessionscookie som håller dig inloggad och en token som skyddar formulär;
- `modstoke_device`, ett slumpmässigt ID som sparas i två år och används enbart i inloggningsregistren ovan;
- skrivbordets inställningar och fönsterlayout, som sparas i webbläsarens lagring;
- en offlinekopia av en servers skrivbord, om du installerar det som en app. Utloggning rensar den;
- en aviseringsprenumeration, om du slår på aviseringar. Aviseringar levereras av webbläsarens egen pushtjänst, som drivs av Google, Mozilla, Apple eller Microsoft, och de anländer krypterade.

Det finns inga reklamcookies.

## Hur vi använder uppgifter {#use}

Vi använder det vi samlar in för att:

- tillhandahålla konton, servrar och nedladdningar och laga dem när de går sönder;
- hålla människor och servrar säkra: stoppa missbruk, fusk och intrång samt upprätthålla våra [villkor](/terms/);
- berätta för dig om din server, till exempel att en provperiod håller på att ta slut eller att något är fel med den;
- ta emot betalningar och donationer och föra de register som lagen kräver av en ideell organisation;
- förstå, i sammanlagda siffror, hur tjänsten används så att vi kan förbättra den.

Där lagen kräver en rättslig grund är våra: fullgörandet av vårt avtal med dig, vårt berättigade intresse av att driva en säker tjänst, ditt samtycke där vi ber om det samt våra rättsliga skyldigheter.

## Vilka vi delar det med {#sharing}

Vi säljer inte personuppgifter. Vi delar dem endast:

- med de tjänster som hjälper oss att driva Modstoke, för det ändamålet: Cloudflare (leverans, skydd och besöksantal), InterServer (datacentret i New Jersey där vår maskin står), PayPal (betalningar), Discord och Steam (inloggning och länkning) samt Nexus Mods och sotf-mods.com (när du använder deras butiker);
- med en servers ägare och personal, för spelarna och aktiviteten på den servern;
- när lagen kräver det, eller när det behövs för att skydda någons säkerhet eller våra rättigheter;
- med en organisation som tar över Modstoke, enligt samma policy.

## Hur länge vi sparar det {#retention}

| Vad | Hur länge |
|---|---|
| Kontouppgifter | Tills du ber oss radera kontot |
| Inloggningsregister | 365 dagar |
| Mätvärden för serveranvändning | 30 dagar |
| Chatt på en hostad server | 30 dagar |
| Spelarpositioner | Minuter |
| Spelarsessioner på en hostad server | Ett år efter att sessionen tog slut |
| Modereringsuppgifter, vitlistan och personalanteckningar | Tills serverns personal tar bort dem |
| Allt en hostad server har om sina spelare | Raderas när servern raderas |
| En servers aktivitetslogg | 365 dagar |
| Säkerhetskopior | 3, 7 eller 30 dagar, beroende på plan |
| Papperskorgen på en server | 7 dagar |
| En servers filer efter att den upphört | 14 dagar, sedan raderas de |
| En provperiods värld efter att servern raderats | 30 dagar |
| Donations- och betalningsregister | Så länge skatte- och bokföringsregler kräver |

Allt som omfattas av ett rättsligt spärrbeslut sparas tills spärren upphör.

## Att hålla det säkert {#security}

Allt skickas över HTTPS. Varje kunds server körs i sitt eget utrymme, åtskilt från de andra och från panelen. Lösenord lagras som hashar och token för länkade konton krypterade. Åtkomst till inloggningsregister är begränsad och loggas. Inget system är helt säkert, och om ett intrång påverkar dina uppgifter berättar vi det för dig.

## Dina val och rättigheter {#rights}

Du kan göra detta själv där panelen tillåter det, eller be oss göra det:

- få en kopia av de uppgifter vi har om dig;
- rätta dem, eller radera ditt konto och det som hör till det;
- avlänka Discord, Steam eller Nexus Mods;
- ladda ned din värld från panelen när som helst;
- stänga av aviseringar, eller rensa det som sparas i din webbläsare.

Skicka e-post till legal@openacai.com eller fråga i [vår Discord](https://discord.gg/T2Tjh5ECS). Vi kan behöva bekräfta att det är du, och vi kan behålla det som lagen kräver eller det vi behöver för att hantera missbruk. Beroende på var du bor kan lagen ge dig ytterligare rättigheter, inklusive rätten att klaga hos din dataskyddsmyndighet. Dem respekterar vi.

## Var det sparas {#where}

Vår maskin står i New Jersey i USA, och dina uppgifter behandlas där. Om du använder Modstoke från ett annat land kommer dina uppgifter till USA.

## Barn {#children}

Modstoke är inte till för barn under 13 år, och vi samlar inte medvetet in deras uppgifter. Om du tror att ett barn under 13 år har ett konto, berätta för oss så tar vi bort det. Personer mellan 13 och 17 år behöver en förälders eller vårdnadshavares tillstånd.

## Saker vi fortfarande bygger {#planned}

Vissa saker vi har aviserat är inte i drift ännu. När de kommer fungerar det så här, och vi uppdaterar den här sidan före varje lansering:

- **Betalda planer.** PayPal tar emot betalningen. Vi sparar de uppgifter som beskrivs under Donationer och betalningar.
- **E-post.** Vi skickar ingen e-post i dag. När vi börjar blir det för saker som rör ditt konto och din server, inte marknadsföring.
- **Säkerhetskopior till din egen molnlagring.** Om du ansluter Google Drive eller OneDrive lagrar vi den åtkomst du ger och skickar dina säkerhetskopior dit, och inget annat.
- **Discord-kanaler för en server.** Om du slår på dem publiceras din servers meddelanden, och chatten om du kopplar den, i Discord.
- **En butik för moddar, teman och appar.** När något installeras får dess källa veta att en nedladdning har skett, som vid vilken nedladdning som helst.
- **Röst och radio på större planer.** Vi berättar exakt vad som spelas in och inte innan de öppnar.

## Ändringar {#changes}

När vi ändrar den här policyn publicerar vi den nya versionen här med dess datum. Om en ändring är betydelsefull meddelar vi den i vår Discord eller på panelen innan den träder i kraft.

## Kontakt {#contact}

Skicka e-post till legal@openacai.com, eller fråga i [vår Discord](https://discord.gg/T2Tjh5ECS). OpenACAI Inc, Farmington, Missouri, United States.
