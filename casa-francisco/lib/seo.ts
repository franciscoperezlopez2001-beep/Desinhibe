import type { Metadata } from "next";
import { site, weekdayNames, type Weekday } from "@/data/site";
import { menu } from "@/data/menu";

export function pageMetadata({
  title,
  description,
  path,
  image = "/og-image.jpg",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: [image] },
  };
}

const dayMap: Record<Weekday, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

/** Schema.org Restaurant. Los campos pendientes se omiten hasta tener datos reales. */
export function restaurantJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.url}/#restaurant`,
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    image: [`${site.url}/images/salon.jpg`, `${site.url}/images/bodega.jpg`],
    servesCuisine: ["Española", "Cocina de brasa", "Mediterránea"],
    priceRange: "€€€",
    acceptsReservations: true,
    hasMenu: `${site.url}/carta`,
    openingHoursSpecification: ([0, 1, 2, 3, 4, 5, 6] as Weekday[]).flatMap((d) =>
      site.hours.services[d].map((s) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${dayMap[d]}`,
        opens: s.from,
        closes: s.to,
      })),
    ),
  };
  if (!site.address.pending) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    };
  }
  if (site.geo) data.geo = { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng };
  if (!site.phone.pending) data.telephone = site.phone.e164;
  if (!site.email.pending) data.email = site.email.value;
  const sameAs = [site.social.instagram, site.social.facebook].filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;
  return data;
}

export function menuJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `Carta de ${site.name}`,
    inLanguage: "es",
    hasMenuSection: menu.map((section) => ({
      "@type": "MenuSection",
      name: section.title,
      hasMenuItem: section.dishes.map((d) => ({
        "@type": "MenuItem",
        name: d.name,
        description: d.description,
        offers: { "@type": "Offer", price: d.price.toFixed(2), priceCurrency: "EUR" },
      })),
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Inicio", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path === "/" ? "" : it.path}`,
    })),
  };
}

export { weekdayNames };
