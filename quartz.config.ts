import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
	configuration: {
		pageTitle: "Que's World",
		pageTitleSuffix: "",
		enableSPA: true,
		enablePopovers: true,
		analytics: {
			provider: "plausible",
		},
		locale: "en-US",
		baseUrl: "quartz.jzhao.xyz",
		ignorePatterns: ["private", "templates", ".obsidian"],
		defaultDateType: "modified",
		theme: {
			fontOrigin: "googleFonts",
			cdnCaching: true,
			typography: {
				header: "Schibsted Grotesk",
				body: "Source Sans Pro",
				code: "IBM Plex Mono",
			},
			colors: {
				lightMode: {
					light: "#0a0a0a",
					lightgray: "#111111",
					gray: "#222222",
					darkgray: "#555555",
					dark: "#e8e8e8",
					secondary: "#c8c8c8",
					tertiary: "#ffffff",
					highlight: "rgba(200, 200, 200, 0.05)",
					textHighlight: "rgba(200, 200, 200, 0.12)",
				},
				darkMode: {
					light: "#0a0a0a",
					lightgray: "#111111",
					gray: "#222222",
					darkgray: "#555555",
					dark: "#e8e8e8",
					secondary: "#c8c8c8",
					tertiary: "#ffffff",
					highlight: "rgba(200, 200, 200, 0.05)",
					textHighlight: "rgba(200, 200, 200, 0.12)",
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
			Plugin.CustomOgImages(),
		],
	},
}

export default config
