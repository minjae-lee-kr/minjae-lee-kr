import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";
import {
  PIN,
  validateBundle,
} from "../docs/notes/retention-boundary/contract.js";

const exec = promisify(execFile);
const hub = fileURLToPath(new URL("../", import.meta.url));
const source = path.resolve(hub, "../intent-recovery-lab");
const destination = path.join(hub, "docs/notes/retention-boundary");
const displayFiles = [
  "index.html",
  "retention.css",
  "retention.js",
  "contract.js",
  "mapping.json",
];
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

// The source checkout is trusted during capture. Reject links and missing inputs;
// finish every read/validation before writing any generated public asset.
export async function captureInputs(sourceRoot, noteRoot) {
  async function regular(root, relative) {
    const segments = relative.split("/");
    let current = root;
    if ((await lstat(current)).isSymbolicLink())
      throw new Error("Linked source root");
    for (const segment of segments) {
      if (!segment || segment === "." || segment === "..")
        throw new Error("Invalid input path");
      current = path.join(current, segment);
      if ((await lstat(current)).isSymbolicLink())
        throw new Error("Linked input");
    }
    const info = await lstat(current);
    if (!info.isFile() || info.size > 2_000_000)
      throw new Error("Invalid input file");
    const bytes = await readFile(current);
    if (
      /(?:^|["\s])(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)/m.test(
        bytes.toString("utf8"),
      )
    )
      throw new Error("Absolute private path in public input");
    return bytes;
  }
  const raw = await regular(sourceRoot, `reports/${PIN.runId}/evidence.json`);
  const files = new Map();
  for (const name of displayFiles)
    files.set(name, await regular(noteRoot, name));
  return { raw, files };
}

async function historicalSourceCheck(sourceRoot, report) {
  const git = async (args, encoding = "utf8") =>
    (
      await exec("git", args, {
        cwd: sourceRoot,
        windowsHide: true,
        timeout: 10_000,
        maxBuffer: 2_000_000,
        encoding,
      })
    ).stdout;
  if (!(await lstat(path.join(sourceRoot, ".git"))).isDirectory())
    throw new Error("Expected nested source repository");
  if (
    path
      .resolve((await git(["rev-parse", "--show-toplevel"])).trim())
      .toLowerCase() !== path.resolve(sourceRoot).toLowerCase()
  )
    throw new Error("Unexpected Git root");
  const revision = (await git(["rev-parse", "HEAD"])).trim();
  const dirty =
    (await git(["status", "--porcelain", "--untracked-files=all"])).length > 0;
  const manifest = report.sourceBefore.files;
  if (digest(JSON.stringify(manifest)) !== PIN.sourceSha256)
    throw new Error("Historical manifest hash mismatch");
  // Read historical Git blobs, not the moving checkout. Later documentation
  // commits must never relabel the recorded engine revision.
  for (let i = 0; i < manifest.length; i += 8) {
    await Promise.all(
      manifest.slice(i, i + 8).map(async (entry) => {
        if (
          !/^[A-Za-z0-9._/-]+$/.test(entry.path) ||
          entry.path.startsWith("/") ||
          entry.path.split("/").includes("..")
        )
          throw new Error("Unsafe historical path");
        const blob = await git(
          ["show", `${PIN.revision}:${entry.path}`],
          "buffer",
        );
        if (digest(blob) !== entry.sha256)
          throw new Error(`Historical source bytes mismatch: ${entry.path}`);
      }),
    );
  }
  return {
    revision,
    dirty,
    note: "Checkout at import; the evidence remains attributed to the historical sourceRevision.",
  };
}

export async function bundleRetention() {
  if (path.resolve(await realpath(source)) !== path.resolve(source))
    throw new Error("Unexpected source path");
  const { raw, files } = await captureInputs(source, destination);
  if (digest(raw) !== PIN.rawSha256)
    throw new Error("Original recording hash mismatch");
  const report = JSON.parse(raw.toString("utf8"));
  const checkout = await historicalSourceCheck(source, report);
  const manifest = {
    schemaVersion: 1,
    kind: "historical-retention-note",
    readOnly: true,
    sourceRevision: PIN.revision,
    sourceFingerprint: PIN.sourceSha256,
    rawSha256: PIN.rawSha256,
    rawFile: "recording/evidence.json",
    mappingSha256: digest(files.get("mapping.json")),
    runId: PIN.runId,
    capturedAt: PIN.completedAt,
    bundledAt: new Date().toISOString(),
    sourceCheckoutAtImport: checkout,
    historicalGitBlobsVerified: true,
    presentation:
      "Expected values are presentation assertions against one frozen capture, not measurements. Display files were authored separately from the recorded engine. No execution authentication is claimed.",
    files: [...files, ["recording/evidence.json", raw]].map(
      ([name, bytes]) => ({ path: name, sha256: digest(bytes) }),
    ),
  };
  await validateBundle(raw, files.get("mapping.json"), manifest);
  // All inputs, historical blobs and semantic relations are checked before writes.
  // This is a local build, not an atomic multi-file publication protocol.
  const recording = path.join(destination, "recording");
  if ((await lstat(destination)).isSymbolicLink())
    throw new Error("Linked output directory");
  await mkdir(recording, { recursive: true });
  if ((await lstat(recording)).isSymbolicLink())
    throw new Error("Linked recording directory");
  for (const [target, bytes] of [
    [path.join(recording, "evidence.json"), raw],
    [
      path.join(destination, "recording.json"),
      Buffer.from(JSON.stringify(manifest, null, 2) + "\n"),
    ],
  ]) {
    try {
      if ((await lstat(target)).isSymbolicLink())
        throw new Error("Linked output file");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    await writeFile(target, bytes);
  }
  const writtenRaw = await readFile(path.join(recording, "evidence.json"));
  const writtenManifest = JSON.parse(
    await readFile(path.join(destination, "recording.json"), "utf8"),
  );
  await validateBundle(
    writtenRaw,
    await readFile(path.join(destination, "mapping.json")),
    writtenManifest,
  );
  for (const entry of writtenManifest.files) {
    if (
      digest(await readFile(path.join(destination, entry.path))) !==
      entry.sha256
    )
      throw new Error("Derived file changed during bundle");
  }
  return {
    sourceRevision: PIN.revision,
    rawSha256: PIN.rawSha256,
    selectedRecords: 23,
    sourceCheckoutAtImport: checkout,
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (process.argv.length !== 2)
    throw new Error(
      "This command imports its one pinned capture and accepts no arguments.",
    );
  console.log(JSON.stringify(await bundleRetention(), null, 2));
}
