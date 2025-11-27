# WordPress Integrasjonsguide for Sykkelrådgiveren

## Metode 1: Iframe (Enklest - Anbefalt)

### Steg 1: Last opp filene
1. Gå til WordPress admin → **Media** → **Add New**
2. Last opp `index.html`, `style.css`, og `script.js` til Media Library
3. Kopier URL-en til `index.html`

### Steg 2: Legg til på siden
1. Rediger siden der du vil ha rådgiveren
2. Legg til en **Custom HTML** block
3. Lim inn denne koden:

```html
<iframe 
    src="URL_TIL_DIN_INDEX.HTML" 
    style="width: 100%; border: none; min-height: 800px;"
    id="bike-advisor-iframe"
    title="Sykkelrådgiver"
></iframe>

<script>
// Auto-resize iframe
window.addEventListener('message', function(e) {
    if (e.data.type === 'setHeight') {
        document.getElementById('bike-advisor-iframe').style.height = e.data.height + 'px';
    }
});
</script>
```

---

## Metode 2: Direkte innbygging (Mer kontroll)

### Steg 1: Last opp filene via FTP/cPanel
1. Koble til via FTP eller cPanel File Manager
2. Naviger til `/wp-content/uploads/bike-advisor/`
3. Last opp alle filene (`index.html`, `style.css`, `script.js`)

### Steg 2: Legg til på siden
1. Rediger siden i WordPress
2. Legg til en **Custom HTML** block
3. Lim inn:

```html
<div id="bike-advisor-wrapper">
    <link rel="stylesheet" href="/wp-content/uploads/bike-advisor/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Kopier hele innholdet fra index.html her (fra <div id="bike-advisor-container"> til slutten) -->
    
    <script src="/wp-content/uploads/bike-advisor/script.js"></script>
</div>
```

---

## Metode 3: Plugin (Mest profesjonelt)

### Bruk "Insert Headers and Footers" plugin:
1. Installer plugin: **Insert Headers and Footers**
2. Gå til **Settings** → **Insert Headers and Footers**
3. I "Body" seksjonen, lim inn:

```html
<script>
// Last inn rådgiveren kun på spesifikk side
if (window.location.pathname.includes('/sykkelradgiver/')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/wp-content/uploads/bike-advisor/style.css';
    document.head.appendChild(link);
}
</script>
```

---

## Tips for best resultat:

### 1. Full bredde side
Bruk en **full-width page template** i WordPress for best visning.

### 2. Fjern padding
Legg til i WordPress Customizer → Additional CSS:

```css
.bike-advisor-page .entry-content {
    padding: 0 !important;
    max-width: 100% !important;
}
```

### 3. Skjul header/footer (valgfritt)
For en "app-lignende" opplevelse:

```css
.bike-advisor-page .site-header,
.bike-advisor-page .site-footer {
    display: none;
}
```

---

## Anbefaling
Start med **Metode 1 (iframe)** - det er enklest og mest pålitelig. Hvis du trenger mer kontroll senere, kan du bytte til Metode 2.
