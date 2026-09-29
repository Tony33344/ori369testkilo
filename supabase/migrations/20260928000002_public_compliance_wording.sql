BEGIN;

UPDATE services SET
  name = 'Prvi pregled + meritev s Physio Motio + osebni načrt gibanja',
  description = 'Ocena drže in gibanja s sistemom Physio Motio ter ročnim pregledom. Sledi osebni načrt vadbe, prilagojen vašim ciljem.'
WHERE slug = 'physio-motio-pregled';

UPDATE services SET name = 'Elektrostimulacija', description = 'Električni impulzi povzročajo nadzorovano in posamezniku prilagojeno aktivacijo mišic.'
WHERE slug = 'elektrostimulacija';

UPDATE services SET name = 'Limfna drenaža trebuha ali brazilska Madeiro masaža'
WHERE slug = 'limfna-drenaza-trebuha-ali-brazilska-madeiro-terapija';

UPDATE services SET description = 'Začnemo z uvodnim pogovorom in osebnim načrtom, prilagojenim vašemu urniku in ciljem.'
WHERE slug = 'prva-posvetovalna-obravnava';

UPDATE services SET how_it_works = E'- dnevno rutino (jutro / večer)\n- dihanje in sprostitev\n- gibanje, treninge in vaje\n- prehrano in hidracijo\n- uporabo vode\n- dogovorjeni načrt obiskov'
WHERE slug = 'prva-posvetovalna-obravnava';

UPDATE services SET name = 'TECAR obravnava', description = 'Obravnava z radiofrekvenčno energijo, pri kateri občutite prijetno globinsko toploto.'
WHERE slug = 'tecar-terapija';

UPDATE services SET name = 'Magnetna stimulacija', description = 'Magnetna stimulacija v mirnem ležečem položaju.'
WHERE slug = 'magnetna-terapija';

UPDATE services SET description = 'Magnetna indukcijska stimulacija mišic v mirnem ležečem položaju.'
WHERE slug = 'mis';

UPDATE services SET name = 'Laserska obravnava', description = 'Neinvazivna obravnava izbranega predela z lasersko svetlobo.'
WHERE slug = 'laserska-terapija';

UPDATE services SET name = 'Medi Taping', description = 'Namestitev elastičnih trakov na izbrani predel glede na želeno podporo in gibanje.'
WHERE slug = 'media-taping-terapija';

UPDATE services SET description = 'Ročna tehnika z ventuzami, ki na koži ustvarijo blag in prilagodljiv podtlak.'
WHERE slug = 'cupping';

UPDATE services SET name = 'IteraCare sprostitev', description = 'Toplotna sprostitev z napravo IteraCare, usmerjeno na izbrane predele.'
WHERE slug = 'iteracare';

UPDATE services SET description = 'Vodene dihalne vaje za umiritev in sprostitev.'
WHERE slug = 'individualno-vodeno-dihanje';

UPDATE services SET name = 'Vadba za gibljivost in sprostitev', description = 'Osebno prilagojena vadba za gibljivost, umiritev in sprostitev.'
WHERE slug = 'individualna-protibolecinska-antistresna-vadba';

UPDATE services SET description = 'Uvodna meritev drže in gibanja ter priprava osebnega načrta vadbe.'
WHERE slug = 'uvodna-3d-meritev-telesa-analiza-osebni-program';

UPDATE services SET description = 'Nežno in nadzorovano raztezanje hrbtenice v mirnem ležečem položaju.'
WHERE slug = 'platinium-dekompresijska-miza';

UPDATE services SET description = 'Kratka lokalna obravnava z nadzorovanim občutkom hladu.'
WHERE slug = 'cryoscreen';

UPDATE services SET description = 'Obravnava z udarnimi valovi; intenzivnost prilagodimo posamezniku.'
WHERE slug = 'udarni-valovi-shock-wave';

UPDATE services SET description = 'Neinvazivna obravnava izbranega predela z ultrazvočno napravo.'
WHERE slug = 'ultra-zvok';

UPDATE services SET name = 'Scalar Wave sprostitev', description = 'Mirna sprostitvena seansa ob napravi Scalar Wave.'
WHERE slug = 'scalar-wave-cosmic-communicator';

