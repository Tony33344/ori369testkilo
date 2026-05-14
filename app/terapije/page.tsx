import Services from '@/components/sections/Services';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { fetchPublicServices } from '@/lib/public-services';

export default async function TherapiesPage() {
  const therapies = (await fetchPublicServices(false)).map((service) => ({
    id: service.slug,
    name: service.name,
    shortDescription: service.shortDescription,
    duration: service.duration,
    price: service.price,
  }));

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
          Terapije
        </h1>
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
          Odkrijte našo ponudbo vrhunskih terapevtskih storitev
        </p>
        <div className="mt-12 text-center">
          <Link 
            href="/education" 
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg"
          >
            <BookOpen className="w-5 h-5 text-[#00B5AD]" />
            <span>ORI Education – Tečaji in Izobraževanja</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
      <Services services={therapies} />
      <div className="container mx-auto px-4 mt-12 text-center">
        <Link
          href="/rezervacija"
          className="inline-block px-8 py-4 bg-[#00B5AD] text-white font-semibold rounded-xl shadow-lg hover:bg-[#009891] hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Rezerviraj zdaj
        </Link>
      </div>
    </div>
  );
}
