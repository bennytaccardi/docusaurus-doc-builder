import { LoadContext, Plugin } from "@docusaurus/types";
import { GHFile, Item, PluginOptions } from "./types";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

async function downloadRemoteDoc(item: Item, rootRemoteDir: string, localDir: string): Promise<void> {
  const baseUrl = `https://api.github.com/repos/${item.owner}/${item.repoUrl}/contents/${item.remoteDir}?ref=${item.branch}`;
  const header = item.token ? { Authorization: `token ${item.token}` } : {};

  try {
    const response = await axios.get(baseUrl, { headers: header });
    const files = response.data as GHFile[];
    files.map(async (file) => {
      if (file.type === "file") {
        const fileResponse = await axios.get(file.download_url, { responseType: "arraybuffer" });
        const localFilePath = path.join(localDir, item.repoUrl, path.relative(rootRemoteDir, file.path));
        const localDirPath = `./${path.dirname(localFilePath)}`;
        if (!fs.existsSync(localDirPath)) {
          fs.mkdirSync(localDirPath, { recursive: true });
        }

        fs.writeFileSync(`./${localFilePath}`, fileResponse.data);
      } else if (file.type === "dir") {
        await downloadRemoteDoc({ ...item, remoteDir: file.path }, rootRemoteDir, localDir);
      }
    })
  } catch (e) {
    console.error((e as Error).message);
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