UPDATE services SET description = replace(replace(description,
  'Tacer terapija', 'TECAR obravnava'),
  'Storm terapija – miofascialna masaža', 'Storm miofascialna masaža')
WHERE slug IN ('aktivacija-paket-3-obravnave', 'osvescanje-telesa-paket-6', 'univerzum-paket-9');

UPDATE services SET description = replace(description,
  'Skalarni valovi - uravnovešanje čaker', 'Scalar Wave sprostitev')
WHERE slug = 'univerzum-paket-9';

UPDATE education_courses SET
  organizer = 'ORI 369 center za celostno počutje, pod okriljem inštituta ŠNUK. Organizacijo in prijave vodi Daša Kolar.'
WHERE slug = 'miofascial-release';

UPDATE education_courses SET
  slug = 'delavnica-sproscanja',
  title = 'Delavnica sproščanja in osebne prakse – začetni tečaj',
  subtitle = 'Praktična priprava na sprostitvene tehnike',
  short_description = 'Spoznajte osnovne tehnike umirjanja, dihanja in osebne prakse.',
  long_description = 'Program vključuje uvod v sprostitvene prakse, vodene vaje in predloge za samostojno delo. Namenjen je manjši skupini do 12 udeležencev.',
  organizer = 'ORI 369 center za celostno počutje',
  detailed_description = E'V naravnem okolju Heaven Resorta bomo izvedli izkustveno delavnico sproščanja in osebne prakse.\n\nSkozi umirjanje telesa, dihanje in vodene vaje bomo ustvarili prostor za zbranost ter praktično uporabo tehnik v vsakdanjem življenju.\n\nDelavnico vodi Evgen Valek, M.D.(M.A.), z dolgoletnimi izkušnjami pri vodenju sprostitvenih praks.',
  program_schedule = E'14:00 – Prihod in uvod\n16:00 – Priprava in vodene sprostitvene vaje\n17:00 – Osebna praksa in zaključek',
  what_youll_get = E'spoznali vodene tehnike umirjanja in dihanja\nprejeli predloge za samostojno osebno prakso\npreživeli čas v majhni skupini in mirnem okolju',
  requirements = E'Delavnica je primerna za vse, ki želijo:\n- spoznati preproste sprostitvene tehnike\n- oblikovati osebno prakso\n- nameniti čas umiritvi in zbranosti'
WHERE slug = 'reiki-iniciacija';

UPDATE education_course_sessions
SET headline = 'Delavnica sproščanja in osebne prakse z Evgenom Valekom'
WHERE course_id = (SELECT id FROM education_courses WHERE slug = 'delavnica-sproscanja');

UPDATE education_course_sessions
SET location = replace(location, 'ORI terapevtski center 369', 'ORI 369 center za celostno počutje')
WHERE location LIKE 'ORI terapevtski center 369%';

