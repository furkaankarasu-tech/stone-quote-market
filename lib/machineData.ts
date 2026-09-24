
export const machineCategories = [
  {slug:"ocak-ekipmanlari", name:"Ocak Ekipmanları", desc:"Elmas tel kesme makineleri, kompresörler, deliciler ve ocak ekipmanları.", kind:"machine"},
  {slug:"kesim-makineleri", name:"Kesim Makineleri", desc:"Köprü kesim, blok kesim, katrak, CNC ve ebatlama makineleri.", kind:"machine"},
  {slug:"yuzey-isleme", name:"Yüzey İşleme & Cila", desc:"Kalibre, honlama, cilalama, eskitme ve yüzey işleme makineleri.", kind:"machine"},
  {slug:"elmas-takimlar", name:"Elmas Takımlar", desc:"Elmas tel, soket, testere, lama ve kesici takım çözümleri.", kind:"supply"},
  {slug:"asindirici-cila", name:"Aşındırıcı & Cila", desc:"Abrasivler, cila taşları, fırçalar ve yüzey kimyasalları.", kind:"supply"},
  {slug:"epoksi-recine-file", name:"Epoksi, Reçine & File", desc:"Taş güçlendirme reçineleri, epoksi sistemleri, file ve kimyasallar.", kind:"supply"},
  {slug:"paketleme", name:"Paketleme Malzemeleri", desc:"Ahşap kasa, A-frame, koruyucu malzeme, çember ve ihracat ambalajı.", kind:"supply"},
  {slug:"yedek-parca-servis", name:"Yedek Parça & Servis", desc:"Makine yedek parçaları, bakım, teknik servis ve revizyon.", kind:"service"},
] as const;

export const machineProducts = [
  {name:"Elmas Tel Kesme Makinesi", category:"ocak-ekipmanlari", meta:"Ocak · Blok kesim", supplier:"Örnek Makine Tedarikçisi"},
  {name:"Vidalı Kompresör", category:"ocak-ekipmanlari", meta:"Ocak · Basınçlı hava", supplier:"Örnek Endüstri"},
  {name:"Köprü Kesim Makinesi", category:"kesim-makineleri", meta:"Fabrika · Plaka kesim", supplier:"Örnek Makine"},
  {name:"CNC İşleme Merkezi", category:"kesim-makineleri", meta:"Fabrika · Hassas işleme", supplier:"Örnek CNC"},
  {name:"Elmas Soket", category:"elmas-takimlar", meta:"Çap ve bağ tipine göre", supplier:"Örnek Elmas"},
  {name:"Elmas Testere", category:"elmas-takimlar", meta:"Mermer / granit", supplier:"Örnek Kesici"},
  {name:"Taş Epoksisi", category:"epoksi-recine-file", meta:"Plaka güçlendirme", supplier:"Örnek Kimya"},
  {name:"Fiberglas File", category:"epoksi-recine-file", meta:"Plaka arkası güçlendirme", supplier:"Örnek Sarf"},
];
