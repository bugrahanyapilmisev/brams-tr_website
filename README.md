# BRAMS — brams-tr.com

Kurumsal web sitesi. Statik HTML/CSS/JS — derleme adımı, bağımlılık ve build aracı yok.
Türkçe kök dizinde, İngilizce `/en/`, Romence `/ro/` altında.

Corporate website. Static HTML/CSS/JS — no build step, no dependencies.
Turkish at the root, English under `/en/`, Romanian under `/ro/`.

---

## 1. Dizin yapısı / Structure

```
/
├── index.html        │ /en/index.html     │ /ro/index.html      Ana Sayfa
├── hakkimizda.html   │ /en/about.html     │ /ro/despre.html     Hakkımızda
├── sektorler.html    │ /en/sectors.html   │ /ro/sectoare.html   Sektörler
├── cozumler.html     │ /en/solutions.html │ /ro/solutii.html    Çözümler
├── iletisim.html     │ /en/contact.html   │ /ro/contact.html    İletişim
├── 404.html              Üç dilli hata sayfası / trilingual error page
├── css/style.css         Tek tasarım sistemi / single design system
├── js/main.js            Tüm etkileşim / all interaction
├── assets/img/           Logodan üretilmiş görseller / assets generated from the logo
├── sitemap.xml           hreflang alternatifleriyle / with hreflang alternates
├── robots.txt
├── _headers              Cloudflare Pages: güvenlik + cache başlıkları
├── _redirects            Cloudflare Pages: boş — sayfa taşıma/silme için hazır
├── tools/                Tek seferlik yardımcı betikler (logo düzeltmesi)
└── favicon.ico
```

`sources_to_create_website/` ve `dmk_mimarlık_insaat_page/` `.gitignore` içindedir —
yayına çıkmaz.

## 2. Yerelde çalıştırma / Run locally

```bash
python -m http.server 8787
# http://localhost:8787
```

Dosyayı doğrudan çift tıklamak da büyük ölçüde çalışır; ancak `_redirects` ve
mutlak yollar (`/css/...` kullanan 404 sayfası) yalnızca bir sunucu üzerinden
doğru davranır.

## 3. Tasarım sistemi / Design system

Tüm renk, tipografi ve geometri değerleri `css/style.css` başındaki `:root`
bloğundadır. Marka renkleri doğrudan logodan örneklendi.

| Token | Değer | Kullanım |
|---|---|---|
| `--navy-900` | `#0b1219` | Koyu bantlar, nav, footer |
| `--navy-950` | `#060b12` | En derin bant |
| `--brand-navy` | `#1e3352` | Logo lacivertine karşılık |
| `--gold-500` | `#b8822b` | Ana vurgu, butonlar, kurallar |
| `--gold-300` | `#e0bc79` | Koyu zeminde vurgu metni |
| `--silver-300/400/500` | — | Koyu zeminde gövde metni |
| `--paper` / `--paper-2` | `#fff` / `#f4f6f9` | Açık bölümler |

Tipografi: **Barlow Condensed** (başlıklar), **Inter** (gövde),
**Cinzel** (yalnızca BRAMS kelime markası).

Geometri bilinçli olarak keskin (`--r-xs: 2px`) — endüstriyel bir marka için
yuvarlatılmış köşelerden daha doğru bir dil.

## 4. Görseller / Assets

`assets/img/` içeriği `sources_to_create_website/` altındaki iki logo dosyasından
üretildi (kırpma, dairesel maske, yeniden boyutlandırma, sıkıştırma):

| Dosya | Kullanım |
|---|---|
| `mark-on-dark.png` | Nav ve footer marka işareti (koyu zemin) |
| `mark-on-light.png` | Açık zeminler için yedek |
| `lockup-on-dark.jpg` | Ana sayfa hero plaketi |
| `lockup-on-light.jpg` | Açık zeminli kullanımlar, doküman/sunum |
| `og-image.jpg` | Sosyal paylaşım görseli (1200×630) |
| `favicon-32.png`, `apple-touch-icon.png`, `icon-256.png`, `favicon.ico` | İkonlar |

