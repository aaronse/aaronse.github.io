Below is a **production-ready, developer-facing spec** you can hand directly to a VS Code agent. It is structured to minimize ambiguity and maximize execution quality.

---

# 📄 Spec: Instrument Battery Guide Web Page with Evidence Links

## 🧠 Objective

Enhance the existing static HTML page (`phone-battery-life-guide.html`) by:

1. **Adding evidence-backed links** to authoritative sources
2. **Maintaining simplicity for casual readers**
3. **Enabling deeper exploration for curious users**
4. **Preserving performance, readability, and visual clarity**

---

## 🎯 Design Principles

### 1. Progressive Disclosure

* Default view: simple, family-friendly
* Enhanced view: optional, deeper technical references

### 2. Trust Through Transparency

* All claims should be **backed by credible sources**
* Avoid overwhelming users with citations inline

### 3. Non-Intrusive UX

* No clutter
* No academic-style citation overload
* Use subtle indicators (icons, expandable sections)

---

## 📦 Inputs

### Required Files

* `phone-battery-life-guide.html` (existing page)

### Optional Enhancements

* `evidence.json` (structured references, see below)

---

## 🧱 Feature Requirements

---

# 1. 🔗 Evidence Anchoring System

## Goal

Attach evidence to key claims without breaking readability.

## Implementation

### Add inline evidence icons:

* Use: `🔍` or `📚` (small, subtle)
* Place after claims like:

  * "20–80% is best"
  * "Heat is the #1 killer"
  * "1.5×–2× longer lifespan"

### Example:

```html
<strong>20%–80%</strong> 🔍
```

### Behavior:

* Clicking icon → opens:

  * Tooltip OR modal OR expandable panel

---

# 2. 📚 Evidence Panel (Core Feature)

## Option A (Preferred): Expandable Inline Section

Add collapsible section per card:

```html
<details class="evidence">
  <summary>📚 See evidence</summary>
  <ul>
    <li><a href="..." target="_blank">Battery University: BU-808</a></li>
    <li><a href="..." target="_blank">Apple Battery Health Docs</a></li>
  </ul>
</details>
```

## Option B: Global Evidence Drawer

* Floating button: “📚 Evidence”
* Opens side panel with categorized sources

---

# 3. 🧾 Evidence Data Model

Create optional structured file:

### `evidence.json`

```json
{
  "charge_range": [
    {
      "title": "Battery University - How to Prolong Lithium-Based Batteries",
      "url": "https://batteryuniversity.com/article/bu-808-how-to-prolong-lithium-based-batteries",
      "type": "research"
    },
    {
      "title": "Apple - Batteries and Performance",
      "url": "https://support.apple.com/en-us/HT208387",
      "type": "manufacturer"
    }
  ],
  "heat_damage": [
    {
      "title": "Cadex - Effects of Temperature on Li-ion",
      "url": "https://batteryuniversity.com/article/bu-502-discharging-at-high-and-low-temperatures",
      "type": "research"
    }
  ],
  "cycle_life": [
    {
      "title": "NREL Battery Degradation Study",
      "url": "https://www.nrel.gov/docs/fy14osti/62813.pdf",
      "type": "research"
    }
  ]
}
```

---

# 4. 🧩 Mapping Content → Evidence

Agent must map claims to categories:

| Section        | Evidence Key        |
| -------------- | ------------------- |
| 20–80% rule    | `charge_range`      |
| Heat warning   | `heat_damage`       |
| Lifespan gain  | `cycle_life`        |
| Smart charging | `manufacturer_docs` |

---

# 5. 🎨 UI Enhancements

## Styling for Evidence

Add CSS:

```css
.evidence {
  margin-top: 10px;
  font-size: 0.85rem;
  color: var(--muted);
}

.evidence a {
  color: var(--accent);
  text-decoration: none;
}

.evidence a:hover {
  text-decoration: underline;
}
```

---

# 6. ⚡ Performance Constraints

* No external JS frameworks
* Minimal JS (vanilla only)
* No blocking network calls
* Inline JSON or preloaded data preferred

---

# 7. 🧠 Content Rules for Agent

## DO:

* Use **authoritative sources only**

  * Battery University
  * Apple / Android docs
  * Academic / NREL / IEEE
* Keep links:

  * Relevant
  * Non-duplicative
  * Stable (avoid random blogs)

## DO NOT:

* Add spammy or SEO sites
* Overload with >3–5 links per section
* Break layout or spacing

---

# 8. 🧪 Validation Checklist

Agent must verify:

### Functional

* [ ] Evidence sections expand/collapse
* [ ] Links open in new tab
* [ ] No layout shift or overflow

### UX

* [ ] Page still readable without opening evidence
* [ ] No visual clutter
* [ ] Mobile responsive

### Content

* [ ] Every major claim has at least 1 source
* [ ] No incorrect or misleading sources

---

# 9. 🚀 Optional Enhancements (Stretch)

## A. Trust Badges

Add small labels:

* 🧪 Research-backed
* 🏭 Manufacturer guidance

---

## B. Evidence Strength Indicator

```html
<span class="evidence-level">High confidence</span>
```

---

## C. Toggle Mode

Add toggle:

* “Simple Mode” (default)
* “Deep Dive Mode” (shows all evidence inline)

---

# 10. 🧭 Example Final Output (Concept)

```
Keep it between 20–80% 🔍

[📚 See evidence]
• Battery University (cycle life vs voltage)
• Apple battery guidance
```

---

# 🧠 Objective Coach Notes (for Dev Agent)

* This is NOT a research paper
* This is a **trust-enhanced consumer guide**
* Optimize for:

  * clarity first
  * credibility second
  * depth third

👉 If you make it feel academic, you failed
👉 If you add zero evidence, you also failed

---

# 📦 Deliverables

Agent should output:

1. Updated HTML file
2. (Optional) `evidence.json`
3. Minimal JS (if used)
4. Summary of:

   * sources added
   * mapping decisions

---

# ✅ Success Criteria

* A family member can read it in 60 seconds
* A technical user can verify claims in 2 minutes
* Page still feels clean, modern, and fast

---

If you want, I can go one step further and:

* Pre-populate the **exact evidence.json with best-in-class sources**
* Or generate the **fully instrumented HTML** so your agent just refines it instead of starting from scratch
