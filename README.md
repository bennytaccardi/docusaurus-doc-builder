# Docusaurus-doc-builder

The doc-builder plugin is an open-source Docusaurus plugin designed to help you build documentation that spans multiple repositories.

## Getting started

### Prerequisites
Before installing the `doc-builder` plugin, ensure you have initialized a [new Docusaurus project](https://docusaurus.io/docs/installation).
### Install doc-builder plugin
To install the plugin, use the following npm command:
`npm i docusaurus-doc-builder`
After installation, you need to configure the plugin within Docusaurus.

### Configure Doc-Builder plugins

In your `docusarus.config.ts` file, under "plugins" section, configure the `doc-builder` plugin as follows:
```

 plugins: [
    ["docusaurus-doc-builder", {
      docSource: [{
        ...
      }],
      localDocsDir: "docs"
    }],
  ],
```

### Set up the doc-builder plugin
`doc-builder` plugin offers a couple of customizations described in the following bullet list:

- _repoName_: Is the name of your repository from which you desire to grasp the documentation;
- _owner_: is the owner of the repository itself. Useful to get the proper remote files;
- _branch_: is the branch from which you desire to grasp your documentation;
- _remoteDocsDir_: is the remote dir in which the documentation has been placed;
- _localDocsDir_: is the local dir in which Docusaurus renders the documentation;
- _localDocsSubdir_: is the local dir in which you would to save your documentation (and it will be under ./${localDocsDir}/${localDocsSubdir});
- _token_: is the GH token. Mandatory when a repository is private;

Example configuration:

```
plugins: [
  ["./plugins/doc-builder/", {
    docSource: [{
      repoName: "your-repo-name",
      owner: "repo-owner",
      branch: "main",
      remoteDocsDir: "path/to/docs",
      localDocsSubdir: "subdir"
    }],
    localDocsDir: "docs"
  }],
],
```
Currently, the `doc-builder` plugin supports only Markdown (.md) and Mermaid files.

By setting up the doc-builder plugin with these configurations, you can efficiently manage and build documentation from different repositories into your Docusaurus site.
