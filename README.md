# FreshBite — Fersk mat, levert til deg

En fullstack restaurant-nettside med online bestilling, kortbetaling og e-postbekreftelser.

---

## Innholdsfortegnelse

- [Teknologier](#teknologier)
- [Arkitektur](#arkitektur)
- [Kom i gang](#kom-i-gang)
- [Miljøvariabler](#miljøvariabler)
- [Database (Supabase)](#database-supabase)
- [Betaling (Stripe)](#betaling-stripe)
- [E-post (Resend)](#e-post-resend)
- [Edge Functions](#edge-functions)
- [Testkort](#testkort)
- [Prosjektstruktur](#prosjektstruktur)
- [Kommandoer](#kommandoer)

---

## Teknologier

| Lag | Teknologi |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Betaling | Stripe (Elements + PaymentIntents) |
| E-post | Resend |
| Serverless | Supabase Edge Functions (Deno) |
| Routing | React Router DOM |
| Testing | Vitest |

---

## Arkitektur

```
Bruker (nettleser)
  │
  ├── React-app (Vite)
  │     ├── /             → Forside med meny og handlekurv
  │     ├── /om-oss       → Om oss-side
  │     ├── /bekreftelse  → Ordrebekreftelse etter kjøp
  │     └── /*            → 404-side (norsk)
  │
  ├── Supabase (Database)
  │     ├── menu_items     → Menydata (rett, pris, kategori, bilde)
  │     ├── orders         → Bestillinger med kontaktinfo og betalingsstatus
  │     └── order_items    → Linjer per bestilling
  │
  ├── Supabase Edge Functions
  │     ├── create-payment-intent  → Oppretter Stripe PaymentIntent
  │     └── send-order-email       → Sender ordrebekreftelse via Resend
  │
  └── Eksterne API-er
        ├── Stripe API     → Kortbetaling
        └── Resend API     → Transaksjonelle e-poster
```

---

## Kom i gang

### Forutsetninger

- Node.js ≥ 18 og npm
- En [Supabase](https://supabase.com)-konto (gratis)
- En [Stripe](https://stripe.com)-konto (gratis testmodus)
- (Valgfritt) En [Resend](https://resend.com)-konto for e-postbekreftelser

### Installasjon

```sh
# 1. Klon repoet
git clone <ditt-repo-url>
cd flavor-flair-emporium

# 2. Installer avhengigheter
npm install

# 3. Konfigurer miljøvariabler
cp .env.example .env.local
# Fyll inn nøklene (se "Miljøvariabler" under)

# 4. Kjør databaseskriptet i Supabase SQL Editor
#    Kopier innholdet fra supabase/schema.sql og kjør det

# 5. Start utviklingsserveren
npm run dev
```

Appen åpnes på `http://localhost:8080`.  
Hvis Supabase ikke er konfigurert, brukes automatisk lokal fallback-data for menyen.

---

## Miljøvariabler

Opprett `.env.local` i prosjektroten (aldri commit denne):

```env
# Supabase — Hentes fra supabase.com/dashboard → Settings → API
VITE_SUPABASE_URL=https://<prosjekt-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<din-anon-key>

# Stripe — Hentes fra dashboard.stripe.com/test/apikeys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> **Merk:** Hemmelige nøkler (Stripe secret key, Resend API key) lagres **ikke** i `.env.local`. De settes som Supabase Edge Function-secrets (se under).

---

## Database (Supabase)

Prosjektet bruker Supabase sitt **gratisnivå** (500 MB database, 50 000 requests/mnd).

### Tabeller

| Tabell | Beskrivelse |
|---|---|
| `menu_items` | Matretter med navn, beskrivelse, pris, kategori og bilde-URL |
| `orders` | Bestillinger med kontaktinfo (navn, e-post, telefon, adresse), betalingsstatus og total |
| `order_items` | Enkeltlinjer i en bestilling (vare, antall, pris) |

### Oppsett

1. Gå til [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor
2. Lim inn og kjør innholdet fra `supabase/schema.sql`
3. Skriptet oppretter tabellene, seed-data for menyen, og RLS-policyer

### RLS-policyer (Row Level Security)

- `menu_items` — lesbar for alle (public SELECT)
- `orders` — skriving tillatt med gyldig `payment_reference` (public INSERT med sjekk)
- `order_items` — skriving tillatt for eksisterende ordrer (public INSERT med sjekk)
- `orders` / `order_items` — lesbar for autentiserte brukere (for fremtidig admin-panel)
- Database-constraints validerer e-postformat, telefon, postnummer (4 siffer) og maks-lengder

---

## Betaling (Stripe)

Stripe brukes i **testmodus** — ingen ekte penger belastes.

### Flyt

1. Bruker legger varer i handlekurven
2. Fyller ut kontaktinfo (navn, e-post, telefon, adresse)
3. Stripe Elements-kortfelt vises
4. Frontend kaller Edge Function `create-payment-intent`
5. Edge Function oppretter en `PaymentIntent` via Stripe API
6. Frontend bekrefter betalingen med `confirmCardPayment`
7. Ordre lagres i Supabase med betalingsreferanse
8. Bruker sendes til bekreftelsessiden

### Nøkler

| Nøkkel | Hvor | Formål |
|---|---|---|
| `pk_test_...` | `.env.local` (`VITE_STRIPE_PUBLISHABLE_KEY`) | Frontendens Stripe Elements |
| `sk_test_...` | Supabase Edge Function secret (`STRIPE_SECRET_KEY`) | ServerSide PaymentIntent-opprettelse |

### Fallback

Hvis Stripe-nøkkelen ikke er satt i `.env.local`, vises en melding om at betaling ikke er tilgjengelig.

---

## E-post (Resend)

Ordrebekreftelser sendes via [Resend](https://resend.com) og er **valgfritt**.

- Avsender: `FreshBite <onboarding@resend.dev>` (Resends standard-avsender)
- Gratisnivå: 3 000 e-poster/mnd, men kun til **din registrerte e-postadresse** med standard-avsender
- For å sende til alle kunder: Legg til og verifiser et eget domene i Resend-dashbordet

### Nøkkel

| Nøkkel | Hvor |
|---|---|
| `re_...` | Supabase Edge Function secret (`RESEND_API_KEY`) |

Hvis `RESEND_API_KEY` ikke er satt, hopper appen over e-postsending uten feil.

---

## Edge Functions

To Supabase Edge Functions kjører server-side logikk:

### `create-payment-intent`

- **Formål:** Oppretter en Stripe PaymentIntent server-side
- **Fil:** `supabase/functions/create-payment-intent/index.ts`
- **Secrets:** `STRIPE_SECRET_KEY`
- **Endepunkt:** `POST <supabase-url>/functions/v1/create-payment-intent`

### `send-order-email`

- **Formål:** Sender ordrebekreftelse via Resend
- **Fil:** `supabase/functions/send-order-email/index.ts`
- **Secrets:** `RESEND_API_KEY`
- **Endepunkt:** `POST <supabase-url>/functions/v1/send-order-email`

### Deploy Edge Functions

```sh
# Sett access-token (hentes fra supabase.com/dashboard/account/tokens)
$env:SUPABASE_ACCESS_TOKEN = "sbp_..."

# Link prosjektet
npx supabase link --project-ref <prosjekt-id>

# Sett hemmeligheter
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
npx supabase secrets set RESEND_API_KEY=re_...

# Deploy
npx supabase functions deploy create-payment-intent --no-verify-jwt
npx supabase functions deploy send-order-email --no-verify-jwt
```

---

## Testkort

For å teste betaling i Stripe sin testmodus:

| Kortnummer | Utløpsdato | CVC | Resultat |
|---|---|---|---|
| `4242 4242 4242 4242` | Vilkårlig fremtidig | `123` | Vellykket betaling |
| `4000 0000 0000 0002` | Vilkårlig fremtidig | `123` | Avvist kort |
| `4000 0025 0000 3155` | Vilkårlig fremtidig | `123` | Krever 3D Secure |

---

## Prosjektstruktur

```
├── public/                  # Statiske filer
├── src/
│   ├── components/          # React-komponenter
│   │   ├── ui/              # shadcn/ui-komponenter
│   │   ├── CartDrawer.tsx   # Handlekurv + checkout-flyt
│   │   ├── FoodCard.tsx     # Matrett-kort
│   │   ├── Footer.tsx       # Bunntekst med navigasjon
│   │   ├── HeroSection.tsx  # Hero-banner
│   │   ├── MenuSection.tsx  # Menyvisning med kategorifilter
│   │   ├── Navbar.tsx       # Navigasjonsbar (responsiv)
│   │   ├── NavLink.tsx      # Navigasjonslenke
│   │   └── StripeCardPayment.tsx  # Stripe Elements-kortfelt
│   ├── context/
│   │   └── CartContext.tsx   # Delt handlekurv-tilstand
│   ├── data/
│   │   └── menu.ts          # Lokal fallback-menydata
│   ├── hooks/
│   │   └── useCart.ts        # Handlekurv-logikk (med localStorage-persistering)
│   ├── lib/
│   │   ├── sanitize.ts      # Input-sanitisering (XSS-beskyttelse)
│   │   ├── supabase.ts      # Supabase-klient
│   │   └── utils.ts         # Hjelpefunksjoner
│   ├── pages/
│   │   ├── Index.tsx         # Forside
│   │   ├── About.tsx         # Om oss
│   │   ├── OrderConfirmation.tsx  # Ordrebekreftelse
│   │   └── NotFound.tsx      # 404-side (norsk)
│   ├── services/
│   │   ├── menuService.ts    # Hent meny fra Supabase/fallback
│   │   ├── orderService.ts   # Lagre bestillinger
│   │   ├── stripeService.ts  # Stripe-integrasjon
│   │   └── emailService.ts   # E-postbekreftelse
│   ├── types/
│   │   ├── food.ts           # FoodItem / CartItem
│   │   └── order.ts          # CheckoutContactInfo
│   ├── App.tsx               # Routing + CartProvider
│   └── main.tsx              # Inngangspunkt
├── supabase/
│   ├── schema.sql            # Database-skjema + seed-data
│   └── functions/
│       ├── create-payment-intent/index.ts
│       └── send-order-email/index.ts
├── .env.example              # Mal for miljøvariabler
├── .env.local                # Faktiske nøkler (ikke i git)
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── vitest.config.ts
```

---

## Kommandoer

| Kommando | Beskrivelse |
|---|---|
| `npm run dev` | Start utviklingsserver |
| `npm run build` | Bygg for produksjon |
| `npm run preview` | Forhåndsvis produksjonsbygg |
| `npm run test` | Kjør tester (Vitest) |
| `npm run test:watch` | Kjør tester i watch-modus |
| `npm run lint` | Kjør ESLint |
