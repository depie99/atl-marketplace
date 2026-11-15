window.__ModuleLoader__.load({id:"@depie99/atl-plugin",factory:(require)=>{var module={exports:{}};var exports=module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// plugins/deepseek-client.mjs
var deepseek_client_exports = {};
__export(deepseek_client_exports, {
  AtlPanel: () => AtlPanel,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(deepseek_client_exports);
var import_react = __toESM(require("react"), 1);
var h = import_react.default.createElement;
var PANEL = "atl-control-plane";
var inject = ["slots", "layout"];
function AtlPanel() {
  const [project, setProject] = (0, import_react.useState)("");
  const [panel, setPanel] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)("");
  async function open(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(new URL("api/atl/open", document.baseURI), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ project }) });
      const value = await response.json();
      if (!response.ok) throw new Error(value.error || `Could not open ATL (${response.status})`);
      setPanel(value);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  const buttonStyle = { border: "1px solid currentColor", borderRadius: 8, padding: "8px 14px", color: "inherit", background: "transparent", cursor: "pointer" };
  if (panel) return h(
    "section",
    { style: { display: "flex", flexDirection: "column", height: "100%", minHeight: 0 } },
    h("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "8px 16px", flexShrink: 0 } }, h("strong", null, "ATL"), h("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }, title: panel.project }, panel.project), h("button", { type: "button", style: buttonStyle, onClick: () => setPanel(null) }, "Change project")),
    h("iframe", { title: "ATL Control Plane", src: new URL(`api/atl/view?id=${encodeURIComponent(panel.id)}`, document.baseURI).href, style: { border: 0, width: "100%", flex: 1, minHeight: 400 }, allow: "clipboard-write" })
  );
  return h(
    "section",
    { style: { maxWidth: 680, margin: "48px auto", padding: 24, color: "inherit" } },
    h("h1", null, "ATL Control Plane"),
    h("p", null, "Plan work, review tasks and manage runs inside DeepSeek Harness."),
    h(
      "form",
      { onSubmit: open },
      h("label", { htmlFor: "atl-project", style: { display: "block", marginBottom: 8 } }, "Project directory"),
      h("input", { id: "atl-project", value: project, onChange: (event) => setProject(event.target.value), placeholder: "C:\\Projects\\my-app", required: true, disabled: busy, style: { width: "100%", padding: 12, border: "1px solid currentColor", borderRadius: 8, background: "transparent", color: "inherit", font: "inherit", marginBottom: 16 } }),
      h("p", { style: { opacity: 0.75 } }, "Use an absolute directory on the machine running DeepSeek. Opening prepares ATL project state and starts no workers."),
      h("button", { type: "submit", disabled: busy || !project.trim(), style: buttonStyle }, busy ? "Opening\u2026" : "Open Control Plane"),
      error ? h("p", { role: "alert" }, error) : null
    )
  );
}
function apply(ctx) {
  ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: PANEL }, AtlPanel));
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: PANEL, order: 15, label: () => "ATL" }, ({ size = 20 }) => h("span", { "aria-hidden": true, style: { fontSize: size, fontWeight: 700 } }, "\u25C7")));
  ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({ name: "plugins.bundle.config", key: "@depie99/atl-plugin" }, () => h("section", { style: { padding: "20px 0" } }, h("h2", null, "ATL Control Plane"), h("p", null, "Open the embedded workspace to select a project and manage your work."), h("button", { type: "button", onClick: () => ctx.layout.selectPanel(PANEL) }, "Open Control Plane"))));
}
return module.exports;}});
