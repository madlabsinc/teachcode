module.exports = {
  title: "teachcode",
  description: "Learn to code effectively",
  head: [["link", { rel: "icon", href: "images/logo.png" }]],
  themeConfig: {
    repo: "madlabsinc/teachcode",
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
    ],
    sidebar: {
      "/guide/": [
        {
          title: "Guide",
          children: ["installation", "commands", "contributing"],
        },
      ],
    },
    docsDir: "docs",
    editLinks: true,
    editLinkText: "Edit this page on GitHub",
  },
};
