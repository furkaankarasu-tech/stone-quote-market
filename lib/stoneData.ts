
export type Stone = {
  slug:string; name:string; type:string; city:string; color:string; forms:string[];
  suppliers:number; thickness:string[]; surfaces:string[]; stock:string;
  description:string; tests:{label:string;value:string}[];
};
export const stones:Stone[] = [
 {slug:"afyon-white",name:"Afyon White",type:"Mermer",city:"Afyonkarahisar",color:"Beyaz",forms:["Blok","Plaka","Ebatlı"],suppliers:6,thickness:["2 cm","3 cm"],surfaces:["Cilalı","Honlu","Fırçalı"],stock:"Tedarikçiye göre",description:"Afyonkarahisar kökenli beyaz mermer. İç ve dış mekân projelerinde farklı yüzey seçenekleriyle sunulur.",tests:[]},
 {slug:"afyon-sugar",name:"Afyon Sugar",type:"Mermer",city:"Afyonkarahisar",color:"Krem / Beyaz",forms:["Blok","Plaka"],suppliers:4,thickness:["2 cm","3 cm"],surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Afyon bölgesinden açık tonlu doğal taş seçeneği.",tests:[]},
 {slug:"afyon-violet",name:"Afyon Violet",type:"Mermer",city:"Afyonkarahisar",color:"Beyaz / Mor damarlı",forms:["Blok","Plaka"],suppliers:3,thickness:["2 cm","3 cm"],surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Mor-viyole damar karakteriyle ayrışan Afyon mermeri.",tests:[]},
 {slug:"afyon-grey",name:"Afyon Grey",type:"Mermer",city:"Afyonkarahisar",color:"Gri",forms:["Blok","Plaka","Ebatlı"],suppliers:3,thickness:["2 cm","3 cm"],surfaces:["Cilalı","Honlu","Fırçalı"],stock:"Tedarikçiye göre",description:"Gri tonlu Afyon mermeri; mimari ve iç mekân uygulamalarında kullanılır.",tests:[]},
 {slug:"burdur-beige",name:"Burdur Beige",type:"Mermer",city:"Burdur",color:"Bej",forms:["Plaka","Ebatlı"],suppliers:5,thickness:["2 cm","3 cm"],surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Burdur kökenli bej mermer.",tests:[]},
 {slug:"bilecik-beige",name:"Bilecik Beige",type:"Mermer",city:"Bilecik",color:"Bej",forms:["Blok","Plaka","Ebatlı"],suppliers:5,thickness:["2 cm","3 cm"],surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Bilecik bölgesinden bej mermer seçeneği.",tests:[]},
 {slug:"mugla-white",name:"Muğla White",type:"Mermer",city:"Muğla",color:"Beyaz",forms:["Blok","Plaka"],suppliers:4,thickness:["2 cm","3 cm"],surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Muğla kökenli beyaz mermer.",tests:[]},
 {slug:"marmara-white",name:"Marmara White",type:"Mermer",city:"Balıkesir",color:"Beyaz / Gri çizgili",forms:["Blok","Plaka","Ebatlı"],suppliers:6,thickness:["2 cm","3 cm"],surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Marmara Adası ile özdeşleşen çizgili beyaz mermer.",tests:[]},
 {slug:"denizli-travertine",name:"Denizli Travertine",type:"Traverten",city:"Denizli",color:"Krem",forms:["Blok","Plaka","Ebatlı"],suppliers:5,thickness:["2 cm","3 cm"],surfaces:["Honlu","Dolgulu","Eskitme"],stock:"Tedarikçiye göre",description:"Denizli bölgesinden traverten; farklı dolgu ve yüzey seçenekleriyle sunulur.",tests:[]},
];
export const stoneTypes = ["Tümü","Mermer","Traverten"] as const;
