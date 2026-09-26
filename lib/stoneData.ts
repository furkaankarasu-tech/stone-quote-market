
export type Stone = {
  slug:string; name:string; type:string; city:string; color:string; forms:string[]; image:string;
  thickness?:string[]; surfaces:string[]; stock:string;
  blockDimensions?:string; blockVolume?:string;
  description:string; tests:{label:string;value:string}[];
};
export const stones:Stone[] = [
 // Kalınlık ve blok ölçüleri tedarikçi tarafından doğrulanana kadar kayıtlara eklenmez.
 {slug:"afyon-white",name:"Afyon White",type:"Mermer",city:"Afyonkarahisar",color:"Beyaz",forms:["Blok","Plaka","Ebatlı"],image:"white.webp",surfaces:["Cilalı","Honlu","Fırçalı"],stock:"Tedarikçiye göre",description:"Afyonkarahisar çıkışlı beyaz mermer. Bloktan ebatlı ürüne uzanan formatları için seçenekleri, güncel ölçüleri ve yüzeyleri firmalarla görüşerek karşılaştırabilirsiniz.",tests:[]},
 {slug:"afyon-sugar",name:"Afyon Sugar",type:"Mermer",city:"Afyonkarahisar",color:"Krem / Beyaz",forms:["Blok","Plaka"],image:"sugar.webp",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Krem ile beyaz arasında kalan açık tonu, Afyon Sugar'ı açık renk mermer aramalarında öne çıkarıyor. Katalogda blok ve plaka formatları yer alıyor.",tests:[]},
 {slug:"afyon-violet",name:"Afyon Violet",type:"Mermer",city:"Afyonkarahisar",color:"Beyaz / Mor damarlı",forms:["Blok","Plaka"],image:"violet.webp",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Beyaz zemin üzerindeki mor damarlar Afyon Violet'in ayırt edici görünümünü oluşturur. Plaka seçerken damar yönü ve parti görsellerini firmadan isteyin.",tests:[]},
 {slug:"afyon-grey",name:"Afyon Grey",type:"Mermer",city:"Afyonkarahisar",color:"Gri",forms:["Blok","Plaka","Ebatlı"],image:"grey.webp",surfaces:["Cilalı","Honlu","Fırçalı"],stock:"Tedarikçiye göre",description:"Afyonkarahisar menşeli gri mermer; blok, plaka ve ebatlı formatları dizinde listeleniyor. Projenizdeki gri tonu seçmeden önce güncel numuneyi inceleyin.",tests:[]},
 {slug:"burdur-beige",name:"Burdur Beige",type:"Mermer",city:"Burdur",color:"Bej",forms:["Plaka","Ebatlı"],image:"beige.webp",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Burdur'dan bej mermer arayanlar için plaka ve ebatlı ürün kaydı. Yüzey seçeneği, ölçü ve teslim edilebilir miktarı ilgili firmaya sorabilirsiniz.",tests:[]},
 {slug:"bilecik-beige",name:"Bilecik Beige",type:"Mermer",city:"Bilecik",color:"Bej",forms:["Blok","Plaka","Ebatlı"],image:"bilecik-beige.svg",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Bilecik menşeli bej mermer, bloktan ebatlı parçaya kadar farklı ihtiyaçlar için katalogda bulunuyor. Partiler arasında renk ve damar farklılığı olabileceğinden numune isteyin.",tests:[]},
 {slug:"mugla-white",name:"Muğla White",type:"Mermer",city:"Muğla",color:"Beyaz",forms:["Blok","Plaka"],image:"mugla-white.svg",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Muğla'dan beyaz mermer. Dizindeki kayıtta blok ve plaka formatları bulunuyor; plaka seçimi yaparken istediğiniz tonun mevcut partideki fotoğraflarını inceleyin.",tests:[]},
 {slug:"marmara-white",name:"Marmara White",type:"Mermer",city:"Balıkesir",color:"Beyaz / Gri çizgili",forms:["Blok","Plaka","Ebatlı"],image:"marmara-white.svg",surfaces:["Cilalı","Honlu"],stock:"Tedarikçiye göre",description:"Marmara Adası'nın gri çizgili beyaz mermeri. Çizgilerin yönü ve yoğunluğu seçimde belirleyicidir; blok, plaka veya ebatlı ürün için firma profilinden iletişime geçin.",tests:[]},
 {slug:"denizli-travertine",name:"Denizli Travertine",type:"Traverten",city:"Denizli",color:"Krem",forms:["Blok","Plaka","Ebatlı"],image:"travertine.webp",surfaces:["Honlu","Dolgulu","Eskitme"],stock:"Tedarikçiye göre",description:"Denizli traverteninin krem tonlu seçeneği. Dolgulu, honlu veya eskitme yüzey tercihinizi belirtip mevcut blok, plaka ve ebatlı ürünleri firmalara sorabilirsiniz.",tests:[]},
];
export const stoneTypes = ["Tümü","Mermer","Traverten"] as const;
