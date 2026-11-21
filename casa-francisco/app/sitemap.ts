import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: [string, number][] = [
    ["", 1],
    ["/carta", 0.9],
    ["/menu-degustacion", 0.8],
    ["/reservas", 0.9],
    ["/bodega", 0.7],
    ["/eventos", 0.7],
    ["/contacto", 0.8],
  ];
  return routes.map(([path, priority]) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
