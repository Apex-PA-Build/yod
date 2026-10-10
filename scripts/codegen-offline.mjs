// Regenerates convex/_generated without a running deployment.
// `npx convex dev` produces the same files; use this only where no
// deployment is reachable (e.g. CI or sandboxed environments).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const COMPONENTS = { betterAuth: "@convex-dev/better-auth" };

execFileSync("npx", ["convex", "codegen", "--system-udfs", "--typecheck", "disable"], { stdio: "inherit" });

const dts = "convex/_generated/api.d.ts";
const js = "convex/_generated/api.js";

const componentTypes = Object.entries(COMPONENTS)
  .map(([name, pkg]) => `  ${name}: import("${pkg}/_generated/component.js").ComponentApi<"${name}">;`)
  .join("\n");

let d = readFileSync(dts, "utf8");
if (!d.includes("export declare const components")) {
  d += `\nexport declare const components: {\n${componentTypes}\n};\n`;
  writeFileSync(dts, d);
}

let j = readFileSync(js, "utf8");
if (!j.includes("componentsGeneric")) {
  j = j.replace(
    /import \{ anyApi \} from "convex\/server";/,
    'import { anyApi, componentsGeneric } from "convex/server";',
  );
  j += "export const components = componentsGeneric();\n";
  writeFileSync(js, j);
}
