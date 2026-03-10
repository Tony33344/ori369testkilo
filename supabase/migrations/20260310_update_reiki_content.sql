-- Run this SQL in Supabase SQL Editor to add detailed content for Reiki course
-- Go to: https://supabase.com/dashboard/project/kbmclkpqjbdmnevnxmfa/sql

-- Update Reiki course with detailed content
UPDATE education_courses SET
  detailed_description = 'V čudovitem naravnem okolju Heaven Resorta bomo izvedli Karuna Reiki iniciacijo 1. stopnje, ki odpira vrata globljemu energijskemu zaznavanju, zdravljenju in notranji transformaciji.

Program je zasnovan kot izkustvena delavnica, kjer se skozi umirjanje telesa in uma postopno odpre prostor za sprejem Reiki energije ter njeno zavestno uporabo v vsakdanjem življenju.

Delavnico vodi Evgen Valek, doktor alternativne medicine in Grand Master Karuna Reiki, z dolgoletnimi izkušnjami na področju energijskega zdravljenja in iniciacij.',
  program_schedule = '14:00 – Prihod in uvod
Predstavitev Reiki sistema in priprava na iniciacijo

15:00 – Energijska priprava
Voden proces sproščanja, dihanje in aktivacija zaznavanja energije

16:00 – Karuna Reiki iniciacija
Prenos in odpiranje energijskega kanala

17:00 – Praktične vaje
Položaji rok, delo v parih in občutenje energijskega pretoka

18:30 – Integracija in zaključek
Vprašanja, smernice za nadaljnjo prakso in podelitev certifikatov

19:00 – Zaključek programa',
  what_youll_get = 'prejeli Karuna Reiki iniciacijo 1. stopnje
spoznali osnovne principe in filozofijo Reiki sistema
osvojili položaje rok za samozdravljenje in delo z drugimi
razvijali občutek za energijski pretok in subtilno zaznavanje
spoznali osnovne metode energijske higiene in zaščite
izvedli praktične vaje energijskega zdravljenja
prejeli certifikat Karuna Reiki 1. stopnje',
  requirements = 'Ta iniciacija je primerna za vse, ki želijo:
- poglobiti stik z energijo
- razviti sposobnost energijskega zdravljenja
- podpreti svoje notranje ravnovesje in zavestni razvoj',
  image_url_2 = 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80',
  image_url_3 = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
WHERE slug = 'reiki-iniciacija';
