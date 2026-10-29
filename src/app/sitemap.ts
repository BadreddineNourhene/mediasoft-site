import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["/", 1],
    ["/microsoft-365-PowerBI.html", 0.8],
    ["/PowerBI-Tunisie.html", 0.8],
    ["/site/formulaire.php", 0.7],
    ["/sage.tn/", 0.9],
    ["/divalto.tn/", 0.9],
    ["/bitrix24.tn/", 0.8],
    ["/Politique%20de%20confidentialit%C3%A9.html", 0.2],
  ];
  return pages.map(([path, priority]) => ({ url: `${SITE_URL}${path}`, lastModified: new Date(), priority }));
}
