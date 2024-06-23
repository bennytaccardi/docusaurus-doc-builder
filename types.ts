export interface Item {
  repoUrl: string,
  owner: string,
  branch: string,
  remoteDir: string,
  localName: string,
  token: string
}

export interface PluginOptions {
  docSource: Item[],
  localDir: string
}

export interface GHFile {
  name: string;
  type: string;
  download_url: string;
  path: string;
}
