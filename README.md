# BRAMS — brams-tr.com

Kurumsal web sitesi. Statik HTML/CSS/JS — derleme adımı, bağımlılık ve build aracı yok.
Türkçe kök dizinde, İngilizce `/en/` altında.

Corporate website. Static HTML/CSS/JS — no build step, no dependencies.
Turkish at the root, English under `/en/`.

---

## 1. Dizin yapısı / Structure

```
/
├── index.html            Ana Sayfa        →  /en/index.html      Home
├── hakkimizda.html       Hakkımızda       →  /en/about.html      About
├── sektorler.html        Sektörler        →  /en/sectors.html    Sectors
├── cozumler.html         Çözümler         →  /en/solutions.html  Solutions
├── iletisim.html         İletişim         →  /en/contact.html    Contact
├── 404.html              İki dilli hata sayfası / bilingual error page
├── css/style.css         Tek tasarım sistemi / single design system
├── js/main.js            Tüm etkileşim / all interaction
├── assets/img/           Logodan üretilmiş görseller / assets generated from the logo
├── sitemap.xml           hreflang alternatifleriyle / with hreflang alternates
├── robots.txt
├── _headers              Cloudflare Pages: güvenlik + cache başlıkları
├── _redirects            Cloudflare Pages: boş — sayfa taşıma/silme için hazır
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

> ⚠️ **Logo güncellenecek.** Mevcut logo dosyalarındaki kelime markası hâlâ
> **BRAHMS** yazıyor; doğru marka adı **BRAMS**. Sitedeki tüm metin BRAMS'a
> çevrildi, görseller geçici olarak olduğu gibi bırakıldı.
> Yeni logo hazır olduğunda: iki kaynak dosyayı (koyu ve açık zeminli)
> `sources_to_create_website/` altına koyup bu tablodaki tüm dosyaları yeniden
> üretin — kırpma kutuları ve boyutlar bu dosyada belgelidir. HTML'de hiçbir
> değişiklik gerekmez; dosya adları aynı kalır.

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
- **Logo dosyaları** — mevcut görseller hâlâ "BRAHMS" yazıyor. Bkz. bölüm 4'teki not.

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

## 9. Sonraki dil / Next language

Strateji belgesi Romence'yi de öngörüyor. Yapı buna hazır: `/en/` klasörünü `/ro/`
olarak kopyalayın, `hreflang` bloklarına `ro` satırını ekleyin, `sitemap.xml` ve dil
değiştiriciyi güncelleyin. `css/` ve `js/` paylaşımlı kalır.

## 10. Marka adı notu / Note on the brand name

Doğru marka adı **BRAMS** — alan adıyla (`brams-tr.com`) tutarlı. Sitedeki tüm
metin, başlık, meta etiketi ve yapısal veri BRAMS kullanıyor.

Elimize ulaşan iki kaynak materyal marka adını **BRAHMS** olarak yazıyordu
(logo dosyaları ve `BRAHMS_Core_Narrative_Positioning_v2` strateji belgesi).
Bunlar eski/hatalı yazımdır. Görsellerdeki kelime markası, yeni logo hazır
olana kadar geçici olarak bu haliyle duruyor — bölüm 4'teki nota bakın.

The correct brand name is **BRAMS**, consistent with the domain. All copy,
titles, meta tags and structured data use BRAMS. The two source materials
(the logo files and the strategy document) spelled it "BRAHMS"; that spelling
is superseded. The wordmark inside the image assets still shows the old
spelling until a corrected logo is supplied — see section 4.