### Fotoğraflar

`sources_to_create_website/Photos/` içindeki 85 görselden **14 tanesi** seçilip
web boyutlarına indirildi. Seçim ölçütü: dosya adı Pixabay deseninde olanlar
(`*_1280.jpg`) — ticari kullanım lisansı net olan set.

| Dosya | Kaynak | Kullanıldığı yer |
|---|---|---|
| `hero-port.jpg` | ambarli-port-2409801 | Ana sayfa hero arka planı (Ambarlı Limanı) |
| `band-industry.jpg` | welding-67640 | "İnşa ediyoruz" bandı (ana sayfa + hakkımızda) |
| `band-geo.jpg` | continents-28616 | Coğrafi kimlik bandı |
| `sector-infrastructure.jpg` | bridge-7432647 | Altyapı & Ulaşım sütunu |
| `sector-energy.jpg` | renewable-1989416 | Enerji & Altyapı Hizmetleri sütunu |
| `sector-industrial.jpg` | factory-6991799 | Endüstriyel & Dijital Gelişim sütunu |
| `sector-agriculture.jpg` | agriculture-4208863 | Tarım & Kırsal Altyapı sütunu |
| `solution-sales.jpg` | piling-rig-4429042 | Çözümler → Ekipman Satışı |
| `solution-rental.jpg` | warehouse-8540045 | Çözümler → Ekipman Kiralama |
| `solution-mobility.jpg` | speedometer-2389746 | Çözümler → Mobilite & Filo |
| `group-*.jpg` (4) | worker / bridge / photovoltaic / cereals | Hakkımızda → Grup Ekosistemi |

Sıkıştırma, tasarımın görüntüden ne kadarını gösterdiğine göre ayarlandı:
koyu perde altındaki bant arka planları q52–62, kart görselleri q72.

> ⚠️ **Yayınlanmayan materyal — bilinçli karar.** `Photos/` klasöründeki
> şu dosyalar siteye **eklenmedi**:
> - **ACESSI / US EXIM görselleri** (`ACESSI BDG Combined.png`, `US Exim*.jpeg`,
>   `exim 6.jpeg`, `us exim 7.jpeg`, `trade 4.jpeg`, `hand-2722103`) — üçüncü
>   tarafa ait marka taşıyorlar ve bir ABD devlet kurumuyla (US EXIM Bank)
>   var olmayan bir iş birliği izlenimi yaratırlar. Strateji belgesi ihracat
>   kredi kuruluşlarını **hedef kitle** olarak tanımlıyor, mevcut ortak olarak değil.
> - **Üç PDF** (ACESSI kurumsal sunumu, örnek kredi limiti tablosu, Summit 2025) —
>   başka bir şirketin materyali; biri de örnek bir finansal teklif.
> - **Lisansı belirsiz 12 yüksek çözünürlüklü fotoğraf** (`cargo *.jpg`,
>   `warehouse.jpg`, `screen.jpg`, `transport-logistics-products.jpg` vb.).
>   Bunların telif durumu doğrulanamadı. Size aitse ya da lisanslıysa
>   kalitesi daha yüksek — aynı dosya adıyla `assets/img/` içine üretip
>   değiştirmek yeterli, HTML'de değişiklik gerekmez.

Toplam `assets/img/` ~1.3 MB (logo görselleri + 14 fotoğraf).
Kaynak klasör (139 MB) `.gitignore` içinde — yayına çıkmaz.

### Logo kelime markası düzeltmesi (BRAHMS → BRAMS)

Orijinal logo dosyalarında kelime markası **BRAHMS** yazıyordu. Düzeltildi:
`tools/fix-wordmark.py`.

Yöntem: **BRAHMS kelimesi BRAMS'ı içerir.** H harfi silinip kalan beş harf
yeniden konumlandırıldı. Yani hiçbir harf yeniden çizilmedi, esnetilmedi ya da
yeniden yazılmadı — harf formları, metalik gradyanlar, eğim/kabartma efektleri,
altın çizgi ve iki alt satır orijinal tasarımla **piksel piksel aynı**.

