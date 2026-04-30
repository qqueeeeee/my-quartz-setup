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
        header: "Geist",
        body: "Geist",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#181616",
          lightgray: "#282727",
          gray: "#9e9b93",
          darkgray: "#c5c9c5",
          dark: "#c5c9c5",
          secondary: "#8ba4b0",
          tertiary: "#87a987",
          highlight: "rgba(139, 164, 176, 0.12)",
          textHighlight: "rgba(196, 178, 138, 0.18)",
        },
        darkMode: {
          light: "#181616",
          lightgray: "#282727",
          gray: "#9e9b93",
          darkgray: "#c5c9c5",
          dark: "#c5c9c5",
          secondary: "#8ba4b0",
          tertiary: "#87a987",
          highlight: "rgba(139, 164, 176, 0.12)",
          textHighlight: "rgba(196, 178, 138, 0.18)",
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