UPDATE block_translations
SET content = jsonb_set(content, '{html}', to_jsonb(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(content->>'html',
  '<h2>MotioScan – 3D Analiza Telesne Drže</h2>', '<h2>MotioScan – 3D prikaz drže in gibanja</h2>'),
  'Odkrij natančno stanje svojega telesa z inovativno 3D tehnologijo, ki v nekaj sekundah razkrije tvoje skrite asimetrije, obremenitve in neravnovesja. MotioScan je prvi korak k optimizaciji tvojega telesa in povratku v naravno ravnovesje.', 'MotioScan prikaže držo in gibanje v 3D obliki. Rezultate skupaj pregledamo in pripravimo oseben načrt gibanja.'),
  '<h2>Zakaj je MotioScan tako učinkovit?</h2>', '<h2>Zakaj izbrati meritev MotioScan?</h2>'),
  'Ker ne temelji na občutku ali vizualni oceni: naprava naredi objektivno, natančno meritev – v številkah in 3D modelu.', 'Naprava izdela vizualni prikaz meritev v številkah in 3D modelu.'),
  'Ker odkrije tisto, česar oko ne opazi: mikrozasuki, rotacije, kompenzacije, zakasnitve aktivacij, asimetrije.', 'Mikrozasuki, rotacije, kompenzacije in asimetrije so prikazani v vizualni obliki.'),
  'Ker omogoča točen terapevtski protokol: na podlagi rezultatov določimo šibke, preobremenjene in kompenzacijske mišice ter realno stanje sklepov.', 'Na podlagi prikaza pripravimo oseben načrt gibanja in vaj.'),
  'Ker lahko meriš napredek: pred → po … videno črno na belem.', 'Meritve lahko primerjate skozi čas.'),
  '<h2>Kako poteka MotioScan analiza?</h2>', '<h2>Kako poteka meritev MotioScan?</h2>'),
  '<li>Analiza neravnovesij – višinske razlike, nagibi, rotacije, zamiki, obremenitve, stabilnost.</li>', '<li>Pregled meritev – višinske razlike, nagibi, rotacije in obremenitve.</li>'),
  '<li>Razlaga rezultatov – terapevt predstavi stanje telesa.</li>', '<li>Razlaga prikaza – izvajalec predstavi merjene podatke.</li>'),
  '<li>Protokol povratka v ravnovesje – manualna korekcija, somatske vaje, stabilizacija, mobilnost, dihanje, terapija drže, terapije ORI.</li>', '<li>Osebni načrt – dogovor o gibanju, vajah in naslednjih obiskih.</li>'),
  '<li>ljudem z bolečinami (hrbet, vrat, medenica)</li>', '<li>vsem, ki želijo bolje spoznati svojo držo in gibanje</li>'),
  '<li>po poškodbah</li>', ''),
  '<li>jasno sliko telesa in skritih težav</li>', '<li>pregled drže in gibanja</li>'),
  '<li>preprečevanje poškodb</li>', '<li>pregled merjenih asimetrij in obremenitev</li>'),
  '<li>več energije, manj napetosti</li>', '<li>razlago rezultatov meritve</li>'),
  '<li>hitrejšo regeneracijo in večjo stabilnost</li>', '<li>primerljive meritve skozi čas</li>'),
  '<li>individualni terapevtski protokol</li>', '<li>oseben načrt gibanja in vaj</li>'),
  '<p>Slogan: NE UGIBAJ. IZMERI. MotioScan ti pokaže realno stanje tvojega telesa. Mi pa poskrbimo za pot nazaj v ravnovesje.</p>', '<p>NE UGIBAJ. IZMERI. MotioScan prikaže držo in gibanje v 3D. Skupaj nato pripravimo oseben načrt vadbe.</p>')),
  true)
WHERE id = '340cfbb7-5455-4874-ab3b-63da0f5b06af' AND lang = 'sl';

UPDATE block_translations
SET content = jsonb_set(content, '{html}', to_jsonb(replace(replace(replace(content->>'html',
  '5 sej fizioterapije - idealno za začetnike', '5 obiskov za postopen začetek'),
  '10 sej fizioterapije + 2 masaži - najpopularnejši', '10 obiskov + 2 masaži - priljubljen izbor'),
  '20 sej fizioterapije + 4 masaže + MotioScan analiza - celovit pristop', '20 obiskov + 4 masaže + MotioScan meritev - širši obseg')),
  true)
WHERE id = 'de1a7f5d-9ea3-4b3b-980e-9489ff1b7f75' AND lang = 'sl';

UPDATE block_translations
SET content = jsonb_set(content, '{html}', to_jsonb($cms$
<h1>Kontaktirajte nas</h1>
<p>Veseli smo, da se želite povezati z nami.</p>
<h2>Podjetje</h2>
<p>JB FIT, d.o.o. (ORI 369)</p>
<h2>Naslov</h2>
<p>Ulica škofa Maksimilijana Držečnika 11<br/>2000 Maribor, Slovenija</p>
<h2>Telefon</h2>
<p>051 302 206<br/>041 458 931</p>
<h2>Email</h2>
<p>Info@ori369.com</p>
<h2>Delovni čas</h2>
<ul>
<li>Ponedeljek–petek: 07.00–14.00 in 16.00–21.00</li>
<li>Sobota: 08.00–14.00</li>
<li>Nedelja: zaprto</li>
</ul>
$cms$::text), true)
WHERE id = '0926e5c7-4e18-4ef9-989c-a653e0b5f475' AND lang = 'sl';

COMMIT;
