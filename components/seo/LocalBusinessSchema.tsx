export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "name": "ORI 369",
    "description": "Center za wellness, gibanje in regeneracijo v Mariboru.",
    "url": "https://ori369.com",
    "telephone": "+386 51 302 206",
    "email": "Info@ori369.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ulica škofa Maksimilijana Držečnika 11",
      "addressLocality": "Maribor",
      "postalCode": "2000",
      "addressCountry": "SI",
      "addressRegion": "Maribor"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 46.5598564,
      "longitude": 15.6504699
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Maribor"
      },
      {
        "@type": "City",
        "name": "Celje"
      },
      {
        "@type": "City",
        "name": "Murska Sobota"
      },
      {
        "@type": "City",
        "name": "Graz",
        "addressCountry": "AT"
      }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "14:00"
      }
    ],
    "priceRange": "€€",
    "image": "https://ori369.com/images/og-image.jpg"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