Harf aralıkları da orijinalden alındı. Yeni A→M aralığı için orijinal A→H
değeri kullanıldı; çünkü H de M de tam boy dikey bir gövdeyle başlar, yani
A'nın o gövdeye olan optik mesafesi aynıdır. Kelime, orijinalin kullandığı
optik merkeze hizalandı (açık: 625, koyu: 632).

Betiği yeniden çalıştırmak için:

```bash
python tools/fix-wordmark.py     # brams-fixed-{light,dark}.png üretir
```

> **Not:** Bu, profesyonel bir yeniden çizimin yerine geçmez ama yayına
> uygundur. Marka kılavuzu için vektör (SVG/AI) bir kelime markası
> hazırlandığında bu tablodaki dosyaları aynı adlarla yeniden üretmek yeterli;
> HTML'de hiçbir değişiklik gerekmez.
>
> Dairesel sembol metin içermediği için düzeltmeden etkilenmedi —
> `mark-on-*.png` ve tüm favicon'lar orijinaldeki sembolün aynısı.

## 5. Bir sayfa eklerken / Adding a page

1. En yakın sayfayı kopyalayın (`sektorler.html` iyi bir şablondur).
2. `<head>` içinde `title`, `description`, `canonical`, `hreflang` ve `og:*` güncelleyin.
3. Hem TR hem EN nav ve drawer listelerine `data-page="yenisayfa.html"` ile ekleyin —
   aktif menü vurgusu bu attribute üzerinden çalışır.
4. Footer bağlantılarını güncelleyin.
5. `sitemap.xml` içine TR ve EN kaydını `xhtml:link` alternatifleriyle ekleyin.

**URL biçimi:** Sayfa içi bağlantılar `.html` uzantılıdır (her ortamda çalışır).
`canonical` / `hreflang` / `og:url` / `sitemap.xml` ise **uzantısız** biçimdedir
(`https://brams-tr.com/hakkimizda`) — çünkü Cloudflare Pages dosyaları bu adreste
sunar. Yeni sayfada aynı ayrımı koruyun. Ayrıntı: [DEPLOY.md](DEPLOY.md) Adım 2.5.

## 6. Doldurulması gereken içerik / Content still to be filled

Strateji belgesi, doğrulanmamış rakam ve proje adı kullanılmamasını açıkça
söylüyor; bu yüzden site bilinçli olarak **uydurma istatistik içermiyor**.
Netleştiğinde eklenecekler:

- **Telefon numarası** — `iletisim.html` ve `en/contact.html` içinde yorum satırı
  olarak hazır. Açmak için yorumu kaldırın ve `data-tel` değerini numaranın base64
  karşılığıyla değiştirin → tarayıcı konsolunda `btoa('+90 212 000 00 00')`.
- **Ofis adresi** — aynı dosyalarda yorum içinde.
- **LinkedIn / sosyal hesaplar** — aynı dosyalarda yorum içinde.
- **E-posta** — şu an `info@brams-tr.com` (alan adından türetildi). Farklıysa tüm
  dosyalarda `data-mail` / `data-host` base64 değerlerini güncelleyin.
- **Grup adı ve kanıtlanabilir referanslar** — `hakkimizda.html#grup` bölümü şu an
  yönlü ve genel. Strateji belgesinin de belirttiği gibi kamu alıcıları, OEM'ler ve
  finans kuruluşları karşısında **somut kanıt her zaman genel iddiadan daha güçlüdür**;
  hangi projelerin ve rakamların paylaşılacağı netleştiğinde ilk sıkılaştırılacak
  bölüm budur.
- **Kurumsal sunum PDF'i** (Faz 3) — hazır olduğunda footer'a doküman bağlantısı olarak.

## 7. İletişim formu / Contact form

