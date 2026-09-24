import type {MetadataRoute} from "next";
import {machineCategories} from "@/lib/machineData";
import {stones} from "@/lib/stoneData";
import {services} from "@/lib/serviceData";
export default function sitemap():MetadataRoute.Sitemap{
 const base="https://marbleborsa.com"; const langs=["tr","en","zh","ar"];
 const sections=["","dogal-tas","firmalar","alim-talepleri","makine-sarf","hizmetler"];
 const main=langs.flatMap(l=>sections.map(s=>({url:`${base}/${l}${s?'/'+s:''}`,lastModified:new Date(),changeFrequency:s?"weekly":"daily" as const,priority:s?0.8:1})));
 const machine=langs.flatMap(l=>machineCategories.map(c=>({url:`${base}/${l}/makine-sarf/${c.slug}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:0.7})));
 const stone=langs.flatMap(l=>stones.map(s=>({url:`${base}/${l}/dogal-tas/${s.slug}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:0.8})));
 const service=langs.flatMap(l=>services.map(s=>({url:`${base}/${l}/hizmetler/${s.slug}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:0.7})));
 return [...main,...machine,...stone,...service] as MetadataRoute.Sitemap;
}