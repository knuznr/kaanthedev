# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: proje veya işbirliği için ulaşan potansiyel müşteriler. Siteyi değerlendirme durumunda inceler, işin ciddiyetine ikna olup iletişime geçer.
Secondary: blog okuru akranlar (geliştiriciler). Yazıları okur, geri döner, zamanla güven biriktirir.

## Product Purpose

Kaan Uzuner'in portföy sitesi: founder ve developer kimliğini kanıtlar, Kolay Büro (hukuk büroları için legal operations platformu) dahil seçili işleri gösterir ve iki dönüşü üretir: doğrudan iletişim (contact) ve blog üzerinden geri dönüş.

## Positioning

Kurucu + geliştirici bir arada: gerçek iş için odaklı yazılım. Komşu bir portföyün kopyalayamayacağı şey kurucu-operatör geçmişi ve shipment kanıtıdır (Kolay Büro, seçili işler, yazılar).

## Operating Context

Tek sayfa ana akış (intro, work, writing, contact) + blog listesi ve yazı detayları + 404. İletişim formu `/api/contact` üzerinden çalışır. Ziyaretçi çoğunlukla ilk kez gelir, hızlı tarar, kanıt arar.

## Capabilities and Constraints

- Mevcut içerik aynen korunur: profil metinleri, projeler, beceriler, referans sözleri, blog yazıları. Yeni ticari iddia uydurulmaz.
- Mevcut rotalar ve iletişim akışı çalışır kalır.
- Dark mode desteklenir (nav'daki düğme); hareket prefers-reduced-motion'a saygı duyar.

## Brand Commitments

İsim ve ses korunur: kaan uzuner, küçük harf ses, doğrudan dil. Görsel dünya: minimal, metin odaklı, tek sütun, küçük harfli başlıklar; hareket CSS ve Framer Motion ile ince tutulur, light/dark desteklenir.

## Evidence on Hand

- Profil/proje/beceri/referans verileri: `app/lib/data/`
- Blog yazıları: `app/blog/posts/`
- Blog görselleri: `public/images/`

## Product Principles

1. Kanıt önce gelir: iddia değil iş, yazı ve referans konuşur.
2. İletişim her zaman bir kaydırma uzağındadır.
3. Blog ikincil dönüş hunisidir, ana akışı yavaşlatmaz.
4. Yoğunluk okunabilirliğe ve hıza tabiidir.
