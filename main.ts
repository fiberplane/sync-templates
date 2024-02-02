import {
  createTemplate,
  listTemplates,
  validateTemplate,
  updateTemplate,
} from "./api.ts";

// set up consts
const API_TOKEN = Deno.env.get("API_TOKEN");
const WORKSPACE_ID = Deno.env.get("WORKSPACE_ID");
const FP_BASE_URL = Deno.env.get("FP_BASE_URL");
const TEMPLATES_DIRECTORY = Deno.env.get("TEMPLATES_DIRECTORY");

// check all inputs
if (!API_TOKEN) {
  console.log("api-token input is not set");
  Deno.exit(1);
}

if (!WORKSPACE_ID) {
  console.log("workspace-id input is not set");
  Deno.exit(1);
}

if (!FP_BASE_URL) {
  console.log(
    "fp-base-url input is not set (this is likely a bug in the action as default should be https://studio.fiberplane.com)",
  );
  Deno.exit(1);
}

if (!TEMPLATES_DIRECTORY) {
  console.log(
    "templates-directory input is not set (this is likely a bug in the action as default should be .fiberplane/templates/)",
  );
  Deno.exit(1);
}

const validatedEntries = [];

// read and validate all templates
for await (const dirEntry of Deno.readDir(TEMPLATES_DIRECTORY)) {
  if (dirEntry.isFile && dirEntry.name.endsWith(".jsonnet")) {
    try {
      await validateTemplate(dirEntry.name, TEMPLATES_DIRECTORY);
      validatedEntries.push(dirEntry);
    } catch (err) {
      console.log(err);
      Deno.exit(1);
    }
  }
}

// upload all templates
for (const dirEntry of validatedEntries) {
  try {
    await createTemplate(
      dirEntry.name,
      TEMPLATES_DIRECTORY,
      API_TOKEN,
      WORKSPACE_ID,
      FP_BASE_URL,
    );
  } catch (err) {
    console.log(err);
    Deno.exit(1);
  }
}

console.log("All templates created successfully!");
