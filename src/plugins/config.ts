import type { PluginManifest } from "./plugin";

export interface Plugin<O> {
  plugin: (options: O) => PluginManifest;
  options: O;
}

export function definePlugin<O>(plugin: Plugin<O>): Plugin<O> {
  return plugin;
}

export interface HyacinePluginSystemConfig {
  plugins: Plugin<unknown>[];
}

export function defineConfig(config: HyacinePluginSystemConfig): HyacinePluginSystemConfig {
  return config;
}
