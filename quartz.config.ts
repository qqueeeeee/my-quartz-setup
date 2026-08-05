import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Sasank Kodamarthy",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "my-quartz-setup.shotzling.workers.dev",
    ignorePatterns: ["private", ".obsidian", "Templates"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Newsreader",
        body: "Geist",
        code: "Geist Mono",
      },
      colors: {
        lightMode: {
          light: "#fffcf0",
          lightgray: "#dad8ce",
          gray: "#6f6e69",
          darkgray: "#100f0f",
          dark: "#100f0f",
          secondary: "#24837b",
          tertiary: "#66800b",
          highlight: "rgba(36, 131, 123, 0.08)",
          textHighlight: "rgba(188, 82, 21, 0.15)",
        },
        darkMode: {
          light: "#100f0f",
          lightgray: "#343331",
          gray: "#878580",
          darkgray: "#cecdc3",
          dark: "#cecdc3",
          secondary: "#3aa99f",
          tertiary: "#879a39",
          highlight: "rgba(58, 169, 159, 0.10)",
          textHighlight: "rgba(218, 112, 44, 0.18)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      //Plugin.CustomOgImages(),
    ],
  },
}

export default config
