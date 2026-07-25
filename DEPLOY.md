# brams-tr.com — Cloudflare Pages Yayına Alma Rehberi

Bu rehber siteyi **Cloudflare Pages** üzerinde yayına alır: GitHub reposuna
bağlanır, her push'ta otomatik yayınlar, SSL sertifikasını kendisi kurar ve DNS
kaydını tek tıkla ekler. Ücretsiz plan bu site için fazlasıyla yeterli.

Toplam süre: ~20 dakika (mevcut Worker'dan geçiş dahil).

---

## Önce okunması gereken not: Worker mı, Pages mi?

Site şu anda **Worker** olarak yayında ve düzgün çalışıyor. Worker'da statik
dosya sunumu (Workers Static Assets) Cloudflare'in **güncel önerdiği** yoldur;
Pages daha eski üründür ve yeni geliştirmeler Workers tarafına yapılıyor.
Canlı olarak doğrulandı: `_headers` uygulanıyor, uzantısız URL'ler çalışıyor,
404 doğru dönüyor. Yani teknik olarak "yanlış deploy" değil.

Pages'e geçerken bilinçli kabul ettiğiniz iki fark:

| | Worker (mevcut) | Pages (hedef) |
|---|---|---|
| Ücretsiz public alt alan adı | `*.workers.dev` — **kapatılabilir** | `*.pages.dev` — **kapatılamaz** |
| Cloudflare'in ürün yönü | Aktif geliştirme | Bakım/destek modu |
| `_headers` / `_redirects` | ✅ Çalışıyor (doğrulandı) | ✅ Çalışıyor |
| Git entegrasyonu, preview, rollback | ✅ | ✅ |

`*.pages.dev` adresini kapatma imkânı yoktur; sitenin ikinci bir public kopyası
kalıcı olarak erişilebilir olur. Sayfalardaki `canonical` etiketleri arama
motorlarını `brams-tr.com`'a yönlendirdiği için ciddi SEO zararı olmaz.
Tamamen kapatmak isterseniz tek yol Cloudflare Access ile erişimi kısıtlamaktır.

Buna rağmen Pages tercih ediliyorsa aşağıdaki adımlar tam kurulumu verir.

---

## Adım 0 — Kod GitHub'da mı?

Pages repoyu okuyacağı için ilk koşul bu.

```bash
cd "c:/Users/kosot/OneDrive/Masaüstü/brams-tr/brams-tr_website"

git add .
git commit -m "site güncellemesi"
git push origin main
```

Kontrol: GitHub'da `index.html`, `en/`, `css/`, `js/`, `assets/`, `_headers`,
`_redirects` görünmeli. `sources_to_create_website/` ve
`dmk_mimarlık_insaat_page/` **görünmemeli** — `.gitignore` bunları hariç tutuyor.

> Bu, Git yolunu tercih etmenin önemli bir nedeni: kaynak materyal (3.3 MB logo
> ve strateji belgesi) repoya hiç girmediği için yayına da çıkamaz.

---

## Adım 1 — Pages projesini oluşturun

1. [dash.cloudflare.com](https://dash.cloudflare.com) → giriş yapın.
2. Sol menü: **Compute (Workers & Pages)** → **Create**.
3. Açılan ekranda üstteki **Pages** sekmesini seçin — varsayılan olarak
   **Workers** sekmesi açılır ve "Import a repository" düğmesi sizi Worker
   oluşturmaya götürür. İlk kurulumda Worker çıkmasının nedeni tam olarak budur.
4. **Connect to Git** → **GitHub** → repoya erişim izni verin
   (`Only select repositories` → `brams-tr_website` yeterli).
5. Repo listesinden **`bugrahanyapilmisev/brams-tr_website`** → **Begin setup**.

### Build ayarları — kritik nokta

Bu bir statik site; **hiçbir build komutu çalıştırılmamalı**.

| Alan | Değer |
|---|---|
| Project name | `brams-tr-site` |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | **boş bırakın** |
| Build output directory | `/` |
| Root directory | **boş bırakın** |

> **Proje adı neden `brams-tr` değil?** Mevcut Worker `brams-tr` adını
> kullanıyor ve Workers ile Pages aynı isim alanını paylaşır. `brams-tr` adı
> reddedilirse ya farklı bir ad seçin ya da önce Worker'ı silin (Adım 8).
> Proje adı yalnızca `<ad>.pages.dev` adresini etkiler; özel alan adını
> etkilemez.

6. **Save and Deploy**.

Yayın 30–60 saniyede biter ve `brams-tr-site.pages.dev` adresini verir.
**Alan adını taşımadan önce siteyi burada test edin:**

> - Ana sayfa hero'da logo plaketi görünüyor mu?
> - Nav'daki TR/EN geçişi çalışıyor mu?
> - `/hakkimizda` (uzantısız) açılıyor mu?
> - `brams-tr-site.pages.dev/olmayan-sayfa` → 404 sayfası geliyor mu?
> - Mobil görünüm düzgün mü?

### Alternatif: Wrangler CLI ile Pages projesi

Panelde Pages sekmesi hiç görünmüyorsa CLI ile oluşturabilirsiniz:

```bash
npx wrangler login
npx wrangler pages project create brams-tr-site --production-branch main
```

> ⚠️ **`wrangler pages deploy .` komutunu proje kökünde ASLA çalıştırmayın.**
> Direct upload `.gitignore`'a bakmaz; `sources_to_create_website/` ve
> `dmk_mimarlık_insaat_page/` klasörlerini de yükler ve içerikleri public olur.
>
> Bu klasörde artık **üçüncü tarafa ait materyal** var: ACESSI USA'ya ait bir
> kurumsal sunum, örnek bir kredi limiti teklif tablosu ve bir zirve dokümanı
> (`sources_to_create_website/Photos/*.pdf`). Bunların yanlışlıkla
> `brams-tr.com` üzerinde yayınlanması hem ticari hem hukuki bir sorun olur.
> CLI ile yayınlamanız gerekiyorsa önce temiz bir klasör hazırlayın:
>
> ```bash
> rm -rf dist && mkdir dist
> cp -r index.html hakkimizda.html sektorler.html cozumler.html iletisim.html \
>       404.html robots.txt sitemap.xml favicon.ico _headers _redirects \
>       css js assets en dist/
> npx wrangler pages deploy dist --project-name brams-tr-site
> ```
>
> Git entegrasyonu bu riski tamamen ortadan kaldırdığı için tercih edilmelidir.

---

## Adım 2 — Alan adını Worker'dan Pages'e taşıyın

**Bir hostname aynı anda yalnızca tek bir Cloudflare servisine bağlanabilir.**
`brams-tr.com` ve `www.brams-tr.com` şu anda Worker'a bağlı; Pages'e eklemeden
önce Worker'dan çözülmeleri gerekir. Sıra önemlidir — yanlış sırada birkaç
dakikalık kesinti yerine daha uzun bir kesinti yaşarsınız.

**Doğru sıra:**

1. **Önce Adım 1'i bitirin.** Pages projesi yayında ve `pages.dev` üzerinde test
   edilmiş olmalı. Alan adını çalışmayan bir projeye taşımayın.

2. **Worker'dan alan adlarını kaldırın.**
   **Compute (Workers & Pages) → `brams-tr` → Domains** →
   `brams-tr.com` satırında **…** → **Remove** / **Delete**.
   `www.brams-tr.com` için de aynısını yapın.

   Bu işlem DNS'teki iki `Worker` tipi kaydı da siler. Bu andan itibaren site
   kısa süre erişilemez — normal.

3. **Pages'e ekleyin.**
   **Pages projesi → Custom domains → Set up a custom domain** →
   `brams-tr.com` → **Continue** → **Activate domain**.
   Ardından ikinci kez aynı akışla `www.brams-tr.com`.

   Cloudflare DNS kaydını kendisi oluşturur:

   | Type | Name | Content | Proxy |
   |---|---|---|---|
   | CNAME | `brams-tr.com` | `brams-tr-site.pages.dev` | Proxied |
   | CNAME | `www` | `brams-tr-site.pages.dev` | Proxied |

   > Kökte CNAME, **CNAME flattening** sayesinde desteklenir; apex için A kaydına
   > gerek yoktur.

4. **Status** sütunu `Active` olana kadar bekleyin. Zone'da Universal SSL zaten
   kurulu olduğu için sertifika genelde anında hazırdır; ilk seferde 15 dakikaya
   kadar sürebilir.

Kesinti penceresi 2. ve 3. adım arasındaki süredir — pratikte 1–3 dakika.

### Pages'te "Add Route" tuzağı yoktur

Worker arayüzündeki **Add Route** düğmesi DNS kaydı oluşturmaz ve hostname'i
çözümlenemez bırakır (ilk kurulumda `www` bu yüzden çalışmamıştı). Pages
arayüzünde yalnızca **Set up a custom domain** vardır; bu her zaman DNS kaydını
da oluşturur. Yani bu hata Pages'te tekrarlanamaz.

Kontrol:

```bash
nslookup brams-tr.com          # Cloudflare IP'leri dönmeli
nslookup www.brams-tr.com      # Cloudflare IP'leri dönmeli
```

`Non-existent domain` dönüyorsa custom domain henüz aktifleşmemiştir.
Kendi bilgisayarınızdan çözümlenmiyor ama `nslookup www.brams-tr.com 1.1.1.1`
çalışıyorsa sorun sizin modeminizin DNS önbelleğidir — modemi yeniden başlatın.

---

## Adım 3 — URL biçimi hakkında bilmeniz gereken tek şey

Cloudflare Pages, `hakkimizda.html` dosyasını **`/hakkimizda`** adresinde sunar
ve `/hakkimizda.html` isteğini otomatik olarak `/hakkimizda`'ya **308** ile
yönlendirir. (Worker'da bu 307'dir; ikisi de zararsızdır ve site buna göre
hazırlanmıştır.)

Sitedeki tüm `canonical`, `hreflang`, `og:url` etiketleri ve `sitemap.xml`
kayıtları **uzantısız** biçimdedir (`https://brams-tr.com/hakkimizda`) — yani
Cloudflare'in gerçekten sunduğu adresle birebir eşleşir. Sayfa içi bağlantılar
`.html` uzantılıdır; bu her ortamda (Cloudflare, yerel sunucu, dosya sistemi)
çalışır ve Cloudflare tarafında tek bir zararsız yönlendirme adımı oluşturur.

Beklenen davranış:

```
/hakkimizda        →  200  (canonical: https://brams-tr.com/hakkimizda  ✓ eşleşiyor)
/hakkimizda.html   →  308  →  /hakkimizda
/olmayan-sayfa     →  404  (özel 404 sayfası)
```

> `_redirects` dosyasına `/hakkimizda → /hakkimizda.html` gibi bir kural
> **eklemeyin** — Pages'in kendi yönlendirmesiyle sonsuz döngü oluşur.
> Dosyanın içindeki not bunu hatırlatıyor.

---

## Adım 4 — www → kök yönlendirmesi

İki alan adının da aynı içeriği ayrı ayrı sunması SEO açısından istenmez.
Sitedeki tüm `canonical` etiketleri `https://brams-tr.com/...` olduğu için
`www`'yu köke yönlendirin.

> **Önkoşul:** `www.brams-tr.com` Cloudflare üzerinden çözümlenebilir ve
> proxy'li olmalı — yani Adım 2/3 tamamlanmış olmalı. Hostname hiç
> çözümlenmiyorsa kural asla tetiklenmez; istek Cloudflare'e ulaşmadan
> tarayıcıda DNS hatasıyla ölür.

**Cloudflare Dashboard → brams-tr.com (Websites listesinden) → Rules →
Redirect Rules → Create rule**

- **Rule name:** `www to apex`
- **If — Custom filter expression:**
  - Field: `Hostname` · Operator: `equals` · Value: `www.brams-tr.com`
- **Then — Type:** `Dynamic`
  - **Expression:** `concat("https://brams-tr.com", http.request.uri.path)`
  - **Status code:** `301`
  - ☑ **Preserve query string**
- **Deploy**

Test: `http://www.brams-tr.com/hakkimizda` → `https://brams-tr.com/hakkimizda`

> Kural, Pages custom domain'inden **önce** çalışır (Redirect Rules edge'de
> Pages/Workers'dan önce değerlendirilir), dolayısıyla `www`'yu custom domain
> olarak bağlamış olmanız bir çelişki yaratmaz.

---

## Adım 5 — SSL / HTTPS ayarları

**Dashboard → brams-tr.com → SSL/TLS**

| Ayar | Yer | Değer |
|---|---|---|
| Encryption mode | SSL/TLS → Overview | **Full (strict)** |
| Always Use HTTPS | SSL/TLS → Edge Certificates | **Açık** |
| Automatic HTTPS Rewrites | SSL/TLS → Edge Certificates | **Açık** |
| Minimum TLS Version | SSL/TLS → Edge Certificates | **TLS 1.2** |
| HSTS | SSL/TLS → Edge Certificates | Sonraya bırakın (aşağıdaki nota bakın) |

> **HSTS notu:** Site birkaç hafta sorunsuz çalıştıktan sonra açın. Bir kere
> açıldığında tarayıcılar bu alan adını uzun süre yalnızca HTTPS üzerinden
> kabul eder; erken açıp bir yapılandırma hatası yaparsanız geri almak zordur.
> `_headers` dosyası zaten `Strict-Transport-Security` başlığını gönderiyor;
> Cloudflare panelinden ayrıca açmanız şart değil.

---

## Adım 6 — Performans ayarları (opsiyonel ama önerilir)

**Dashboard → brams-tr.com → Speed → Optimization**

- **Brotli**: Açık (varsayılan açıktır)
- **Early Hints**: Açık
- **HTTP/3 (with QUIC)**: Açık (Network sekmesi)
- **0-RTT Connection Resumption**: Açık (Network sekmesi)

**Caching → Configuration**
- **Browser Cache TTL**: `Respect Existing Headers` — repodaki `_headers` dosyası
  görselleri 1 yıl (`immutable`), HTML'i her istekte doğrulanacak şekilde
  ayarlıyor.

**Auto Minify** artık Cloudflare panelinde yok (kaldırıldı); dosyalar elle
sıkıştırılmadı, gerek de yok — CSS ~39 KB, JS ~5.5 KB.

---

## Adım 7 — E-posta (info@brams-tr.com)

Site her sayfada `info@brams-tr.com` adresini gösteriyor. Alan adında MX kaydı
olmadığı sürece bu adrese gönderilen postalar geri döner — Cloudflare DNS
ekranındaki "Email cannot reach @brams-tr.com addresses" uyarısı tam olarak bunu
söylüyor. Pages bu işi yapmaz; ayrı kurulur.

**En hızlı yol — Cloudflare Email Routing (ücretsiz, yönlendirme):**

1. Dashboard → brams-tr.com → **Email** → **Email Routing** → **Get started**.
2. Cloudflare gerekli MX ve TXT (SPF) kayıtlarını otomatik ekler → onaylayın.
3. **Destination addresses** → mevcut kişisel/kurumsal adresinizi ekleyin ve
   gelen doğrulama e-postasındaki bağlantıya tıklayın.
4. **Routing rules** → **Create address**: `info@brams-tr.com` → hedef adresiniz.

Bu yalnızca **gelen** postayı yönlendirir. `info@brams-tr.com` adresinden
**gönderim** yapmak isterseniz gerçek bir posta kutusu gerekir (Google Workspace,
Microsoft 365, Zoho Mail vb.). O durumda ilgili sağlayıcının MX kayıtlarını
Cloudflare DNS'e ekleyin ve Email Routing'i kapatın — ikisi aynı anda MX sahibi
olamaz.

> Alan adında hiç e-posta kullanmayacaksanız, spam'i azaltmak için yine de bir
> SPF kaydı ekleyin: `TXT` · `@` · `v=spf1 -all`

---

## Adım 8 — Eski Worker'ı silin

Alan adları Pages'e taşınıp site doğrulandıktan sonra Worker gereksizdir ve
karışıklık yaratır (iki proje, iki deployment geçmişi).

**Compute (Workers & Pages) → `brams-tr` → Settings → Delete**

Silmeden önce:
- `brams-tr.com` ve `www.brams-tr.com` artık Pages projesinin **Custom domains**
  listesinde ve `Active` durumda olmalı.
- `https://brams-tr.com` ve `https://www.brams-tr.com` tarayıcıda açılmalı.

Acele etmek istemiyorsanız Worker'ı bir hafta boş (alan adı bağlı olmadan)
bırakıp sonra silebilirsiniz — bağlı alan adı olmadığı sürece trafik almaz.

---

## Adım 9 — Yayın sonrası SEO

1. **Google Search Console** → **Add property** → **URL prefix** →
   `https://brams-tr.com`
   - Doğrulama: **DNS record** yöntemi en kolayı. Verilen `TXT` kaydını
     Cloudflare DNS → **Records** → **Add record** ile ekleyin
     (Type `TXT`, Name `@`, Content Google'ın verdiği değer).
2. **Sitemaps** → `https://brams-tr.com/sitemap.xml` gönderin.
3. **International Targeting** sekmesinde hreflang hatası olmadığını kontrol edin
   (site TR/EN çiftlerini `x-default` ile birlikte tanımlıyor).
4. İsterseniz **Bing Webmaster Tools**'a da aynı sitemap'i ekleyin.

> `brams-tr-site.pages.dev` adresini Search Console'a **eklemeyin**. Kapatılamaz
> olsa da, indekslenmesini teşvik etmenin anlamı yok; `canonical` etiketleri
> zaten arama motorlarını apex'e yönlendiriyor.

---

## Sonraki güncellemeler

Ek bir işlem yok — Pages `main` dalını izliyor:

```bash
git add .
git commit -m "iletişim bilgileri güncellendi"
git push
```

Push'tan ~40 saniye sonra site canlıda. Her yayın **Deployments** sekmesinde
listelenir; hatalı bir yayını **Rollback** ile geri alabilirsiniz.

Bir dala (branch) push ederseniz Cloudflare otomatik olarak **preview** adresi
üretir — büyük bir değişikliği canlıya almadan test etmek için ideal.
Ücretsiz planda ayda 500 build ve aynı anda 1 build sınırı vardır; bu site için
fazlasıyla yeterli.

---

## Alternatif: GitHub Pages + Cloudflare DNS

Cloudflare yerine GitHub Pages kullanmak isterseniz kayıtları elle girmeniz
gerekir. Bu senaryoda Cloudflare yalnızca DNS + CDN olur.

1. GitHub → repo → **Settings → Pages** → Source: `Deploy from a branch` →
   Branch: `main` / `root` → Save.
2. Aynı ekranda **Custom domain**: `brams-tr.com` → Save.
   (Bu, repoya bir `CNAME` dosyası ekler.)
3. Cloudflare DNS → **Records** → önce mevcut Pages/Worker kayıtlarını silin,
   sonra şunları ekleyin:

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | DNS only (gri bulut) |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `bugrahanyapilmisev.github.io` | DNS only |

4. GitHub sertifikayı üretene kadar proxy'yi **DNS only** bırakın; `Enforce HTTPS`
   seçeneği aktifleşince proxy'yi açabilirsiniz.

5. **Önemli:** GitHub Pages uzantısız URL'leri desteklemez — `/hakkimizda` 404
   verir, yalnızca `/hakkimizda.html` çalışır. Bu yolu seçerseniz canonical
   etiketlerini geri çevirin. Proje kökünde:

   ```bash
   python - <<'PY'
   import glob, io
   pages = ['hakkimizda','sektorler','cozumler','iletisim',
            'en/about','en/sectors','en/solutions','en/contact']
   for f in glob.glob('*.html') + glob.glob('en/*.html') + ['sitemap.xml']:
       s = io.open(f, encoding='utf-8').read()
       for p in pages:
           for suf in ('"', '<'):
               s = s.replace(f'https://brams-tr.com/{p}{suf}',
                             f'https://brams-tr.com/{p}.html{suf}')
       for suf in ('"', '<'):
           s = s.replace(f'https://brams-tr.com/en/{suf}', f'https://brams-tr.com/en/index.html{suf}')
           s = s.replace(f'https://brams-tr.com/{suf}',    f'https://brams-tr.com/index.html{suf}')
       io.open(f, 'w', encoding='utf-8', newline='').write(s)
   print('canonical URLs reverted to .html form')
   PY
   ```

> Cloudflare'e kıyasla dezavantajları: `_headers` ve `_redirects` dosyaları
> çalışmaz (güvenlik başlıkları ve cache politikası kaybolur), önizleme yayınları
> ve rollback yoktur, sertifika kurulumu daha kırılgandır, canonical URL'leri
> elle çevirmek gerekir. Bu yüzden **Cloudflare önerilir**.

---

## Sorun giderme

| Belirti | Sebep / Çözüm |
|---|---|
| Custom domain eklenirken "already in use" / "conflict" | Hostname hâlâ Worker'a bağlı. Adım 2'deki sırayı izleyin: önce Worker'dan kaldırın. |
| Pages proje adı reddediliyor | Aynı ad Worker tarafından kullanılıyor. Farklı ad seçin veya önce Worker'ı silin (Adım 8). |
| `brams-tr.com` "Error 522" veya boş sayfa | Custom domain henüz `Active` değil. Pages → Custom domains ekranında durumu bekleyin. |
| Alan adı hâlâ eski içeriği / park sayfasını gösteriyor | Tarayıcı ve DNS önbelleği. Gizli sekmede deneyin; `nslookup brams-tr.com 1.1.1.1` ile doğrulayın. |
| `www.brams-tr.com` sizde açılmıyor ama `nslookup ... 1.1.1.1` çalışıyor | Modeminizin DNS önbelleği eski "yok" cevabını tutuyor. Modemi yeniden başlatın veya bilgisayarın DNS'ini `1.1.1.1` yapın. `ipconfig /flushdns` yetmez — önbellek modemde. |
| CSS yüklenmiyor, sayfa düz metin | `Build output directory` yanlış. `/` olmalı, `dist` veya `public` değil. |
| Uzantısız URL 404 veriyor (`/hakkimizda`) | Build output directory yanlış ya da dosyalar alt klasöre yüklenmiş. |
| Türkçe karakterler bozuk (Ã§, Ä±) | Dosya UTF-8 olarak kaydedilmemiş. Editörde encoding'i UTF-8 (BOM'suz) yapın. |
| Sitede eski içerik görünüyor | Cloudflare önbelleği: Caching → **Purge Everything**. |
| Formda "Gönder" hiçbir şey yapmıyor | Ziyaretçinin cihazında varsayılan e-posta uygulaması tanımlı değil. Kalıcı çözüm: README bölüm 7'deki form işleyicisine geçin. |
| `www` yönlendirmesi çalışmıyor | Redirect Rule'un `brams-tr.com` zone'unda (proje içinde değil) tanımlı olduğundan emin olun. |
| `sources_to_create_website/` içeriği public olmuş | CLI ile direct upload yapılmış. Adım 1'deki uyarıya bakın; Git entegrasyonuna geçin ve yeni bir deployment yayınlayın. |
