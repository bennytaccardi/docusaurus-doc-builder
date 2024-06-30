import axios from "axios";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchFiles, processFile } from "../..";
import * as fs from "fs";
import * as path from "path";

const rootRemoteDir = "rootRemoteDirTest";
const item = {
  owner: "testOwner",
  repoUrl: "testRepo",
  remoteDir: "testRemoteDir",
  branch: "testBranch",
  localName: "testLocalName",
  token: "testToken"
}
const ghMMDFile = {
  name: "testfile.mmd",
  path: `${rootRemoteDir}/testDir/testfile.mmd`,
  download_url: "https://example.com/testFile.mmd",
  type: "file"
}
const mockResponse = { data: [ghMMDFile] };
const ghMDFile = {
  name: "testfile.md",
  path: `${rootRemoteDir}/testDir/testfile.md`,
  download_url: "https://example.com/testFile.md",
  type: "file"
}
const ghNotSupportedFile = {
  name: "testfile.zzz",
  path: `${rootRemoteDir}/testDir/testfile.zzz`,
  download_url: "https://example.com/testFile.zzz",
  type: "file"
}

describe("fetchFiles", () => {

  beforeAll(() => {
    vi.mock("fs");
  })
  it("Should fetch files from GitHub repository", async () => {
    vi.spyOn(axios, "get").mockImplementation(vi.fn().mockResolvedValue(mockResponse));
    const files = await fetchFiles(item, rootRemoteDir);
    expect(files).toEqual(mockResponse.data);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${item.owner}/${item.repoUrl}/contents/${item.remoteDir}?ref=${item.branch}`,
      { headers: { Authorization: `token ${item.token}` } }
    );
  });

  it("Should throw an error if the fetch fails", async () => {
    const testErrorMsg = "Error msg";
    vi.spyOn(axios, "get").mockRejectedValue(new Error(testErrorMsg))
    await expect(fetchFiles(item, rootRemoteDir)).rejects.toThrow(testErrorMsg);
  })
})

describe("processFile", () => {
  it("Should process and save a .mmd file as .md", async () => {
    vi.spyOn(fs, "mkdirSync").mockImplementationOnce(vi.fn());
    vi.spyOn(fs, "writeFileSync").mockImplementationOnce(vi.fn());
    const mockAxiosGet = vi.spyOn(axios, "get").mockImplementation(vi.fn().mockResolvedValue({ data: 'graph TD;' }));

    await processFile(ghMMDFile, item, rootRemoteDir, "testLocalDir");
    let expectedPath = path.join("testLocalDir", item.repoUrl, path.relative(rootRemoteDir, ghMMDFile.path));
    expectedPath = path.join(path.dirname(expectedPath), path.basename(expectedPath, path.extname(expectedPath)) + '.md');

    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(expectedPath), { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expectedPath,
      "```mermaid\ngraph TD;\n```"
    );
  });

  it("Should process and save a file different from .mmd file as .md", async () => {
    vi.spyOn(fs, "mkdirSync").mockImplementationOnce(vi.fn());
    vi.spyOn(fs, "writeFileSync").mockImplementationOnce(vi.fn());
    vi.spyOn(axios, "get").mockImplementation(vi.fn().mockResolvedValue({ data: ghMDFile }));
    await processFile(ghMDFile, item, rootRemoteDir, "testLocalDir");
    let expectedPath = path.join("testLocalDir", item.repoUrl, path.relative(rootRemoteDir, ghMDFile.path));
    expectedPath = path.join(path.dirname(expectedPath), path.basename(expectedPath, path.extname(expectedPath)) + '.md');

    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(expectedPath), { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expectedPath,
      ghMDFile
    );
  });

  it("Should not process if file is different from .md or .mmd", async () => {
    vi.spyOn(fs, "mkdirSync").mockImplementationOnce(vi.fn());
    vi.spyOn(fs, "writeFileSync").mockImplementationOnce(vi.fn());
    vi.spyOn(axios, "get").mockImplementation(vi.fn().mockResolvedValue({ data: ghNotSupportedFile }));
    await processFile(ghNotSupportedFile, item, rootRemoteDir, "testLocalDir");

    expect(fs.mkdirSync).toHaveBeenCalledTimes(0);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(0);
  });

})
