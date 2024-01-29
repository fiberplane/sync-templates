// set up consts
const fp = "/usr/local/bin/fp";

const API_TOKEN = Deno.env.get("API_TOKEN");
const WORKSPACE_ID = Deno.env.get("WORKSPACE_ID");
const FP_BASE_URL = Deno.env.get("FP_BASE_URL");
const TEMPLATES_DIRECTORY = Deno.env.get("TEMPLATES_DIRECTORY");

async function main() {
  // check all inputs
  if (!API_TOKEN) {
    throw new Error("api-token is not set");
  }

  if (!WORKSPACE_ID) {
    throw new Error("workspace-id is not set");
  }

  if (!FP_BASE_URL) {
    throw new Error(
      "fp-base-url is not set (this is likely a bug in the action as default should be https://studio.fiberplane.com)",
    );
  }

  if (!TEMPLATES_DIRECTORY) {
    throw new Error(
      "templates-directory is not set (this is likely a bug in the action as default should be .fiberplane/templates/)",
    );
  }

  // for each file in the templates directory run the fp command

  for await (const dirEntry of Deno.readDir(TEMPLATES_DIRECTORY)) {
    console.log(dirEntry.name);
  }
}

main();
