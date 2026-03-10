'use client';

import { Facebook, Instagram, Youtube, ExternalLink, Star } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { companyData } from '@/lib/companyData';
import Link from 'next/link';

const socialLinks = [
  {
    name: 'Facebook - Jernej Babij',
    url: 'https://www.facebook.com/jernej.babij/',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    description: 'Sledite Jerneju na Facebooku',
    followers: '',
  },
  {
    name: 'Facebook - Izkoristi Potencial',
    url: 'https://www.facebook.com/izkoristipotencial/',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    description: 'Stran Izkoristi Potencial',
    followers: '',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/jernej_power/',
    icon: Instagram,
    color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500',
    description: 'Oglejte si naše zgodbe in fotografije',
    followers: '',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@jernej_power',
    icon: Youtube,
    color: 'bg-red-600 hover:bg-red-700',
    description: 'Glejte naše video vsebine in izobraževanja',
    followers: '',
  },
];

const youtubeVideos = [
  {
    title: 'Ledeni potop Bled',
    url: 'https://youtu.be/y_tb37LPCsI?si=7Z279eNL44zA85gG',
    thumbnail: 'https://img.youtube.com/vi/y_tb37LPCsI/maxresdefault.jpg',
  },
  {
    title: 'Podcast Zavedanje',
    url: 'https://youtu.be/WyeXvVrqP14?si=hOjxV7bwy-djVp7k',
    thumbnail: 'https://img.youtube.com/vi/WyeXvVrqP14/maxresdefault.jpg',
  },
  {
    title: 'Dihalna tehnika',
    url: 'https://youtu.be/CnZq-ku-Kfs?si=CbDQcOt8OD8NFefi',
    thumbnail: 'https://img.youtube.com/vi/CnZq-ku-Kfs/maxresdefault.jpg',
  },
  {
    title: 'Zdravi recepti',
    url: 'https://youtu.be/o29rKbc28xY?si=MsghaITAudyaWMGr',
    thumbnail: 'https://img.youtube.com/vi/o29rKbc28xY/maxresdefault.jpg',
  },
];

const mediaGallery = [
  {
    url: 'https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/media/tvslo1.jpg',
    title: 'TV Slovenija',
    description: 'Nastop na TV Slovenija',
  },
  {
    url: 'https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/media/tvslo1%20prvic.jpg',
    title: 'TV SLO - Prvi nastop',
    description: 'Prvi nastop na TV Slovenija',
  },
  {
    url: 'https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/media/tanja%20pia%20inm%20boris%20vene.jpg',
    title: 'Tanja, Pia in Boris Vene',
    description: 'S Tanjo, Pio in Borisom Venetom',
  },
  {
    url: 'https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/media/snemanje%20tednik%20slo%201.jpg',
    title: 'Snemanje Tednik SLO 1',
    description: 'Snemanje za Tednik na SLO 1',
  },
  {
    url: 'https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/media/potop%20bohinj.jpg',
    title: 'Potop Bohinj',
    description: 'Ledeni potop na Bohinju',
  },
  {
    url: 'https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/media/petra%20skarja%20pisateljica.jpg',
    title: 'Petra Škarja - Pisateljica',
    description: 'S pisateljico Petro Škarja',
  },
  {
    url: 'https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/media/izvir%20cetine.jpg',
    title: 'Izvir Cetine',
    description: 'Ekspedicija na izvir Cetine',
  },
  {
    url: 'https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/media/boris%20vene.jpg',
    title: 'Boris Vene',
    description: 'Z Borisom Venetom',
  },
];

const partnerLinks = [
  {
    name: 'Wolfpack.si',
    url: 'https://wolfpack.si',
    description: 'Ekspedicije v naravo, ledene kopeli in dihalne vaje',
  },
];

export default function MediaPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('media.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('media.subtitle')}
            </p>
          </div>

          {/* Social Media Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-[#00B5AD] rounded"></span>
              {t('media.socialMedia')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`${social.color} p-6 text-white`}>
                    <social.icon size={48} className="mb-2" />
                    <h3 className="text-xl font-bold">{social.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{social.description}</p>
                    <span className="inline-flex items-center text-[#00B5AD] font-semibold">
                      Sledite nam <ExternalLink size={16} className="ml-2" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Google Reviews Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-[#00B5AD] rounded"></span>
              Google Ocene
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
                    alt="Google" 
                    className="h-8"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="text-yellow-400 fill-current" size={24} />
                      ))}
                    </div>
                    <p className="text-gray-600">5.0 ocena na podlagi 50+ ocen</p>
                  </div>
                </div>
                <a
                  href={companyData.googleMaps.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#00B5AD] text-white rounded-lg hover:bg-[#009891] transition-colors flex items-center gap-2"
                >
                  Oglejte si vse ocene
                  <ExternalLink size={18} />
                </a>
              </div>
              
              <p className="text-gray-600">
                Naši klienti nas ocenjujejo z najvišjimi ocenami. Preberite njihove izkušnje in mnenja na Google Maps.
              </p>
            </div>
          </section>

          {/* YouTube Videos Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-[#00B5AD] rounded"></span>
              YouTube Videoposnetki
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {youtubeVideos.map((video, index) => (
                <a
                  key={index}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gray-200 relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <Youtube size={64} className="text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900">{video.title}</h3>
                    <span className="inline-flex items-center text-[#00B5AD] text-sm mt-2">
                      Oglej si video <ExternalLink size={14} className="ml-1" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Media Gallery Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-[#00B5AD] rounded"></span>
              Galerija
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mediaGallery.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                    <p className="text-gray-600 text-xs mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Partners Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-[#00B5AD] rounded"></span>
              Partnerji in Projekti
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnerLinks.map((partner, index) => (
                <a
                  key={index}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex items-center gap-4"
                >
                  <div className="p-3 bg-[#00B5AD]/10 rounded-lg">
                    <ExternalLink className="text-[#00B5AD]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{partner.name}</h3>
                    <p className="text-gray-600 text-sm">{partner.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Contact for Media */}
          <section className="bg-gradient-to-br from-[#00B5AD] to-[#009891] rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Medijski stiki</h2>
            <p className="mb-6 opacity-90">
              Za medijske poizvedbe, intervjuje ali sodelovanje nas kontaktirajte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${companyData.email}`}
                className="px-6 py-3 bg-white text-[#00B5AD] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {companyData.email}
              </a>
              <Link
                href="/kontakt"
                className="px-6 py-3 bg-black/20 text-white rounded-lg font-semibold hover:bg-black/30 transition-colors"
              >
                Kontaktni obrazec
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
