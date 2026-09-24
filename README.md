# Marble Borsa v15.9 — Doğal Taş eski görünüm + yeni özellikler

Temel: v15.8. Mevcut legacy Marble Borsa görünümü korunur.

Doğal Taş:
- `/[locale]/dogal-tas` tekrar LegacyPage/eskiden kullanılan taş dizini görünümünü kullanır.
- 9 taş legacy kart tasarımı içinde listelenir.
- Taş ara alanı.
- Tür, renk, şehir ve format filtreleri.
- Önerilen / firma sayısı / A-Z sıralaması.
- Mobil uyumlu filtre düzeni.
- Her kart gerçek `/dogal-tas/[slug]` detay URL'sine gider.
- Kartlarda görsel/tekstür alanı, format, renk ve firma sayısı bilgisi.
- `ItemList` JSON-LD liste sayfasına eklendi.
- Detay sayfalarına fiyat/puan uydurmadan `Product` JSON-LD eklendi.
- v15.8 doğrulama ve Hizmetler düzeltmeleri korunur.

Not: Kartların `stone-img` görselleri mevcut legacy CSS görsel/tekstür altyapısını kullanır. Gerçek ürün fotoğrafları Supabase/storage kaydı geldiğinde aynı alanlara bağlanmalıdır.


## v15.9.1 build fix
`app/[locale]/dogal-tas/[slug]/page.tsx` içindeki JSON-LD eklenirken açılan React Fragment (`<>`) kapanmamıştı. `</>` kapanışı eklendi. Bu, Vercel `Failed to compile` hatasının kaynak kodundaki sözdizimi problemiydi.


## v15.9.2 clean deploy
Vercel algılama sorunu için package.json temiz oluşturuldu ve vercel.json ile framework Next.js olarak açıkça tanımlandı.

## v15.10 route isolation + consistency
- Legacy görünüm korunarak route bazlı DOM ayrıştırması eklendi.
- `/tr/dogal-tas` yalnızca Doğal Taş panelini render eder; diğer ana modüller aynı DOM'a yüklenmez.
- Taş kartlarına yüzey ve kısa açıklama geri eklendi; blok ürünlere uydurma kalınlık yazılmadı.
- Demo firma durumları `Doğrulama bekliyor` olarak eşitlendi.
- Yeni Eklenenler taş bağlantıları mümkün olan yerlerde detay rotalarına yönlendirildi.
- Mevcut katalogla uyumsuz Oniks/Granit iddiası kaldırıldı.
- Legacy tasarım dili korunmuştur.


## v15.13 layout correction
Route içeriği artık orijinal header/navigation sırasından koparılmıyor. Doğal Taş paneli
legacy marketplace kabuğundaki gerçek yerinde kalır; homepage-only bölümler ve diğer ana
modüller DOM'dan çıkarılır. Demo reklam rail'i kaldırıldı ve katalog normal masaüstü
genişliğine getirildi.