Statik barındırmada sunucu olmadığı için form, mesajı ziyaretçinin kendi e-posta
uygulamasında hazırlar (`mailto:`). Gerçek bir form işleyicisine geçerken HTML'i
değiştirmeniz gerekmez; yalnızca `js/main.js` içindeki 6. blok:

- **Cloudflare Pages Functions**: `/functions/api/contact.js` ekleyip formu
  `fetch('/api/contact', { method: 'POST', body: new FormData(form) })` ile gönderin.
- **Hazır servis**: Formspree / Web3Forms — `<form action="..." method="post">`
  ekleyip JS bloğunu devre dışı bırakmak yeterli.

## 8. Dağıtım / Deployment

Adım adım Cloudflare kurulumu: **[DEPLOY.md](DEPLOY.md)**.
Kısaca: GitHub'a push → Cloudflare Pages projesi → `brams-tr.com` özel alan adı.

## 9. Diller / Languages

Site üç dilde yayında. Türkçe kök dizinde (varsayılan), İngilizce `/en/`,
Romence `/ro/` altında. `css/`, `js/` ve `assets/` üç dil arasında paylaşılır.

| | Türkçe (kök) | English (`/en/`) | Română (`/ro/`) |
|---|---|---|---|
| Ana sayfa | `index.html` | `index.html` | `index.html` |
| Kurumsal | `hakkimizda.html` | `about.html` | `despre.html` |
| Sektörler | `sektorler.html` | `sectors.html` | `sectoare.html` |
| Çözümler | `cozumler.html` | `solutions.html` | `solutii.html` |
| İletişim | `iletisim.html` | `contact.html` | `contact.html` |

**Bir dil eklerken / değiştirirken kontrol listesi:**

1. Beş sayfayı çevirin; `<html lang>`, `<title>`, `description`, `og:locale` güncellenmeli.
2. Her sayfada dört `hreflang` satırı olmalı: `tr`, `en`, `ro`, `x-default`
   (`x-default` her zaman Türkçe sürümü gösterir).
3. Üç dilin **tamamındaki** dil değiştiriciye yeni dili ekleyin — `hreflang`
   karşılıklı olmak zorundadır, yoksa Google etiketleri yok sayar.
4. `sitemap.xml`: yeni sayfaları ekleyin **ve** mevcut tüm kayıtlara yeni
   `xhtml:link` satırını ekleyin.
5. `js/main.js` → 6. blok: iletişim formu etiketleri için `LABELS` nesnesine
   dil kodunu ekleyin, sayfada `data-lang="xx"` kullanın.
6. `404.html`: satırı ekleyin.
7. Dil düğmesi sayısı arttıkça mobil nav daralır — `css/style.css` içindeki
   `@media (max-width: 480px)` bloğu marka alt başlığını gizler ve düğmeleri
   sıkıştırır. Dördüncü bir dil eklenirse bu blok yeniden ayarlanmalı.

> **Ülke adı notu:** Romence sürümde ülke adı, marka tutarlılığı için diğer iki
> dille aynı şekilde **Türkiye** olarak yazıldı. Romence okuyucu için „Turcia”
> tercih edilirse `/ro/` klasöründe tek bir bul-değiştir yeterlidir.
> (România her yerde Romence yazımıyla kullanılıyor.)

## 10. Marka adı notu / Note on the brand name

Doğru marka adı **BRAMS** — alan adıyla (`brams-tr.com`) tutarlı. Sitedeki tüm
metin, başlık, meta etiketi ve yapısal veri BRAMS kullanıyor.

Elimize ulaşan iki kaynak materyal marka adını **BRAHMS** olarak yazıyordu
(logo dosyaları ve `BRAHMS_Core_Narrative_Positioning_v2` strateji belgesi).
Bunlar eski/hatalı yazımdır. Logodaki kelime markası da düzeltildi — bölüm 4'e
bakın.

The correct brand name is **BRAMS**, consistent with the domain. All copy,
titles, meta tags and structured data use BRAMS. The two source materials
(the logo files and the strategy document) spelled it "BRAHMS"; that spelling
is superseded. The wordmark inside the image assets has been corrected too —
see section 4.
