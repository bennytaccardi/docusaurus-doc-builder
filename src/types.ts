export interface Item {
  repoName: string,
  owner: string,
  branch: string,
  remoteDocsDir: string,
  localDocsSubdir: string,
  token: string
}

export interface PluginOptions {
  docSource: Item[],
  localDocsDir: string
}

export interface GHFile {
  name: string;
  type: string;
  download_url: string;
  path: string;
}
