/**
 * 对于一个插件而言，其渲染类型只能是以下三种之一
 * - runtime-only: 仅运行时渲染，入口点只能包括一个或多个 js/ts 文件，不能包含任何模板文件
 * - custom-element: 基于 Web Components 的渲染，入口点可以包含一个或多个 js/ts 文件和编译为 Web Component 的模板文件（或 Web Component本身），可以指定 universal 平台
 * - ssr: 服务器端渲染，入口点可以包含一个或多个 js/ts 文件和用于服务器端渲染的模板文件，必须针对每个平台指定不同的入口点
 */
export type pluginRenderType = "runtime-only" | "custom-element" | "ssr";

/**
 * 插件支持的平台类型
 * - astro: 适用于 Astro 框架的插件
 * - valaxy: 适用于 Valaxy 框架的插件
 * - universal: 通用插件，适用于所有支持插件的框架
 */
export type pluginPlatformType = "astro" | "valaxy" | "universal";

export interface PluginManifestBase {
  name: string;
  version: string;
  /**
   * 此处接受 package.json 式的 semver 版本范围字符串，例如 ^0.0.1、~1.2.0 等
   * 用于指定该插件兼容的插件 API 版本范围
   * 如果未指定，则默认为 * ，表示兼容所有版本
   */
  compatibleAPIPattern?: string;
  /**
   * 插件的最大渲染能力，决定了插件可以包含的入口点类型
   */
  maxRenderCapability: pluginRenderType;
}

export interface RuntimeOnlyEntry {
  type: "runtime-only";
  name: string;
  path: string;
}

export interface RuntimeOnlyPluginManifest extends PluginManifestBase {
  maxRenderCapability: "runtime-only";
  entry: RuntimeOnlyEntry[];
}

/**
 * 基于 Web Components 的插件入口点
 * 入口点将会在 Layout 内放置一个隐藏的 Astro 组件，以确保其在页面加载时进行 SSR 水合
 */
export interface CustomElementEntry {
  type: "custom-element";
  path: string;
  name: string;
}

export interface CustomElementPluginManifest extends PluginManifestBase {
  maxRenderCapability: "custom-element";
  supportedPlatforms: pluginPlatformType[];
  entry: Array<CustomElementEntry | RuntimeOnlyEntry>;
}

export interface SSREntry {
  type: "ssr";
  platform: pluginPlatformType;
  name: string;
  path: string;
  clientHydrationInstruction?: "load" | "idle" | "visible" | "media";
}

export interface SSRPluginManifest extends PluginManifestBase {
  maxRenderCapability: "ssr";
  supportedPlatforms: pluginPlatformType[];
  entry: Array<SSREntry | CustomElementEntry | RuntimeOnlyEntry>;
}

export type PluginManifest =
  | RuntimeOnlyPluginManifest
  | CustomElementPluginManifest
  | SSRPluginManifest;

