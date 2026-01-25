import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, getUserProfile } from '@/lib/auth';

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/č/g, 'c')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function ensureCategory(slug: string, name: string, description?: string, image_url?: string, order_index = 0) {
  const { data: existing } = await supabase
    .from('shop_categories')
    .select('*')
    .eq('slug', slug)
    .single();
  if (existing) return existing;
  const { data } = await supabase
    .from('shop_categories')
    .insert({ slug, name, description, image_url, order_index, active: true })
    .select()
    .single();
  return data;
}

async function ensureProduct(category_id: string | null, name: string, description?: string, price = 0, image_url?: string, name_sl?: string, description_sl?: string) {
  const slug = slugify(name);
  const { data: existing } = await supabase
    .from('shop_products')
    .select('*')
    .eq('slug', slug)
    .single();
  if (existing) {
    // Update with Slovenian translations if missing
    if (name_sl && !existing.name_sl) {
      await supabase
        .from('shop_products')
        .update({ name_sl, description_sl })
        .eq('id', existing.id);
    }
    return existing;
  }
  const { data } = await supabase
    .from('shop_products')
    .insert({ slug, name, description, category_id, price, image_url, active: true, stock: 10, name_sl, description_sl })
    .select()
    .single();
  return data;
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: profile } = await getUserProfile(user.id);
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // 1) Categories
  const catEndurance = await ensureCategory('4endurance-nduranz-pro', '4Endurance / Nduranz Pro', 'Najmočnejše formule za energijo, vzdržljivost, hormonsko ravnovesje in optimalno delovanje telesa.', undefined, 0);
  const catGobe = await ensureCategory('medicinske-gobe', 'Medicinske gobe', 'Moč funkcionalnih gob za imunsko stabilnost, fokus, dihanje in regeneracijo.', undefined, 1);
  const catHomeo = await ensureCategory('homeopatija', 'Homeopatija', 'Subtilna, a močna naravna podpora biološkemu ravnovesju telesa.', undefined, 2);
  const catZelisca = await ensureCategory('zeliscni-pripravki', 'Zeliščni pripravki slovenskih zeliščarjev', 'Moč lokalne tradicije, ročnega znanja in čistih slovenskih zelišč.', undefined, 3);
  const catCBD = await ensureCategory('green-spirit', 'Green Spirit – Premium CBD linija', 'Lokalno, laboratorijsko preverjeno in najvišje kakovosti.', undefined, 4);
  const catSvet = await ensureCategory('svetovanje', 'Individualno svetovanje & Personalizirani protokoli', 'Osebno svetovanje in protokoli po meri.', undefined, 5);

  // 2) Products from outline
  const enduranceProducts = [
    ['Alpha Male', 'Hormonska moč, libido, vitalnost', 'Alpha Male – Moč in vitalnost', 'Naravni kompleks za hormonsko ravnovesje, libido in moško vitalnost. Vsebuje testosteron-podpirajoče snovi za energijo in zmogljivost.', 34.99],
    ['Fusion', 'Napredna regeneracija po fizični in mentalni obremenitvi', 'Fusion – Regeneracija in okrevanje', 'Napredna formula za hitro okrevanje po fizični in mentalni obremenitvi. Podpira mišično regeneracijo in energetski sistem.', 39.99],
    ['Immunu', 'Močan imunski super-booster', 'Immunu – Imunska zaščita', 'Super-booster za imunski sistem s sinergističnimi naravnimi snovmi. Podpira telo pri obrambi pred zunanjimi grožnjami.', 29.99],
    ['Cardio Max', 'Podpora srcu, ožilju in pretoku', 'Cardio Max – Srčna in žilna podpora', 'Celovita podpora za zdravo srce, žile in krvni pretok. Vsebuje snovi za elastičnost žil in optimalen krvni pritisk.', 34.99],
    ['Flex', 'Sklepi, hrustanec, vezivna tkiva', 'Flex – Sklepi in mobilnost', 'Naravna podpora za zdrave sklepe, hrustanec in vezivna tkiva. Idealna za aktivne ljudi in športnike.', 32.99],
    ['Loaded', 'Energijski kompleks za visoko zmogljivost', 'Loaded – Energija in zmogljivost', 'Kompleksna formula za trajno energijo in visoko zmogljivost. Brez sintetičnih stimulantov, samo naravna moč.', 36.99],
    ['Adaptogene Fuse', 'Fokus, stresna odpornost, adaptacija', 'Adaptogene Fuse – Fokus in odpornost', 'Moč adaptogenov za fokus, jasnost uma in stresno odpornost. Pomaga telesu pri prilagajanju na stres.', 38.99],
    ['Omega 3', 'Čiste EPA/DHA maščobne kisline', 'Omega 3 – Srčne in možganske maščobe', 'Čiste EPA/DHA maščobne kisline za zdravo srce, možgane in vnetne odzive. Vrhunska kvaliteta iz naravnih virov.', 24.99],
    ['Cink', 'Hormoni, celice, imunski sistem', 'Cink – Imunska in hormonska podpora', 'Esencialni mineral za hormone, celično delovanje in imunski sistem. Ključen za moško zdravje in vitalnost.', 16.99],
    ['Vitamin D3', 'Temelj hormonske in imunske stabilnosti', 'Vitamin D3 – Sončni vitamin', 'Temelj hormonske in imunske stabilnosti. Podpira absorpcijo kalcija in celično delovanje. Idealen za zimske mesece.', 18.99],
    ['Magnezij (bisglicinat, malat)', 'Regeneracija, mišice, živčni sistem', 'Magnezij – Regeneracija in sprostitev', 'Visoko absorpcijski magnezij za regeneracijo, mišično funkcijo in živčni sistem. Pomaga pri sprostitvi in boljšem spanju.', 22.99],
    ['Vitamin C (liposomalni)', 'Močan antioksidant in imunska podpora', 'Vitamin C – Antioksidativna zaščita', 'Liposomalni vitamin C za maksimalno absorpcijo. Antioksidant in imunska podpora za zdravo telo.', 26.99],
    ['Vitamin B kompleks', 'Energija in živčni sistem', 'Vitamin B – Energija in živci', 'Kompleten B kompleks za energijo, živčni sistem in presnovo. Podpira telo pri stresu in obremenitvi.', 19.99],
    ['Multivitamini (klasični/liposomalni)', 'Celostna podpora', 'Multivitamini – Celovita podpora', 'Celovita formula z vsemi ključnimi vitamini in minerali. Osnova za zdravo prehrano in vitalnost.', 28.99],
    ['Elektroliti', 'Hidracija in ravnovesje elektrolitov', 'Elektroliti – Hidracija in ravnovesje', 'Naravni elektroliti za optimalno hidraciju in ravnovesje minerala. Idealni za aktivne ljudi in športnike.', 14.99],
    ['Kolagen (tip I & III)', 'Podpora tkivom in koži', 'Kolagen – Kožna in vezivna tkiva', 'Čist kolagen za zdrave kože, sklepe in vezivna tkiva. Podpira elastičnost in regeneracijo.', 29.99],
    ['Selen', 'Antioksidant, imunomodulacija', 'Selen – Antioksidativna zaščita', 'Esencialni mineral za antioksidativno zaščito in imunsko modulacijo. Podpira ščitnico in celično zdravje.', 15.99],
    ['Probiotiki', 'Črevesni mikrobiom', 'Probiotiki – Črevesno zdravje', 'Živahni probiotiki za zdrav črevesni mikrobiom. Podpira prebavo, imunski sistem in splošno zdravje.', 27.99],
    ['Kalcij+Magnezij+Cink', 'Mineralni kompleks', 'Mineralni kompleks – Kosti in mišice', 'Sinergistični mineralni kompleks za kosti, mišice in splošno zdravje. Idealen za aktivne ljudi.', 21.99]
  ];
  for (const [name, desc, name_sl, desc_sl, price] of enduranceProducts) {
    await ensureProduct(catEndurance?.id || null, String(name), String(desc), Number(price), undefined, String(name_sl), String(desc_sl));
  }

  const gobe = [
    ['Reishi', 'Ravnovesje, imunska modulacija', 'Reishi – Ravnovesje in mir', 'Kraljica gob za globoko regeneracijo, imunsko modulacijo in čustveno ravnovesje. Tradicionalna goba za mir in vitalnost.', 32.99],
    ["Lion's Mane", 'Fokus, spomin, nevroregeneracija', "Lion's Mane – Možganska moč", 'Goba za nevroregeneracijo, fokus in spomin. Podpira jasnost uma in kognitivne funkcije. Idealna za študente in profesionalce.', 38.99],
    ['Cordyceps', 'Vzdržljivost, energija, pljuča', 'Cordyceps – Energija in vzdržljivost', 'Goba za naravno energijo, vzdržljivost in optimalno dihanje. Idealna za aktivne ljudi in športnike.', 35.99],
    ['Chaga', 'Antioksidativna zaščita', 'Chaga – Antioksidativna zaščita', 'Moč črnega zlata – gobe Chaga za antioksidativno zaščito in imunsko podporo. Tradicionalna goba za vitalnost.', 42.99],
    ['Šiitake', 'Presnova, vitalnost', 'Šiitake – Vitalnost in imunska podpora', 'Goba za zdravo presnovo, imunsko stabilnost in splošno vitalnost. Bogata z naravnimi vitamini in minerali.', 28.99],
    ['Maitake', 'Presnova, vitalnost', 'Maitake – Tanec življenja', 'Goba za harmonijo, imunsko modulacijo in energijo. Tradicionalna goba za celovito zdravje.', 31.99]
  ];
  for (const [name, desc, name_sl, desc_sl, price] of gobe) {
    await ensureProduct(catGobe?.id || null, String(name), String(desc), Number(price), undefined, String(name_sl), String(desc_sl));
  }

  const homeo = [
    ['Homeopatske kapljice', 'Za hormonski red, stres in stabilnost', 'Homeopatske kapljice – Subtilna podpora', 'Tradicionalne homeopatske kapljice za hormonski red, stresno odpornost in čustveno stabilnost. Nežna, a učinkovita podpora.', 24.99],
    ['Homeopatske pilule', 'Za subtilne uravnotežitve', 'Homeopatske pilule – Energijska uravnotežitev', 'Čiste homeopatske pilule za subtilne uravnotežitve telesa in uma. Idealne za občutljive osebe.', 19.99],
    ['Informirana homeopatska voda', 'Nežna podpora biološkim procesom', 'Informirana voda – Biološka podpora', 'Informirana homeopatska voda za nežno podporo naravnim biološkim procesom. Energijsko bogata in učinkovita.', 22.99]
  ];
  for (const [name, desc, name_sl, desc_sl, price] of homeo) {
    await ensureProduct(catHomeo?.id || null, String(name), String(desc), Number(price), undefined, String(name_sl), String(desc_sl));
  }

  const zelisca = [
    ['Zeliščni macerati', 'Ročno izdelano, energijsko bogato', 'Zeliščni macerati – Moč narave', 'Ročno izdelani macerati iz čistih slovenskih zelišč. Energijsko bogati in polni naravne moči. Tradicionalni pristop.', 28.99],
    ['Tinkture', 'Tradicionalni izvlečki slovenskih zelišč', 'Tinkture – Koncentrirana moč', 'Tradicionalne tinkture iz slovenskih zelišč. Koncentrirana moč za zdravje in vitalnost. Izdelane po starem znanju.', 26.99],
    ['Mazila in terapevtski balzami', 'Podpora regeneraciji in koži', 'Mazila – Regeneracija in nega', 'Naravne mazile in balzami za regeneracijo, nego kože in terapevtsko podporo. Mehka, učinkovita nega.', 32.99],
    ['Oljni ekstrakti', 'Visoka biološka uporabnost', 'Oljni ekstrakti – Biološka uporabnost', 'Čisti oljni ekstrakti za maksimalno absorpcijo in učinkovitost. Idealni za vsakodnevno uporabo.', 29.99],
    ['Adaptogeni iz slovenskih zelišč', 'Stresna odpornost in fokus', 'Adaptogeni – Stresna odpornost', 'Moč slovenskih adaptogenov za stresno odpornost, fokus in energijo. Naravna podpora za sodobni tempo.', 34.99]
  ];
  for (const [name, desc, name_sl, desc_sl, price] of zelisca) {
    await ensureProduct(catZelisca?.id || null, String(name), String(desc), Number(price), undefined, String(name_sl), String(desc_sl));
  }

  const cbd = [
    ['CBD olja (brez THC)', 'Različne koncentracije, premium kvaliteta', 'CBD olja – Naravna podpora', 'Premium CBD olja brez THC v različnih koncentracijah. Laboratorijsko preverjeno, najvišje kakovosti. Lokalno proizvedeno.', 45.99],
    ['CBD izolat (99%)', 'Čista, natančna podpora', 'CBD izolat – Čista moč', 'Čist CBD izolat (99%) za natančno in učinkovito podporo. Idealen za tiste, ki želijo čisto CBD brez drugih kanabinoidov.', 52.99],
    ['CBD premium praline', 'Gourmet praline z vrhunskim CBD-jem', 'CBD praline – Okusna uživanja', 'Gourmet praline z vrhunskim CBD-jem. Okusna in učinkovita kombinacija za tiste, ki cenijo kakovost in okus.', 38.99],
    ['CBD topikali', 'Mazila, balzami in kreme', 'CBD topikali – Lokalna nega', 'Naravne mazile, balzami in kreme z CBD-jem za lokalno nego in regeneracijo. Idealne za kožo in mišice.', 34.99]
  ];
  for (const [name, desc, name_sl, desc_sl, price] of cbd) {
    await ensureProduct(catCBD?.id || null, String(name), String(desc), Number(price), undefined, String(name_sl), String(desc_sl));
  }

  await ensureProduct(catSvet?.id || null, 'Osebno svetovanje', 'Personalizirani protokoli in prilagojene kombinacije', 0, undefined, 'Osebno svetovanje – Prilagojeni protokoli', 'Individualno svetovanje in personalizirani protokoli za vašo specifično situacijo in zdravstvene cilje.');

  return NextResponse.json({ success: true, message: 'Shop seeded with complete Slovenian translations and prices' });
}

export async function GET(request: NextRequest) {
  // Convenience in dev
  return POST(request);
}
