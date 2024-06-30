import axios from "axios";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { fetchFiles } from "../..";



const item = {
  owner: "testOwner",
  repoUrl: "testRepo",
  remoteDir: "testRemoteDir",
  branch: "testBranch",
  localName: "testLocalName",
  token: "testToken"
}
const ghFile = {
  name: "testfile.mmd",
  path: "testDir/testfile.mmd",
  download_url: "https://example.com/testFile.mmd",
  type: "file"
}
const mockResponse = { data: [ghFile] };
const rootRemoteDir = "rootRemoteDirTest";

describe("fetchFiles", () => {
  beforeAll(async () => {
    vi.spyOn(axios, "get").mockImplementation(vi.fn().mockResolvedValue(mockResponse));
  });

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
