# Docusaurus-doc-builder

`doc-builder` plugin, is an open-source Docusaurus plugin useful for building your documentation that relies on different repositories. 
## Getting started

### Prerequisites
In order to install `doc-builder` plugin you should initialize a [new Docusaurus project](https://docusaurus.io/docs/installation).
### Install doc-builder plugin
The installation is pretty simple.
You have to install the plugin using npm command
`npm i docusaurus-doc-builder`
After that you should configure it whitin Docusaurus.

In your `docusarus.config.ts`, under "plugins" item, you should set `doc-builder` plguin like the following
```

 plugins: [
    ["./plugins/doc-builder/", {
      docSource: [{
        ...
      }],
      localDocsDir: "docs"
    }],
  ],
```

### Set up the doc-builder plugin
`doc-builder` plugin offers a couple of customizations described in the following bullet list:

- "repoName": Is the name of your repository from which you desire to grasp the documentation;
- "owner": is the owner of the repository itself. Useful to get the proper remote files;
- "branch": is the branch from which you desire to grasp your documentation;
- "remoteDocsDir": is the remote dir in which the documentation has been placed;
- "localDocsDir": is the local dir in which Docusaurus renders the documentation
- "localDocsSubdir": is the local dir in which you would to save your documentation (and it will be under ./${localDocsDir}/${localDocsSubdir});
