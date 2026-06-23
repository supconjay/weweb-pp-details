<template>
  <div class="pp-root" :class="themeClass" :style="rootStyle">
    <div class="pp-grid">
      <!-- address column -->
      <div class="pp-card pp-addresscard">
        <h2 class="pp-card__heading">
          <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('map-pin')"></path></svg> Address
        </h2>
        <a class="pp-link" href="#" @click.prevent="emit('address')">
          {{ content.address }}
          <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('external')"></path></svg>
        </a>
        <button
          v-if="content.showOtherProjects !== false && content.otherProjectsCount != null && Number(content.otherProjectsCount) > 0"
          type="button"
          class="pp-otherproj"
          @click="emit('otherProjects')"
        >
          <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('copy')"></path></svg>
          {{ content.otherProjectsCount }} other {{ Number(content.otherProjectsCount) === 1 ? 'project' : 'projects' }} at this address
        </button>
        <div class="pp-map">
          <iframe
            v-if="mapSrc"
            class="pp-map__frame"
            :src="mapSrc"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
          <template v-else>
            <div class="pp-map__placeholder"></div>
            <div class="pp-map__pin">
              <strong>{{ content.locationTitle }}</strong>
              <span>{{ content.locationSub }}</span>
              <span class="pp-map__link">View on Google Maps</span>
            </div>
          </template>
        </div>

        <div class="pp-field" v-if="content.creationDate">
          <span class="pp-field__label">Creation Date</span>
          <span class="pp-field__value">{{ content.creationDate }}</span>
        </div>

        <div class="pp-field">
          <span class="pp-field__label">Inspection Report</span>
          <div class="pp-filechips">
            <button v-for="(f, i) in files" :key="i" type="button" class="pp-filechip" :title="fileName(f)" @click="emitFile(i, f)">
              <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('file')"></path></svg>
              <span class="pp-filechip__name">{{ fileName(f) }}</span>
            </button>
            <span v-if="!files.length" class="pp-field__value pp-muted">No file uploaded</span>
          </div>
          <button v-if="content.showUploadButton !== false" type="button" class="pp-btn pp-btn--upload" @click="emit('uploadInspection')">
            <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('upload')"></path></svg>
            {{ content.uploadButtonLabel || 'Upload File' }}
          </button>
        </div>

        <div class="pp-field">
          <span class="pp-field__label">Utilities</span>
          <div class="pp-utils">
            <span v-for="u in utilities" :key="u.key" class="pp-util" :class="{ 'pp-util--on': u.on }">
              <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic(u.icon)"></path></svg>
              {{ u.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- meta + key/values -->
      <div class="pp-detailcol">
        <div class="pp-statrow">
          <div class="pp-ministat">
            <div class="pp-ministat__icon"><svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('check-circle')"></path></svg></div>
            <span class="pp-ministat__label">Estimate Status</span>
            <span class="pp-ministat__value" :class="`pp-text--${estTone}`">{{ content.estimateStatus }}</span>
          </div>
          <button type="button" class="pp-ministat pp-ministat--btn" @click="emit('assignee')">
            <div class="pp-ministat__icon"><svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('user')"></path></svg></div>
            <span class="pp-ministat__label">Assignee</span>
            <span class="pp-ministat__value">{{ content.assignee }}</span>
          </button>
          <button type="button" class="pp-ministat pp-ministat--btn" @click="emit('client')">
            <div class="pp-ministat__icon"><svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('building')"></path></svg></div>
            <span class="pp-ministat__label">Client</span>
            <span class="pp-ministat__value">{{ content.client }}</span>
          </button>
        </div>
        <div class="pp-card pp-kvcard">
          <div class="pp-kv" v-for="(kv, i) in fields" :key="i">
            <span class="pp-kv__label">{{ fieldLabel(kv) }}</span>
            <span class="pp-kv__value" :class="{ 'pp-muted': !fieldValue(kv) }">{{ fieldValue(kv) || '—' }}</span>
          </div>
          <div v-if="!fields.length" class="pp-kv"><span class="pp-kv__value pp-muted">No fields</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const ICONS = {
  "map-pin": "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  "check-circle": "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  building: "M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  copy: "M9 9h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  water: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z",
  electricity: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  gas: "M12 2s5 4.5 5 9a5 5 0 0 1-10 0c0-1.5.5-3 1.5-4.5C9 8 12 2 12 2zM12 22a3 3 0 0 1-3-3c0-1.5 1.5-3 3-4.5 1.5 1.5 3 3 3 4.5a3 3 0 0 1-3 3z",
};

export default {
  props: { content: { type: Object, required: true }, uid: { type: String, required: false } },
  emits: ["trigger-event"],
  computed: {
    files() { return Array.isArray(this.content.inspectionFiles) ? this.content.inspectionFiles : []; },
    fields() { return Array.isArray(this.content.fields) ? this.content.fields : []; },
    utilities() {
      return [
        { key: "water", label: "Water", icon: "water", on: this.content.utilityWater !== false },
        { key: "electricity", label: "Electricity", icon: "electricity", on: this.content.utilityElectricity !== false },
        { key: "gas", label: "Gas", icon: "gas", on: this.content.utilityGas === true },
      ];
    },
    estTone() {
      const s = (this.content.estimateStatus || "").toLowerCase();
      if (s.includes("approv")) return "success";
      if (s.includes("declin") || s.includes("reject")) return "danger";
      if (s.includes("pend") || s.includes("draft")) return "info";
      return "muted";
    },
    mapSrc() {
      const key = this.content.googleApiKey;
      const type = this.content.mapType || "place";
      if (!key || type === "none") return "";
      if (type === "streetview") {
        const lat = this.content.mapLat, lng = this.content.mapLng;
        if (lat == null || lng == null || lat === "" || lng === "") return "";
        return `https://www.google.com/maps/embed/v1/streetview?key=${encodeURIComponent(key)}&location=${lat},${lng}`;
      }
      const q = this.content.mapQuery || this.content.address || "";
      const zoom = this.content.mapZoom != null ? `&zoom=${this.content.mapZoom}` : "";
      return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}${zoom}`;
    },
    themeClass() {
      const m = this.content.darkMode || "auto";
      return { "pp-auto": m === "auto", "pp-dark": m === "dark", "pp-light": m === "light" };
    },
    rootStyle() {
      return {
        "--pp-primary": this.content.primaryColor || "#10b981",
        "--pp-accent": this.content.accentColor || "#6366f1",
        "--pp-radius": (this.content.radius != null ? this.content.radius : 16) + "px",
      };
    },
  },
  methods: {
    ic(name) { return ICONS[name] || ""; },
    fileName(f) {
      const raw = f && typeof f === "object" ? f.name || "" : f || "";
      try { return decodeURIComponent(raw); } catch (e) { return raw; }
    },
    fieldLabel(kv) { return kv && typeof kv === "object" ? kv.label : ""; },
    fieldValue(kv) { return kv && typeof kv === "object" ? kv.value : kv; },
    emit(name) { this.$emit("trigger-event", { name, event: {} }); },
    emitFile(i, f) { this.$emit("trigger-event", { name: "fileClick", event: { index: i, name: (f && f.name) || f || "" } }); },
  },
};
</script>

<style lang="scss" scoped>
.pp-root {
  --surface: #ffffff; --surface-2: #f7f9fc; --surface-3: #eef2f7; --border: #e4e9f0; --border-strong: #d4dbe6;
  --text: #1f2a37; --text-muted: #64748b; --text-subtle: #94a3b8;
  --shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.06);
  --shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
  --success: #10b981; --warning: #f59e0b; --danger: #ef4444; --info: #3b82f6;
  --primary: var(--pp-primary, #10b981); --accent: var(--pp-accent, #6366f1); --radius: var(--pp-radius, 16px);
  box-sizing: border-box; width: 100%; max-width: 100%; container-type: inline-size; color: var(--text);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.45;
}
.pp-root *, .pp-root *::before, .pp-root *::after { box-sizing: border-box; }
@mixin dark {
  --surface: #161f30; --surface-2: #1b2638; --surface-3: #202c40; --border: #28344a; --border-strong: #34425c;
  --text: #e8eef7; --text-muted: #94a3b8; --text-subtle: #64748b;
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 12px 28px rgba(0, 0, 0, 0.35);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.pp-root.pp-dark { @include dark; }
@media (prefers-color-scheme: dark) { .pp-root.pp-auto { @include dark; } }

.pp-grid { display: grid; grid-template-columns: 1fr; gap: 18px; align-items: start; }
.pp-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); padding: clamp(16px, 2.4vw, 24px); }
.pp-card__heading { margin: 0; font-size: 15px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; }
.pp-card__heading .pp-svg { width: 18px; height: 18px; color: var(--primary); }
.pp-detailcol { display: flex; flex-direction: column; gap: 14px; }

.pp-link { display: inline-flex; align-items: center; gap: 6px; color: var(--info); font-weight: 600; text-decoration: none; margin: 6px 0 14px; word-break: break-word; }
.pp-link .pp-svg { width: 14px; height: 14px; }
.pp-link:hover { text-decoration: underline; }

.pp-map { position: relative; height: 190px; border-radius: 12px; overflow: hidden; margin-bottom: 16px; border: 1px solid var(--border); }
.pp-map__frame { width: 100%; height: 100%; border: 0; display: block; }
.pp-map__placeholder { position: absolute; inset: 0; background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, var(--surface-2)), var(--surface-3)), var(--surface-2); }
.pp-map__placeholder::after { content: ""; position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 28px 28px; opacity: .5; }
.pp-map__pin { position: absolute; top: 12px; left: 12px; display: flex; flex-direction: column; gap: 1px; padding: 8px 11px; border-radius: 9px; background: rgba(15, 23, 42, .82); color: #fff; font-size: 11px; z-index: 1; }
.pp-map__pin strong { font-size: 12px; }
.pp-map__link { color: #8ec5ff; }

.pp-field { padding: 12px 0; border-top: 1px solid var(--border); }
.pp-field:first-of-type { border-top: none; }
.pp-field__label { display: block; font-weight: 700; color: var(--text); margin-bottom: 5px; }
.pp-field__value { color: var(--text); }
.pp-muted { color: var(--text-muted); }

.pp-filechips { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.pp-filechip { display: inline-flex; align-items: center; gap: 7px; max-width: 100%; min-width: 0; padding: 7px 11px; border: none; border-radius: 9px; background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger); font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background .15s; }
.pp-filechip:hover { background: color-mix(in srgb, var(--danger) 20%, transparent); }
.pp-filechip .pp-svg { width: 14px; height: 14px; flex: none; }
.pp-filechip__name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.pp-otherproj { display: inline-flex; align-items: center; gap: 6px; margin: -6px 0 14px; padding: 0; border: none; background: none; color: var(--text-muted); font-size: 12.5px; font-weight: 600; font-family: inherit; cursor: pointer; transition: color .15s; }
.pp-otherproj:hover { color: var(--primary); }
.pp-otherproj .pp-svg { width: 14px; height: 14px; flex: none; }

.pp-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; border: 1px solid transparent; border-radius: 10px; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; transition: filter .15s, background .15s, border-color .15s; }
.pp-btn .pp-svg { width: 15px; height: 15px; }
.pp-btn--upload { margin-top: 10px; background: color-mix(in srgb, var(--primary) 12%, transparent); color: var(--primary); border: 1px dashed color-mix(in srgb, var(--primary) 45%, transparent); }
.pp-btn--upload:hover { background: color-mix(in srgb, var(--primary) 20%, transparent); border-style: solid; }

.pp-utils { display: flex; flex-wrap: wrap; gap: 8px; }
.pp-util { display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px; border-radius: 999px; font-size: 12.5px; font-weight: 600; background: var(--surface-3); color: var(--text-subtle); border: 1px solid var(--border); }
.pp-util .pp-svg { width: 14px; height: 14px; opacity: .7; }
.pp-util--on { background: color-mix(in srgb, var(--primary) 14%, transparent); color: var(--primary); border-color: color-mix(in srgb, var(--primary) 30%, transparent); }
.pp-util--on .pp-svg { opacity: 1; }

.pp-statrow { display: grid; grid-template-columns: 1fr; gap: 12px; }
.pp-ministat { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px 14px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 5px; box-shadow: var(--shadow-sm); }
.pp-ministat--btn { cursor: pointer; font-family: inherit; transition: border-color .15s, transform .1s; }
.pp-ministat--btn:hover { border-color: var(--primary); }
.pp-ministat--btn:active { transform: translateY(1px); }
.pp-ministat__icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: color-mix(in srgb, var(--primary) 12%, transparent); color: var(--primary); margin-bottom: 2px; }
.pp-ministat__icon .pp-svg { width: 17px; height: 17px; }
.pp-ministat__label { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-subtle); font-weight: 600; }
.pp-ministat__value { font-weight: 700; color: var(--text); }

.pp-kvcard { padding: 6px clamp(16px, 2.4vw, 22px); }
.pp-kv { display: grid; grid-template-columns: 1fr; gap: 4px; padding: 14px 0; border-top: 1px solid var(--border); }
.pp-kv:first-child { border-top: none; }
.pp-kv__label { font-weight: 700; color: var(--text); }
.pp-kv__value { color: var(--text-muted); }

.pp-text--success { color: var(--success); }
.pp-text--danger { color: var(--danger); }
.pp-text--info { color: var(--info); }
.pp-text--muted { color: var(--text-muted); }
.pp-svg { display: block; }

/* Responsive to the element's OWN width (works regardless of viewport /
   device-preview quirks). Mobile-first single column, expand as it gets wider. */
@container (min-width: 560px) {
  .pp-statrow { grid-template-columns: repeat(3, 1fr); }
  .pp-kv { grid-template-columns: 180px 1fr; gap: 16px; }
}
@container (min-width: 760px) {
  .pp-grid { grid-template-columns: minmax(0, 340px) minmax(0, 1fr); }
}
/* Fallback for engines without container query support */
@supports not (container-type: inline-size) {
  @media (min-width: 760px) {
    .pp-grid { grid-template-columns: minmax(0, 340px) minmax(0, 1fr); }
    .pp-statrow { grid-template-columns: repeat(3, 1fr); }
    .pp-kv { grid-template-columns: 180px 1fr; gap: 16px; }
  }
}
</style>
