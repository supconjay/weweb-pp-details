export default {
  editor: { label: { en: "Project Details" } },
  triggerEvents: [
    { name: "address", label: { en: "On address click" }, event: {} },
    { name: "assignee", label: { en: "On assignee click" }, event: {} },
    { name: "client", label: { en: "On client click" }, event: {} },
    { name: "uploadInspection", label: { en: "On inspection upload click" }, event: {} },
    { name: "fileClick", label: { en: "On inspection file click" }, event: { index: 0, name: "" } },
    { name: "otherProjects", label: { en: "On 'other projects' click" }, event: {} },
    { name: "utilityClick", label: { en: "On utility click (toggle/update)" }, event: { key: "", label: "", on: true, next: false } },
    { name: "fieldEdit", label: { en: "On field saved (inline edit)" }, event: { index: 0, label: "", key: "", value: "", valueLabel: "", type: "", patch: {}, field: {} } },
  ],
  properties: {
    // ---- address column ----
    address: { label: { en: "Address" }, type: "Text", defaultValue: "1525 Wedgefield Court, Marietta, GA 30064, USA", bindable: true },
    showOtherProjects: { label: { en: "Show 'other projects' line" }, type: "OnOff", defaultValue: true, bindable: true },
    otherProjectsCount: { label: { en: "Other projects at address" }, type: "Number", defaultValue: 1, bindable: true },
    locationTitle: { label: { en: "Map title" }, type: "Text", defaultValue: "1525 Wedgefield Ct", bindable: true },
    locationSub: { label: { en: "Map subtitle" }, type: "Text", defaultValue: "Marietta, Georgia", bindable: true },
    // ---- google map embed ----
    googleApiKey: { label: { en: "Google Maps API key" }, type: "Text", defaultValue: "", bindable: true, section: "settings" },
    mapType: {
      label: { en: "Map type" }, type: "TextSelect",
      options: { options: [
        { value: "place", label: { en: "Place (uses address)" } },
        { value: "streetview", label: { en: "Street View (uses lat/lng)" } },
        { value: "none", label: { en: "None (styled placeholder)" } },
      ] }, defaultValue: "place", bindable: true, section: "settings",
    },
    mapQuery: { label: { en: "Map query (override address)" }, type: "Text", defaultValue: "", bindable: true, section: "settings" },
    mapLat: { label: { en: "Latitude (Street View)" }, type: "Number", defaultValue: null, bindable: true, section: "settings" },
    mapLng: { label: { en: "Longitude (Street View)" }, type: "Number", defaultValue: null, bindable: true, section: "settings" },
    mapZoom: { label: { en: "Place zoom (0-21)" }, type: "Number", options: { min: 0, max: 21 }, defaultValue: 17, bindable: true, section: "settings" },
    creationDate: { label: { en: "Creation date" }, type: "Text", defaultValue: "04/11/2025", bindable: true },
    inspectionFiles: {
      label: { en: "Inspection files" }, type: "Array", bindable: true,
      defaultValue: [{ name: "inspection.pdf" }],
    },
    showUploadButton: { label: { en: "Show upload button" }, type: "OnOff", defaultValue: true, bindable: true },
    uploadButtonLabel: { label: { en: "Upload button label" }, type: "Text", defaultValue: "Upload File", bindable: true },
    // ---- utilities (toggles) ----
    utilityWater: { label: { en: "Utility: Water" }, type: "OnOff", defaultValue: true, bindable: true, section: "settings" },
    utilityElectricity: { label: { en: "Utility: Electricity" }, type: "OnOff", defaultValue: true, bindable: true, section: "settings" },
    utilityGas: { label: { en: "Utility: Gas" }, type: "OnOff", defaultValue: false, bindable: true, section: "settings" },
    // ---- meta stats ----
    estimateStatus: { label: { en: "Estimate status" }, type: "Text", defaultValue: "Approved", bindable: true },
    assignee: { label: { en: "Assignee" }, type: "Text", defaultValue: "Charlie Binder", bindable: true },
    client: { label: { en: "Client" }, type: "Text", defaultValue: "Repipe Specialists - Sales", bindable: true },
    // ---- inline editing ----
    allowInlineEdit: { label: { en: "Allow inline field editing" }, type: "OnOff", defaultValue: true, bindable: true },

    // ---- key/value fields ----
    // Bound data only needs { label, value } (plus url/href/link for link fields).
    // Edit behavior is configured separately in "Field editors" (matched by label),
    // so binding this array does NOT strip editability. You can still override
    // per-field with inline: editable, type, optionsKey/optionLabel/optionValue.
    fields: {
      label: { en: "Detail fields" }, type: "Array", bindable: true,
      defaultValue: [
        { label: "Scope", value: "<span style=\"color: rgb(154, 166, 184);\">Resident said: bathroom wall has water damage\\ Additional Details: paint is bubbling and there is discoloration near the ceiling\\ \\ Permission to Enter: Yes\\ \\ Entry Notes: I will be present to assist</span>" },
        { label: "Notes", value: "Homeowner prefers morning access. Pets on site." },
        { label: "Access", value: "Lockbox code provided on arrival day." },
        { label: "Document Display Type", value: "recSW1LwXkYTfcK4E" },
        { label: "Portal Link", value: "https://app.propertymeld.com/1845/v/10589/meld/13193048/summary/" },
      ],
    },

    // ---- field editors: which fields are inline-editable + how (matched by label) ----
    // `match` matches the field's label (or key), case-insensitive.
    //   type: "multiline" | "select" | "url" | "text"
    //   for select: optionsKey (into Option sources) + optionLabel + optionValue
    // Because this is keyed by label, binding the fields array above keeps editing.
    fieldEditors: {
      label: { en: "Field editors (by label)" }, type: "Array", bindable: true, section: "settings",
      defaultValue: [
        { match: "Scope", type: "multiline" },
        { match: "Notes", type: "multiline" },
        { match: "Access", type: "multiline" },
        { match: "Document Display Type", type: "select", optionsKey: "documentTypes", optionLabel: "name", optionValue: "airtable_id", optionIcon: "attachments" },
        { match: "Portal Link", type: "url" },
      ],
    },

    // ---- dropdown sources for "select" fields (e.g. Document Display Type) ----
    // Bind to your collection; a field's optionsKey selects which list.
    //   e.g. { documentTypes: collections['<id>']?.['data'] }
    // Accepts a bare array, a { key: [...] } map, or [{ key, options }] pairs.
    optionSources: {
      label: { en: "Option sources (bind)" }, type: "Array", bindable: true, section: "settings",
      defaultValue: [
        {
          key: "documentTypes",
          options: [
            { name: "Home Ease", attachments: "https://iepfgtjizwzbdgxyzaab.supabase.co/storage/v1/object/public/avatars/headers/Image%20(2).jpg", airtable_id: "recbrBJ87fISg6mLu" },
            { name: "Cobranded", attachments: "https://iepfgtjizwzbdgxyzaab.supabase.co/storage/v1/object/public/avatars/headers/Image%20(3).jpg", airtable_id: "recMvSigWNRTRgTD2" },
            { name: "Superior", attachments: "https://iepfgtjizwzbdgxyzaab.supabase.co/storage/v1/object/public/avatars/headers/1_Superior_C_M_logo.png", airtable_id: "recSW1LwXkYTfcK4E" },
          ],
        },
      ],
    },
    primaryColor: { label: { en: "Primary color" }, type: "Color", defaultValue: "#10b981", bindable: true },
    accentColor: { label: { en: "Accent color" }, type: "Color", defaultValue: "#6366f1", bindable: true },
    darkMode: {
      label: { en: "Theme mode" }, type: "TextSelect",
      options: { options: [
        { value: "auto", label: { en: "Auto (system)" } },
        { value: "light", label: { en: "Light" } },
        { value: "dark", label: { en: "Dark" } },
      ] }, defaultValue: "auto", bindable: true,
    },
    radius: { label: { en: "Corner radius (px)" }, type: "Number", options: { min: 0, max: 32, step: 1 }, defaultValue: 16, bindable: true },
  },
};
