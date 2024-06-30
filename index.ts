import { LoadContext, Plugin } from "@docusaurus/types";
import { GHFile, Item, PluginOptions } from "./types";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";


export async function fetchFiles(item: Item, rootRemoteDir: string): Promise<GHFile[]> {
  const baseUrl = `https://api.github.com/repos/${item.owner}/${item.repoUrl}/contents/${item.remoteDir}?ref=${item.branch}`;
  const headers = item.token ? { Authorization: `token ${item.token}` } : {};

  try {
    const response = await axios.get(baseUrl, { headers });
    return response.data as GHFile[];
  } catch (error) {
    throw new Error(`Error fetching files from ${baseUrl}: ${(error as Error).message}`);
  }
}

export async function processFile(file: GHFile, item: Item, rootRemoteDir: string, localDir: string) {
  let localFilePath;
  let content;
  if (file.type === "file") {
    if (path.extname(file.name) === ".mmd") {
      const fileResponse = await axios.get(file.download_url, { responseType: "text" });
      content = `\`\`\`mermaid\n${fileResponse.data}\n\`\`\``;
    } else if (path.extname(file.name) === ".md") {
      const fileResponse = await axios.get(file.download_url, { responseType: "arraybuffer" });
      content = fileResponse.data;
    } else {
      return;
    }
    localFilePath = path.join(localDir, item.repoUrl, path.relative(rootRemoteDir, file.path));
    localFilePath = path.join(path.dirname(localFilePath), path.basename(localFilePath, path.extname(localFilePath)) + '.md');
    const localDirPath = path.dirname(localFilePath);
    if (!fs.existsSync(localDirPath)) {
      fs.mkdirSync(localDirPath, { recursive: true });
    }

    fs.writeFileSync(localFilePath, content);
  } else if (file.type === "dir") {
    await downloadRemoteDoc({ ...item, remoteDir: file.path }, rootRemoteDir, localDir);
  }
}

export async function downloadRemoteDoc(item: Item, rootRemoteDir: string, localDir: string): Promise<void> {
  try {
    const files = await fetchFiles(item, rootRemoteDir);
    await Promise.all(files.map(file => processFile(file, item, rootRemoteDir, localDir)));
  } catch (error) {
    console.error((error as Error).message);
  }
}

export default function docBuilder(context: LoadContext, options: PluginOptions): Plugin<void> {
  return {
    name: "doc-builder",
    extendCli(cli) {
      cli.command("build-doc").description("Downloads docs from remote repos").action(async () => {
        options.docSource.map(async (item) => {
          await downloadRemoteDoc(item, item.remoteDir, options.localDir ?? "docs");
        });
      })
    }
  }
} 
