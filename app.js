// sync color picker and hex input
document.getElementById('brand-color').addEventListener('input', function () {
  document.getElementById('color-hex').value = this.value;
});

document.getElementById('color-hex').addEventListener('input', function () {
  if (/^#[0-9a-fA-F]{6}$/.test(this.value)) {
    document.getElementById('brand-color').value = this.value;
  }
});

// ---------- COLOR UTILITIES ----------

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(v => Math.max(0, Math.min(255, Math.round(v)))
    .toString(16).padStart(2, '0')).join('');
}

function lighten(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

function darken(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function isLight(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function textOn(hex) {
  return isLight(hex) ? '#1a1a1a' : '#ffffff';
}

function generatePalette(primary) {
  return [
    { label: 'Lightest', hex: lighten(primary, 0.85) },
    { label: 'Light',    hex: lighten(primary, 0.6)  },
    { label: 'Soft',     hex: lighten(primary, 0.35) },
    { label: 'Primary',  hex: primary                },
    { label: 'Dark',     hex: darken(primary, 0.25)  },
    { label: 'Darker',   hex: darken(primary, 0.5)   },
    { label: 'Neutral',  hex: '#6b7280'              },
    { label: 'Surface',  hex: '#f9fafb'              },
  ];
}

// ---------- BORDER RADIUS BY STYLE ----------

function getRadius(style) {
  const map = {
    modern:    '8px',
    bold:      '4px',
    friendly:  '16px',
    corporate: '4px',
    creative:  '20px',
  };
  return map[style] || '8px';
}

function getFontStyle(style) {
  const map = {
    modern:    { family: "'Segoe UI', Arial, sans-serif", weight: '300' },
    bold:      { family: "Impact, Arial Black, sans-serif", weight: '900' },
    friendly:  { family: "'Comic Sans MS', Trebuchet MS, sans-serif", weight: '400' },
    corporate: { family: "Georgia, 'Times New Roman', serif", weight: '400' },
    creative:  { family: "'Trebuchet MS', Verdana, sans-serif", weight: '700' },
  };
  return map[style] || map.modern;
}

// ---------- RENDER SECTIONS ----------

function renderPalette(palette) {
  document.getElementById('palette-grid').innerHTML = palette.map(s => `
    <div class="swatch">
      <div class="swatch-color" style="background:${s.hex};"></div>
      <span class="swatch-label">${s.label}</span>
      <span class="swatch-hex">${s.hex}</span>
    </div>
  `).join('');
}

function renderTypography(brand, primary, style) {
  const font   = getFontStyle(style);
  const radius = getRadius(style);
  const rows   = [
    { label: 'Heading 1', size: '32px', weight: '700', text: `${brand} — Main heading` },
    { label: 'Heading 2', size: '22px', weight: '600', text: 'Section heading example' },
    { label: 'Body text', size: '16px', weight: '400', text: 'Body copy for paragraphs and descriptions.' },
    { label: 'Caption',   size: '12px', weight: '400', text: 'Small caption and helper text.' },
    { label: 'Link',      size: '14px', weight: '500', text: 'Clickable link text', color: primary },
  ];

  document.getElementById('type-showcase').innerHTML = rows.map(r => `
    <div class="type-row">
      <span class="type-meta">${r.label}</span>
      <span style="font-size:${r.size};font-weight:${r.weight};
        font-family:${font.family};color:${r.color || '#222'}">
        ${r.text}
      </span>
    </div>
  `).join('');
}

function renderButtons(primary, style) {
  const radius = getRadius(style);
  const dark   = darken(primary, 0.25);
  const light  = lighten(primary, 0.85);
  const textPrimary = textOn(primary);

  document.getElementById('btn-showcase').innerHTML = `
    <button class="ds-btn" style="background:${primary};color:${textPrimary};border-radius:${radius};border-color:${primary}">
      Primary
    </button>
    <button class="ds-btn" style="background:transparent;color:${primary};border-radius:${radius};border-color:${primary}">
      Outline
    </button>
    <button class="ds-btn" style="background:${light};color:${darken(primary,0.3)};border-radius:${radius};border-color:${light}">
      Soft
    </button>
    <button class="ds-btn" style="background:#1a1a1a;color:#fff;border-radius:${radius};border-color:#1a1a1a">
      Dark
    </button>
    <button class="ds-btn" style="background:#f0f0f0;color:#666;border-radius:${radius};border-color:#f0f0f0;cursor:not-allowed;opacity:0.6">
      Disabled
    </button>
  `;
}

function renderCards(primary, brand, style) {
  const radius = getRadius(style);
  const light  = lighten(primary, 0.85);
  const text   = textOn(primary);

  document.getElementById('card-showcase').innerHTML = `
    <div class="ds-card" style="background:#fff;border-radius:${radius}">
      <div class="ds-card-title">${brand} default card</div>
      <div class="ds-card-body">This is a standard surface card with a subtle border and neutral background.</div>
    </div>
    <div class="ds-card" style="background:${primary};border-color:${primary};border-radius:${radius}">
      <div class="ds-card-title" style="color:${text}">${brand} primary card</div>
      <div class="ds-card-body" style="color:${text};opacity:0.85">A filled card using the primary brand color as background.</div>
    </div>
    <div class="ds-card" style="background:${light};border-color:${light};border-radius:${radius}">
      <div class="ds-card-title" style="color:${darken(primary,0.4)}">${brand} soft card</div>
      <div class="ds-card-body">A gentle tinted card for callouts, tips, or highlights.</div>
    </div>
  `;
}

function renderForms(primary, style) {
  const radius = getRadius(style);

  document.getElementById('form-showcase').innerHTML = `
    <div>
      <label class="ds-label">Your name</label>
      <input class="ds-input" type="text" placeholder="e.g. Jane Smith"
        style="border-radius:${radius};"
        onfocus="this.style.borderColor='${primary}'"
        onblur="this.style.borderColor='#ddd'" />
    </div>
    <div>
      <label class="ds-label">Email address</label>
      <input class="ds-input" type="email" placeholder="jane@example.com"
        style="border-radius:${radius};"
        onfocus="this.style.borderColor='${primary}'"
        onblur="this.style.borderColor='#ddd'" />
    </div>
    <div>
      <label class="ds-label">Message</label>
      <textarea class="ds-input" rows="3" placeholder="Type your message..."
        style="border-radius:${radius};resize:vertical;"
        onfocus="this.style.borderColor='${primary}'"
        onblur="this.style.borderColor='#ddd'"></textarea>
    </div>
  `;
}

// ---------- MAIN GENERATE FUNCTION ----------

async function generateSystem() {
  const brand  = document.getElementById('brand-name').value.trim() || 'Brand';
  const color  = document.getElementById('color-hex').value.trim() || '#5a3fd6';
  const style  = document.getElementById('brand-style').value;
  const palette = generatePalette(color);

  // show loading
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('output').style.display  = 'none';

  // render everything locally first
  renderPalette(palette);
  renderTypography(brand, color, style);
  renderButtons(color, style);
  renderCards(color, brand, style);
  renderForms(color, style);

  // get AI guidelines
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are a brand designer. Write concise brand guidelines for a brand called "${brand}" with a ${style} personality and primary color ${color}.

Cover:
1. Brand voice (3 adjectives and what they mean in practice)
2. Color usage rules (when to use primary vs neutral vs soft)
3. Typography rules (heading vs body usage)
4. Button usage (when to use primary vs outline vs soft)
5. Do's and don'ts (2 of each)

Keep it practical and under 250 words.`
        }]
      })
    });

    const data = await res.json();
    document.getElementById('guidelines-box').textContent = data.content[0].text;
  } catch (err) {
    document.getElementById('guidelines-box').textContent =
      'Could not load AI guidelines. Check your connection and try again.';
  }

  // show output
  document.getElementById('loading').style.display = 'none';
  document.getElementById('output').style.display  = 'block';
}