const fs = require("fs");
const path = require("path");

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "continuity.manifest.json"), "utf8"));
const required = [manifest.boot, manifest.entrypoint, ...manifest.domains];

const missing = required.filter(p => !fs.existsSync(path.join(root, p)));
if (missing.length) {
  console.error(JSON.stringify({ status: "FAIL", missing }));
  process.exit(1);
}

const emptyDomains = manifest.domains.filter(d => {
  const target = path.join(root, d);
  return !fs.readdirSync(target).length;
});
if (emptyDomains.length) {
  console.error(JSON.stringify({ status: "FAIL", emptyDomains }));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "PASS",
  capsule: manifest.capsule,
  checked: required.length
}, null, 2));
