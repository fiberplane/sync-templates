// functions for interacting with the fp-cli, should be replaced with a proper
// API client when we get around to it

const FP = "/usr/local/bin/fp";
const decoder = new TextDecoder();

export async function createTemplate(
  templateFile: string,
  templatesDirectory: string,
  apiToken: string,
  workspaceId: string,
  fpBaseUrl: string,
) {
  console.log(`Creating template ${templatesDirectory + templateFile}`);

  const command = new Deno.Command(FP, {
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


export async function updateTemplate(
  templateFile: string,
  templatesDirectory: string,
  apiToken: string,
  workspaceId: string,
  fpBaseUrl: string,
) {
  console.log(`Updating template ${templatesDirectory + templateFile}`);

  const command = new Deno.Command(FP, {
    cwd: templatesDirectory,
    args: [
      "templates",
      "update",
      templateFile.replace(".jsonnet", ""),
      "--template-path",
      templateFile,
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

export async function validateTemplate(
  templateFile: string,
  templatesDirectory: string,
) {
  console.log(`Validating template ${templatesDirectory + templateFile}`);

  const command = new Deno.Command(FP, {
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
