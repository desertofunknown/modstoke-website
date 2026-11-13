# Polityka prywatności

Co zbiera Modstoke, po co, jak długo to przechowujemy i o co można nas poprosić w związku z tymi danymi.

Effective 12 November 2026

## Kim jesteśmy i czego dotyczy ta polityka {#scope}

Modstoke prowadzi OpenACAI Inc („OpenACAI”, „my”, „nas”), organizacja non-profit 501(c)(3) z siedzibą w Farmington, Missouri. Polityka dotyczy modstoke.com, konta Użytkownika w Modstoke i panelu hostingowego pod adresem panel.modstoke.com, hostowanych przez nas serwerów gier, naszych modów i narzędzi oraz darowizn przekazywanych za pośrednictwem strony.

Nasze aplikacje na Discorda, Sentinel i Radio, obejmuje [strona prywatności aplikacji na Discorda](/apps/privacy/). Pozostałe usługi OpenACAI mają [własną politykę](https://openacai.com/privacy-policy/).

W skrócie:

- Zbieramy to, czego potrzebujemy do prowadzenia kont i serwerów oraz do utrzymania ich bezpieczeństwa.
- Nie sprzedajemy danych osobowych, nie wyświetlamy reklam i nie wykorzystujemy danych Użytkownika do trenowania modeli AI.
- Można poprosić nas o kopię swoich danych albo o ich poprawienie lub usunięcie.

## Odwiedzanie strony {#site}

Z modstoke.com można korzystać i pobierać nasze mody i narzędzia bez konta. Strona nie ustawia reklamowych ani śledzących plików cookie.

Jak każda strona internetowa, nasza otrzymuje adres IP Użytkownika, dane przeglądarki i strony, o które prosi. Cloudflare stoi przed naszymi stronami, aby je dostarczać i blokować ataki, więc widzi również ten ruch, i przekazuje nam łączne liczby odwiedzin, które nie identyfikują Użytkownika. Przechowujemy logi serwera, aby prowadzić i zabezpieczać usługę.

## Konto Użytkownika {#account}

Gdy Użytkownik zakłada konto lub się loguje, przechowujemy:

- nazwę użytkownika i adres e-mail oraz skrót (hash) hasła, jeśli zostało ustawione;
- **Discord**, jeśli Użytkownik loguje się przez niego: identyfikator Discord i adres e-mail powiązany z kontem Discord;
- **Steam**, jeśli Użytkownik go połączy: SteamID i informację, czy to konto posiada Sons of the Forest, co sprawdzamy w Steam przy łączeniu, a potem od czasu do czasu. Prawa właściciela i personelu na serwerze opierają się na SteamID;
- **Nexus Mods**, jeśli Użytkownik go połączy: nazwę w Nexus, awatar i informację, czy ma Premium, a także tokeny dostępu, które daje nam Nexus i które przechowujemy zaszyfrowane;
- to, co Użytkownik nam przekazuje, gdy składa zgłoszenie o serwer lub prosi o pomoc;
- ustawienia pulpitu, takie jak motyw i układ, aby podążały za Użytkownikiem między urządzeniami.

### Rejestry logowań {#records}

Ze względów bezpieczeństwa i aby móc odpowiedzieć na zgodne z prawem żądanie, rejestrujemy każdą rejestrację, logowanie, nieudane logowanie i wylogowanie w panelu i przez SFTP, wraz z:

- czasem i użytą metodą;
- adresem IP Użytkownika, nazwą sieci, do której się on odnosi, i krajem, który Cloudflare wskazuje dla tego adresu;
- przeglądarką, systemem operacyjnym i losowym identyfikatorem, który przechowujemy w pliku cookie, aby odróżnić jedną przeglądarkę od drugiej.

Te rejestry przechowujemy przez 365 dni. Mogą je otwierać tylko nasi starsi administratorzy, a za każdym razem, gdy któryś to robi, jest to również rejestrowane. Jeśli prawo wymaga od nas zachowania rejestrów konta, przechowujemy je do czasu, aż ten obowiązek ustanie.

## Hostowane serwery {#servers}

W przypadku serwera, który Użytkownik wynajmuje lub uruchamia w okresie próbnym, przechowujemy:

- wszystko, co jest na serwerze: pliki gry, świat, mody, ustawienia i cokolwiek Użytkownik wgra;
- kopie zapasowe, tak długo, jak mówi plan, oraz usunięte pliki, które pozostają w Koszu przez 7 dni;
- stan pracy serwera: użycie procesora, pamięci, dysku i sieci, liczbę graczy i zainstalowane mody, próbkowane co 10 minut i przechowywane przez 30 dni;
- log konsoli, zdarzenia i raporty o awariach, aby Użytkownik i my mogli zobaczyć, co poszło nie tak;
- wyniki skanowania antywirusowego wgranych plików i folderów z modami: ścieżkę pliku, rozmiar, odcisk cyfrowy i werdykt;
- kto z personelu Użytkownika co zrobił, w dzienniku aktywności serwera, przechowywanym przez 365 dni;
- kto ma w tej chwili otwarty pulpit serwera, co jest pokazywane pozostałemu personelowi serwera.

Nasz personel może otworzyć pliki, konsolę i logi serwera, aby prowadzić usługę, pomóc, gdy Użytkownik o to poprosi, zbadać nadużycie lub problem z bezpieczeństwem oraz gdy wymaga tego prawo.

### Osoby grające na hostowanym serwerze {#players}

Serwer, który hostujemy, rejestruje osoby, które na niego wchodzą. O tym, kto na nim gra i kto należy do personelu, decyduje właściciel serwera, a my przechowujemy te dane dla niego i dla zachowania bezpieczeństwa usługi:

- nazwę w Steam i SteamID oraz czas wejścia i wyjścia każdego gracza;
- czat, przechowywany przez 30 dni;
- miejsce, w którym gracze znajdują się na świecie podczas gry. Pozycje są tylko na żywo i znikają w ciągu kilku minut;
- moderację: wyciszenia, więzienia, wyrzucenia i bany, whitelistę oraz notatki, które personel pisze o graczu;
- jeśli gracz używa moda Modstoke Client, zdrowie i ekwipunek, które zgłasza jego gra.

Mogą to zobaczyć tylko właściciel i personel danego serwera oraz nasz personel. Publiczna lista serwerów pokazuje nazwę serwera i liczbę grających, nigdy to, kto gra.

Zapis wizyty jest przechowywany przez rok po jej zakończeniu. Gdy serwer zostaje usunięty, razem z nim usuwane jest wszystko, co zawierał o jego graczach.

Jeśli ktoś gra na serwerze i chce wiedzieć, co ten serwer o nim przechowuje, lub chce, by zostało to usunięte wcześniej, może zapytać właściciela serwera albo nas.

### Ember {#ember}

Ember, pomocnik na pulpicie, odpowiada za pomocą modelu działającego na naszej własnej maszynie. Pytania Użytkownika i towarzyszące im informacje o jego serwerze nie są wysyłane do zewnętrznej firmy zajmującej się AI i nie są używane do trenowania modeli.

## Mody i narzędzia {#tools}

Modstoke Manager i Loader pobierają informacje o wydaniach, katalogi i pliki do pobrania z modstoke.com oraz z Nexus Mods lub sotf-mods.com, gdy Użytkownik korzysta z tych sklepów. Te żądania zawierają adres IP Użytkownika, jak każde pobranie. Jeśli Użytkownik loguje się do Nexus Mods w Managerze, jest to sprawa między nim a Nexus.

## Darowizny i płatności {#payments}

Płatności odbywają się przez PayPal. Nigdy nie widzimy ani nie przechowujemy danych karty ani konta bankowego Użytkownika. W przypadku darowizny przechowujemy identyfikator zamówienia lub subskrypcji PayPal, kwotę, jej status i identyfikator płatnika w PayPal. Gdy ruszy płatny hosting, będziemy przechowywać to samo w przypadku planu, wraz z informacją, jaki plan i jaki serwer ta płatność obejmuje.

## Pliki cookie i to, co jest przechowywane w przeglądarce {#cookies}

Panel używa tylko tego, czego potrzebuje do działania:

- pliku cookie sesji, który utrzymuje zalogowanie, oraz tokenu chroniącego formularze;
- `modstoke_device`, losowego identyfikatora przechowywanego przez dwa lata, używanego wyłącznie w opisanych wyżej rejestrach logowań;
- ustawień pulpitu i układu okien, przechowywanych w pamięci przeglądarki;
- kopii offline pulpitu serwera, jeśli Użytkownik zainstaluje go jako aplikację. Wylogowanie ją czyści;
- subskrypcji powiadomień, jeśli Użytkownik włączy alerty. Alerty są dostarczane przez usługę push samej przeglądarki, prowadzoną przez Google, Mozillę, Apple lub Microsoft, i przychodzą zaszyfrowane.

Nie ma reklamowych plików cookie.

## Jak wykorzystujemy informacje {#use}

To, co zbieramy, wykorzystujemy, aby:

- zapewniać konta, serwery i pobrania oraz naprawiać je, gdy się psują;
- dbać o bezpieczeństwo osób i serwerów: powstrzymywać nadużycia, oszustwa i włamania oraz egzekwować nasz [regulamin](/terms/);
- informować Użytkownika o jego serwerze, na przykład o końcu okresu próbnego lub problemie z nim;
- przyjmować płatności i darowizny oraz prowadzić rejestry, których prawo wymaga od organizacji non-profit;
- rozumieć, w sumarycznych liczbach, jak usługa jest używana, abyśmy mogli ją ulepszać.

Tam, gdzie prawo wymaga podstawy prawnej, naszymi podstawami są: wykonanie naszej umowy z Użytkownikiem, nasz prawnie uzasadniony interes w prowadzeniu bezpiecznej usługi, zgoda Użytkownika, gdy o nią prosimy, oraz nasze obowiązki prawne.

## Komu to przekazujemy {#sharing}

Nie sprzedajemy danych osobowych. Przekazujemy je tylko:

- usługom, które pomagają nam prowadzić Modstoke, w tym celu: Cloudflare (dostarczanie, ochrona i liczenie odwiedzin), InterServer (centrum danych w New Jersey, w którym znajduje się nasza maszyna), PayPal (płatności), Discord i Steam (logowanie i łączenie kont) oraz Nexus Mods i sotf-mods.com (gdy Użytkownik korzysta z ich sklepów);
- właścicielowi i personelowi serwera, w zakresie graczy i aktywności na tym serwerze;
- gdy wymaga tego prawo lub gdy jest to potrzebne do ochrony czyjegoś bezpieczeństwa lub naszych praw;
- organizacji, która przejmie Modstoke, na podstawie tej samej polityki.

## Jak długo to przechowujemy {#retention}

| Co | Jak długo |
|---|---|
| Dane konta | Do czasu, gdy poprosi się nas o usunięcie konta |
| Rejestry logowań | 365 dni |
| Próbki użycia serwera | 30 dni |
| Czat na hostowanym serwerze | 30 dni |
| Pozycje graczy | Minuty |
| Sesje graczy na hostowanym serwerze | Rok po zakończeniu sesji |
| Rejestry moderacji, whitelista i notatki personelu | Do czasu, aż personel serwera je usunie |
| Wszystko, co hostowany serwer zawiera o swoich graczach | Usuwane wraz z usunięciem serwera |
| Dziennik aktywności serwera | 365 dni |
| Kopie zapasowe | 3, 7 lub 30 dni, zależnie od planu |
| Kosz na serwerze | 7 dni |
| Pliki serwera po jego zakończeniu | 14 dni, potem usuwane |
| Świat z okresu próbnego po usunięciu serwera | 30 dni |
| Rejestry darowizn i płatności | Tak długo, jak wymagają tego przepisy podatkowe i rachunkowe |

Wszystko, co objęte jest blokadą prawną, jest przechowywane do czasu jej zakończenia.

## Zabezpieczenia {#security}

Wszystko przesyłane jest przez HTTPS. Serwer każdego klienta działa we własnej przestrzeni, oddzielnie od pozostałych i od panelu. Hasła są przechowywane w postaci skrótów (hash), a tokeny połączonych kont zaszyfrowane. Dostęp do rejestrów logowań jest ograniczony i rejestrowany. Żaden system nie jest doskonale bezpieczny, a jeśli naruszenie dotknie informacji Użytkownika, powiadomimy go.

## Wybory i prawa Użytkownika {#rights}

Można to zrobić samodzielnie tam, gdzie pozwala na to panel, albo poprosić nas o to:

- uzyskanie kopii informacji, które o Użytkowniku przechowujemy;
- poprawienie ich albo usunięcie konta wraz z tym, co się z nim wiąże;
- odłączenie Discorda, Steam lub Nexus Mods;
- pobranie świata z panelu w dowolnej chwili;
- wyłączenie powiadomień lub wyczyszczenie tego, co jest przechowywane w przeglądarce.

Prosimy o e-mail na adres legal@openacai.com lub o pytanie na [naszym Discordzie](https://discord.gg/T2Tjh5ECS). Możemy potrzebować potwierdzenia tożsamości i możemy zachować to, czego wymaga prawo lub co jest nam potrzebne do zwalczania nadużyć. W zależności od miejsca zamieszkania prawo może przyznawać Użytkownikowi dodatkowe uprawnienia, w tym prawo do złożenia skargi do organu ochrony danych. Uszanujemy je.

## Gdzie to jest przechowywane {#where}

Nasza maszyna znajduje się w New Jersey w Stanach Zjednoczonych i tam przetwarzane są informacje Użytkownika. Jeśli Użytkownik korzysta z Modstoke z innego kraju, jego informacje trafiają do Stanów Zjednoczonych.

## Dzieci {#children}

Modstoke nie jest przeznaczony dla dzieci poniżej 13 lat i nie zbieramy świadomie ich danych. Jeśli ktoś uważa, że dziecko poniżej 13 lat ma konto, prosimy o informację, a je usuniemy. Osoby w wieku 13–17 lat potrzebują zgody rodzica lub opiekuna prawnego.

## Rzeczy, które wciąż budujemy {#planned}

Niektóre rzeczy, które zapowiedzieliśmy, jeszcze nie działają. Gdy się pojawią, będą działać w ten sposób, a stronę zaktualizujemy przed każdym uruchomieniem:

- **Płatne plany.** Płatność przyjmie PayPal. Będziemy przechowywać rejestry opisane w części Darowizny i płatności.
- **E-mail.** Dziś nie wysyłamy e-maili. Gdy zaczniemy, będą dotyczyć konta i serwera Użytkownika, a nie marketingu.
- **Kopie zapasowe w chmurze Użytkownika.** Jeśli Użytkownik połączy Google Drive lub OneDrive, zapiszemy udzielony dostęp i będziemy tam wysyłać kopie zapasowe, i nic poza tym.
- **Kanały Discorda dla serwera.** Jeśli Użytkownik je włączy, ogłoszenia jego serwera, a także czat, jeśli zostanie połączony, będą publikowane na Discordzie.
- **Sklep z modami, motywami i aplikacjami.** Zainstalowanie czegoś poinformuje jego źródło, że nastąpiło pobranie, jak każde pobranie.
- **Głos i radio w większych planach.** Powiemy dokładnie, co jest, a co nie jest nagrywane, zanim zostaną udostępnione.

## Zmiany {#changes}

Gdy zmieniamy tę politykę, publikujemy tutaj nową wersję z jej datą. Jeśli zmiana ma znaczenie, ogłaszamy ją na naszym Discordzie lub w panelu, zanim wejdzie w życie.

## Kontakt {#contact}

Prosimy o e-mail na adres legal@openacai.com lub o pytanie na [naszym Discordzie](https://discord.gg/T2Tjh5ECS). OpenACAI Inc, Farmington, Missouri, United States.
