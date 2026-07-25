# brams-tr.com — Cloudflare Yayına Alma Rehberi

Alan adı Cloudflare'den alındığı için en temiz yol **Cloudflare Pages**:
GitHub reposuna bağlanır, her push'ta otomatik yayınlar, SSL sertifikasını
kendisi kurar ve DNS kaydını tek tıkla ekler. Ücretsiz plan bu site için
fazlasıyla yeterli.

Toplam süre: ~15 dakika. DNS yayılması genelde 1–5 dakika.

---

## Adım 0 — Kodu GitHub'a gönderin

Cloudflare Pages repoyu okuyacağı için ilk adım bu.

```bash
cd "c:/Users/kosot/OneDrive/Masaüstü/brams-tr/brams-tr_website"

git add .
git commit -m "BRAMS kurumsal sitesi: TR + EN, tasarım sistemi, marka görselleri"
git push origin main
```

Push sonrası GitHub'da `index.html`, `en/`, `css/`, `js/`, `assets/` görünmeli.
`sources_to_create_website/` ve `dmk_mimarlık_insaat_page/` **görünmemeli**
(`.gitignore` bunları hariç tutuyor).

---

## Adım 1 — Cloudflare Pages projesini oluşturun

1. [dash.cloudflare.com](https://dash.cloudflare.com) → giriş yapın.
2. Sol menü: **Compute (Workers & Pages)** → **Create** → **Pages** sekmesi →
   **Connect to Git**.
3. **GitHub** → **Authorize / Install & Authorize** → repoya erişim izni verin.
   (`Only select repositories` → `brams-tr_website` seçmeniz yeterli.)
4. Repo listesinden **`bugrahanyapilmisev/brams-tr_website`** → **Begin setup**.

### Build ayarları — kritik nokta

Bu bir statik site; **hiçbir build komutu çalıştırılmamalı**.

| Alan | Değer |
|---|---|
| Project name | `brams-tr` |
| Production branch | `main` |
| Framework preset | **None** |
| Build command | **boş bırakın** |
| Build output directory | `/` |
| Root directory | **boş bırakın** |

5. **Save and Deploy**.

Yayın 30–60 saniyede biter. Size `brams-tr.pages.dev` gibi bir adres verir —
alan adını bağlamadan önce siteyi burada test edin.

> **Kontrol listesi (pages.dev üzerinde):**
> - Ana sayfa hero'da logo plaketi görünüyor mu?
> - Nav'daki TR/EN geçişi çalışıyor mu? (`/en/index.html`)
> - `/iletisim.html` formunda "Gönder" e-posta uygulamasını açıyor mu?
> - Mobil görünüm (telefonunuzdan açın) düzgün mü?
> - `brams-tr.pages.dev/olmayan-sayfa` → 404 sayfası geliyor mu?

---

## Adım 2 — brams-tr.com alan adını bağlayın

1. Pages projesi → **Custom domains** sekmesi → **Set up a custom domain**.
2. `brams-tr.com` yazın → **Continue** → **Activate domain**.

Alan adı aynı Cloudflare hesabında olduğu için **DNS kaydını Cloudflare kendisi
oluşturur** — elle CNAME/A kaydı girmenize gerek yok. Oluşturduğu kayıt:

| Type | Name | Target | Proxy |
|---|---|---|---|
| CNAME | `brams-tr.com` (kök) | `brams-tr.pages.dev` | Proxied (turuncu bulut) |

> Cloudflare kökte CNAME'i **CNAME flattening** ile destekler; bu yüzden apex
> alan adı için A kaydına ihtiyaç yoktur.

3. Aynı ekranda ikinci kez **Set up a custom domain** → `www.brams-tr.com` ekleyin.
   Bu da otomatik olarak `brams-tr.pages.dev`'e CNAME olarak bağlanır.

**Status** sütunu `Active` olana kadar bekleyin (genelde 1–5 dakika, ilk sertifika
için nadiren 15 dakikaya kadar çıkabilir).

---

## Adım 2.5 — URL biçimi hakkında bilmeniz gereken tek şey

Cloudflare Pages, `hakkimizda.html` dosyasını **`/hakkimizda`** adresinde sunar ve
`/hakkimizda.html` isteğini otomatik olarak `/hakkimizda`'ya (308) yönlendirir.

Bu davranışa uyum sağlanmıştır: sitedeki tüm `canonical`, `hreflang`, `og:url`
etiketleri ve `sitemap.xml` kayıtları **uzantısız** biçimdedir
(`https://brams-tr.com/hakkimizda`). Sayfa içi bağlantılar `.html` uzantılıdır —
bu her ortamda (Pages, yerel sunucu, dosya sistemi) çalışır; Pages tarafında
tek bir zararsız yönlendirme adımı oluşur.

> `_redirects` dosyasına `/hakkimizda → /hakkimizda.html` gibi bir kural
> **eklemeyin** — Pages'in kendi yönlendirmesiyle sonsuz döngü oluşur.
> Dosyanın içindeki not bunu hatırlatıyor.

---

## Adım 3 — www → kök yönlendirmesi

İki alan adının da aynı içeriği ayrı ayrı sunması SEO açısından istenmez. Sitedeki
tüm `canonical` etiketleri `https://brams-tr.com/...` olduğu için `www`'yu köke
yönlendirin.

**Cloudflare Dashboard → brams-tr.com (Websites listesinden) → Rules → Redirect Rules
→ Create rule**

- **Rule name:** `www to apex`
- **If — Custom filter expression:**
  - Field: `Hostname` · Operator: `equals` · Value: `www.brams-tr.com`
- **Then — Type:** `Dynamic`
  - **Expression:** `concat("https://brams-tr.com", http.request.uri.path)`
  - **Status code:** `301`
  - ☑ **Preserve query string**
- **Deploy**

Test: `http://www.brams-tr.com/hakkimizda.html` → `https://brams-tr.com/hakkimizda.html`

---

## Adım 4 — SSL / HTTPS ayarları

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

## Adım 5 — Performans ayarları (opsiyonel ama önerilir)

**Dashboard → brams-tr.com → Speed → Optimization**

- **Brotli**: Açık (varsayılan açıktır)
- **Early Hints**: Açık
- **HTTP/3 (with QUIC)**: Açık (Network sekmesi)
- **0-RTT Connection Resumption**: Açık (Network sekmesi)

**Caching → Configuration**
- **Browser Cache TTL**: `Respect Existing Headers` — repodaki `_headers` dosyası
  görselleri 1 yıl, HTML'i her istekte doğrulanacak şekilde ayarlıyor.

**Auto Minify** artık Cloudflare panelinde yok (kaldırıldı); dosyalar
elle sıkıştırılmadı, gerek de yok — CSS 27 KB, JS 5 KB civarı.

---

## Adım 6 — E-posta (info@brams-tr.com)

Site `info@brams-tr.com` adresini gösteriyor. Bu adresin çalışması için
alan adına e-posta kurulması gerekir; Pages bunu yapmaz.

**En hızlı yol — Cloudflare Email Routing (ücretsiz, yönlendirme):**

1. Dashboard → brams-tr.com → **Email** → **Email Routing** → **Get started**.
2. Cloudflare gerekli MX ve TXT (SPF) kayıtlarını otomatik ekler → onaylayın.
3. **Destination addresses** → mevcut kişisel/kurumsal adresinizi ekleyin ve
   gelen doğrulama e-postasındaki bağlantıya tıklayın.
4. **Routing rules** → **Create address**: `info@brams-tr.com` → hedef adresiniz.

Bu yalnızca **gelen** postayı yönlendirir. `info@brams-tr.com` adresinden
**gönderim** yapmak isterseniz gerçek bir posta kutusu gerekir (Google Workspace,
Microsoft 365, Zoho Mail vb.). O durumda ilgili sağlayıcının MX kayıtlarını
Cloudflare DNS'e ekleyin ve Email Routing'i kapatın — ikisi aynı anda MX
sahibi olamaz.

> Alan adında hiç e-posta kullanmayacaksanız, spam'i azaltmak için yine de
> bir SPF kaydı ekleyin:
> `TXT` · `@` · `v=spf1 -all`

---

## Adım 7 — Yayın sonrası SEO

1. **Google Search Console** → **Add property** → **URL prefix** →
   `https://brams-tr.com`
   - Doğrulama: **DNS record** yöntemi en kolayı. Verilen `TXT` kaydını
     Cloudflare DNS → **Records** → **Add record** ile ekleyin
     (Type `TXT`, Name `@`, Content Google'ın verdiği değer).
2. **Sitemaps** → `https://brams-tr.com/sitemap.xml` gönderin.
3. **International Targeting** sekmesinde hreflang hatası olmadığını kontrol edin
   (site TR/EN çiftlerini `x-default` ile birlikte tanımlıyor).
4. İsterseniz **Bing Webmaster Tools**'a da aynı sitemap'i ekleyin.

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

---

## Alternatif: GitHub Pages + Cloudflare DNS

Pages yerine GitHub Pages kullanmak isterseniz kayıtları elle girmeniz gerekir.
Bu senaryoda Cloudflare yalnızca DNS + CDN olur.

1. GitHub → repo → **Settings → Pages** → Source: `Deploy from a branch` →
   Branch: `main` / `root` → Save.
2. Aynı ekranda **Custom domain**: `brams-tr.com` → Save.
   (Bu, repoya bir `CNAME` dosyası ekler.)
3. Cloudflare DNS → **Records** → şu kayıtları ekleyin:

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | DNS only (gri bulut) |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `bugrahanyapilmisev.github.io` | DNS only |

4. GitHub sertifikayı üretene kadar proxy'yi **DNS only** bırakın; `Enforce HTTPS`
   seçeneği aktifleşince proxy'yi açabilirsiniz.

5. **Önemli:** GitHub Pages uzantısız URL'leri desteklemez — `/hakkimizda` 404 verir,
   yalnızca `/hakkimizda.html` çalışır. Bu yolu seçerseniz canonical etiketlerini
   geri çevirin. Proje kökünde:

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

> Pages'e kıyasla dezavantajları: `_headers` ve `_redirects` dosyaları çalışmaz,
> önizleme yayınları ve rollback yoktur, sertifika kurulumu daha kırılgandır,
> canonical URL'leri elle çevirmek gerekir. Bu yüzden **Cloudflare Pages önerilir**.

---

## Sorun giderme

| Belirti | Sebep / Çözüm |
|---|---|
| `brams-tr.com` "Error 522" veya boş sayfa | Custom domain henüz `Active` değil. Pages → Custom domains ekranında durumu bekleyin. |
| Alan adı hâlâ eski/park sayfasını gösteriyor | Tarayıcı ve DNS önbelleği. Gizli sekmede deneyin; `nslookup brams-tr.com` ile CNAME'i doğrulayın. |
| CSS yüklenmiyor, sayfa düz metin | `Build output directory` yanlış. `/` olmalı, `dist` veya `public` değil. |
| Türkçe karakterler bozuk (Ã§, Ä±) | Dosya UTF-8 olarak kaydedilmemiş. Editörde encoding'i UTF-8 (BOM'suz) yapın. |
| Sitede eski içerik görünüyor | Cloudflare önbelleği: Caching → **Purge Everything**. |
| Formda "Gönder" hiçbir şey yapmıyor | Ziyaretçinin cihazında varsayılan e-posta uygulaması tanımlı değil. Kalıcı çözüm: README bölüm 7'deki form işleyicisine geçin. |
| `www` yönlendirmesi çalışmıyor | Redirect Rule'un `brams-tr.com` zone'unda (Pages projesinde değil) tanımlı olduğundan emin olun. |
