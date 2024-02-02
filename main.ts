async function validateTemplate(
  templateFile: string,
  templatesDirectory: string,
) {
  console.log(`Validating template ${templatesDirectory + templateFile}`);

  const command = new Deno.Command(fp, {
    cwd: templatesDirectory,
    args: ["templates", "validate", templateFile],
    clearEnv: true,
  });

  const { code, stdout: stdoutBuf, stderr: stderrBuf } = await command.output();

  const stderr = decoder.decode(stderrBuf);
  const stdout = decoder.decode(stdoutBuf);

  if (code !== 0) {
    console.log(stdout + stderr);
    throw new Error(stderr);
  }

  console.log(stdout + stderr);
}

async function createTemplate(
  templateFile: string,
  templatesDirectory: string,
  apiToken: string,
  workspaceId: string,
  fpBaseUrl: string,
) {
  console.log(`Creating template ${templatesDirectory + templateFile}`);

  const command = new Deno.Command(fp, {
    cwd: templatesDirectory,
    args: [
      "templates",
      "create",
      templateFile,
      "--template-name",
      templateFile.replace(".jsonnet", ""),
      "--description",
      templateFile.replace(".jsonnet", ""),
      "--create-trigger",
      "false",
    ],
    clearEnv: true,
    env: {
      FP_TOKEN: apiToken,
      API_BASE: fpBaseUrl,
      WORKSPACE_ID: workspaceId,
    },
  });

  const { code, stdout: stdoutBuf, stderr: stderrBuf } = await command.output();

  const stderr = decoder.decode(stderrBuf);
  const stdout = decoder.decode(stdoutBuf);

  if (code !== 0) {
    console.log(stdout + stderr);
    throw new Error(stderr);
  }

  console.log(stdout + stderr);
}

// set up consts
const fp = "/usr/local/bin/fp";

const decoder = new TextDecoder();

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
