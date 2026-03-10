import Packages from '@/components/sections/Packages';
import { fetchPublicServices } from '@/lib/public-services';

export default async function PackagesPage() {
  const packages = (await fetchPublicServices(true)).map((service) => ({
    id: service.slug,
    name: service.name,
    description: service.shortDescription,
    benefits: service.benefits,
    sessions: service.sessions,
    price: service.price,
  }));
  
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
          Paketi
        </h1>
        <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
          Izberite paket, ki vam najbolje ustreza
        </p>
      </div>
      <Packages packages={packages} />
    </div>
  );
}
