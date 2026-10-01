import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, getUserProfile } from '@/lib/auth';

function titleCase(slug: string) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: profile } = await getUserProfile(user.id);
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || 'home';

  // Ensure page exists
  let { data: page } = await supabase.from('pages').select('*').eq('slug', slug).single();
  if (!page) {
    const { data: newPage } = await supabase
      .from('pages')
      .insert({ slug, title: titleCase(slug), status: 'published' })
      .select()
      .single();
    page = newPage;
  }

  // MotioScan landing content (rich text)
  if (slug === 'motioscan') {
    const html = `
      <h1>MotioScan – 3D Analiza Telesne Drže</h1>
      <p><strong>NE UGIBAJ. IZMERI.</strong></p>
      <p>Odkrij natančno stanje svojega telesa z inovativno 3D tehnologijo, ki v nekaj sekundah razkrije vaše skrite asimetrije, obremenitve in neravnovesja. MotioScan je prvi korak k optimizaciji vašega telesa in povratku v naravno ravnovesje.</p>
      <h2>Kaj je MotioScan?</h2>
      <p>MotioScan (Moti Physio) je napredna 3D naprava za natančno oceno telesne drže, ki s pomočjo vizualnih markerjev in računalniške analitike zajame:</p>
      <ul>
        <li>24 ključnih anatomskih točk</li>
        <li>več kot 87 mišičnih asimetrij</li>
        <li>rotacije, nagibe in nepravilne obremenitve</li>
        <li>odstopanja hrbtenice, medenice in lopatic</li>
        <li>statično in dinamično stabilnost</li>
      </ul>
      <p><em>Brez sevanja. Brez bolečin. Brez ugibanja. Samo natančni podatki.</em></p>
      <h2>Zakaj je MotioScan tako učinkovit?</h2>
      <ul>
        <li><strong>Ker ne temelji na občutku ali vizualni oceni:</strong> naprava naredi objektivno, natančno meritev – v številkah in 3D modelu.</li>
        <li><strong>Ker odkrije tisto, česar oko ne opazi:</strong> mikrozasuki, rotacije, kompenzacije, zakasnitve aktivacij, asimetrije.</li>
        <li><strong>Ker omogoča točen terapevtski protokol:</strong> na podlagi rezultatov določimo šibke, preobremenjene in kompenzacijske mišice ter realno stanje sklepov.</li>
        <li><strong>Ker lahko meriš napredek:</strong> pred → po … videno črno na belem.</li>
      </ul>
      <h2>Kako poteka MotioScan analiza?</h2>
      <ol>
        <li><strong>Scan (30–60 sekund)</strong> – snemanje poteka stoje, naravno, brez posebne priprave.</li>
        <li><strong>3D model</strong> – sistem izriše vašo držo v digitalnem formatu.</li>
        <li><strong>Analiza neravnovesij</strong> – višinske razlike, nagibi, rotacije, zamiki, obremenitve, stabilnost.</li>
        <li><strong>Razlaga rezultatov</strong> – terapevt predstavi stanje telesa.</li>
        <li><strong>Protokol povratka v ravnovesje</strong> – manualna korekcija, somatske vaje, stabilizacija, mobilnost, dihanje, terapija drže, terapije ORI.</li>
      </ol>
      <h2>Komu je namenjen?</h2>
      <ul>
        <li>športnikom</li>
        <li>ljudem z bolečinami (hrbet, vrat, medenica)</li>
        <li>po poškodbah</li>
        <li>sedentarno obremenjenim</li>
        <li>vsem, ki želijo optimizirati držo, dih in gibanje</li>
      </ul>
      <h2>Kaj pridobiš?</h2>
      <ul>
        <li>jasen prikaz drže in gibanja</li>
        <li>pregled asimetrij in obremenitev</li>
        <li>osebni načrt gibanja in vaj</li>
        <li>razlago rezultatov meritve</li>
        <li>primerljive meritve skozi čas</li>
      </ul>
      <p><strong>Slogan:</strong> NE UGIBAJ. IZMERI. MotioScan prikaže držo in gibanje v 3D. Skupaj nato pripravimo oseben načrt vadbe.</p>
      <p><a href="/rezervacija?package=motioscan" style="display:inline-block;padding:12px 18px;background:#00B5AD;color:#fff;border-radius:8px;text-decoration:none">Naroči svoj termin</a></p>
    `;

    // Create section
    const { data: section, error: secErr } = await supabase
      .from('sections')
      .insert({ page_id: page.id, type: 'richText', order_index: 0, visible: true, settings: {} })
      .select()
      .single();
    if (secErr) return NextResponse.json({ error: secErr.message }, { status: 500 });

    // Create block
    const { data: block, error: blkErr } = await supabase
      .from('blocks')
      .insert({ section_id: section.id, type: 'text', order_index: 0, content: {} })
      .select()
      .single();
    if (blkErr) return NextResponse.json({ error: blkErr.message }, { status: 500 });

    // Insert translation for Slovenian
    const { error: trErr } = await supabase
      .from('block_translations')
      .insert({ block_id: block.id, lang: 'sl', content: { html } });
    if (trErr) return NextResponse.json({ error: trErr.message }, { status: 500 });

    // Ensure a corresponding service exists so it's bookable
    const { data: existingService } = await supabase
      .from('services')
      .select('id')
      .eq('slug', 'motioscan')
      .single();

    if (!existingService) {
      const { error: svcErr } = await supabase
        .from('services')
        .insert({
          name: 'MotioScan – 3D analiza telesne drže',
          slug: 'motioscan',
          description: 'Napredna 3D analiza telesne drže. Ne ugibaj. Izmeri.',
          duration: 60,
          price: 0,
          is_package: false,
          active: true,
        });
      if (svcErr) return NextResponse.json({ error: svcErr.message }, { status: 500 });
    }
  }

  if (!page) return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });

  // Create a simple richText section with one block for the About page
  if (slug === 'o-nas') {
    const html = `
      <h1>O nas</h1>
      <p>Spoznajte ORI 369 – center za celostno počutje.</p>
      <p>V ORI 369 tehnologijo, ročne tehnike, sprostitev in gibanje povežemo v oseben načrt.</p>
      <h2>Naša misija</h2>
      <p>Ustvariti miren prostor za gibanje, sprostitev in skrb za vsakdanje počutje.</p>
      <h2>Naša vizija</h2>
      <p>Razvijati pregleden in posamezniku prilagojen pristop k wellnessu.</p>
      <h2>Naše vrednote</h2>
      <p>Pozornost, strokovnost, integriteta in spoštovanje posameznika.</p>
      <h2>Naša ekipa</h2>
      <p>Izkušeni izvajalci vas vodijo skozi dogovorjene obravnave, gibanje in sprostitvene prakse.</p>
    `;

    // Create section
    const { data: section, error: secErr } = await supabase
      .from('sections')
      .insert({ page_id: page.id, type: 'richText', order_index: 0, visible: true, settings: {} })
      .select()
      .single();
    if (secErr) return NextResponse.json({ error: secErr.message }, { status: 500 });

    // Create block
    const { data: block, error: blkErr } = await supabase
      .from('blocks')
      .insert({ section_id: section.id, type: 'text', order_index: 0, content: {} })
      .select()
      .single();
    if (blkErr) return NextResponse.json({ error: blkErr.message }, { status: 500 });

    // Insert translation for Slovenian
    const { error: trErr } = await supabase
      .from('block_translations')
      .insert({ block_id: block.id, lang: 'sl', content: { html } });
    if (trErr) return NextResponse.json({ error: trErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  // Convenience: allow GET to trigger seed in dev
  return POST(request);
}
