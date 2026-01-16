import { describe, expect, it } from "bun:test";
import {
  generateTempAstroTemplateFile,
  generateTempRuntimeFile,
  safeComponentName,
} from "./generateTempFile";

describe("safeComponentName", () => {
  it("returns pascalCase name when it is a valid component identifier", () => {
    expect(safeComponentName("hello-world", 0)).toBe("HelloWorld");
    expect(safeComponentName("NavBar", 1)).toBe("NavBar");
    expect(safeComponentName("foo_bar", 2)).toBe("FooBar");
  });

  it("falls back to HyacineComponent{index} for invalid/edge names", () => {
    expect(safeComponentName("", 0)).toBe("HyacineComponent0");
    expect(safeComponentName("123", 3)).toBe("HyacineComponent3");
    expect(safeComponentName("-", 9)).toBe("HyacineComponent9");
    // 中文/emoji 等在 pascalCase 后通常不满足 /^[A-Z][A-Za-z0-9]*$/
    expect(safeComponentName("你好", 4)).toBe("HyacineComponent4");
    expect(safeComponentName("😀", 5)).toBe("HyacineComponent5");
  });
});

describe("generateTempAstroTemplateFile", () => {
  it("generates imports and usage for custom-element entries", () => {
    const out = generateTempAstroTemplateFile([
      { type: "custom-element", name: "code-block", path: "./CodeBlock.svelte" },
    ]);

    expect(out).toContain('import CodeBlock from "./CodeBlock.svelte";');
    expect(out).toContain('<CodeBlock style="display: none;" />');
    expect(out).toContain("//⚠️ This file is auto-generated");
  });

  it("generates ssr usage with safe client hydration attribute", () => {
    const out = generateTempAstroTemplateFile([
      {
        type: "ssr",
        platform: "astro",
        name: "NavBar",
        path: "./NavBar.svelte",
        clientHydrationInstruction: "load",
      },
    ]);

    expect(out).toContain('import NavBar from "./NavBar.svelte";');
    expect(out).toContain("<NavBar client:load />");
  });

  it("supports multiple mixed entries (custom-element + ssr)", () => {
    const out = generateTempAstroTemplateFile([
      { type: "custom-element", name: "code-block", path: "./CodeBlock.svelte" },
      {
        type: "ssr",
        platform: "astro",
        name: "NavBar",
        path: "./NavBar.svelte",
        clientHydrationInstruction: "idle",
      },
      {
        type: "ssr",
        platform: "astro",
        name: "Waves",
        path: "./Waves.svelte",
      },
    ]);

    // imports
    expect(out).toContain('import CodeBlock from "./CodeBlock.svelte";');
    expect(out).toContain('import NavBar from "./NavBar.svelte";');
    expect(out).toContain('import Waves from "./Waves.svelte";');

    // usage
    expect(out).toContain('<CodeBlock style="display: none;" />');
    expect(out).toContain("<NavBar client:idle />");
    // 没有 hydration 指令时，不应有 client:* 属性
    expect(out).toContain("<Waves />");
    expect(out).not.toContain("<Waves client:");
  });

  it("dedupes repeated paths (defense against duplicate mount)", () => {
    const out = generateTempAstroTemplateFile([
      { type: "custom-element", name: "A", path: "./Same.svelte" },
      // same path, different name/type should be ignored
      {
        type: "ssr",
        platform: "astro",
        name: "B",
        path: "./Same.svelte",
        clientHydrationInstruction: "load",
      },
    ]);

    const importCount = (out.match(/\bimport\b/g) ?? []).length;
    expect(importCount).toBe(1);
    // usage 也只应出现一次
    const sameTagCount = (out.match(/<\w+ style="display: none;" \/>/g) ?? []).length;
    expect(sameTagCount).toBe(1);
    // 不应出现第二个 entry 的 hydration
    expect(out).not.toContain("client:load");
  });

  it("handles empty entries (edge case)", () => {
    const out = generateTempAstroTemplateFile([]);
    expect(out).toContain("---");
    expect(out).toContain("<Fragment>");
    // 不应包含任何 import
    expect(out).not.toMatch(/\bimport\b/);
  });

  it("defuses malicious name injection by falling back to safeComponentName", () => {
    const maliciousName = '"><script>alert(1)</script>';
    const expectedComponentName = safeComponentName(maliciousName, 0);

    const out = generateTempAstroTemplateFile([
      {
        type: "custom-element",
        // 尝试把脚本注入到标签/标识符
        name: maliciousName,
        path: "./Evil.svelte",
      },
    ]);

    expect(out).toContain(`import ${expectedComponentName} from "./Evil.svelte";`);
    expect(out).toContain(`<${expectedComponentName} style="display: none;" />`);
    expect(out).not.toContain("<script>");
    expect(out).not.toContain("</script>");
  });

  it("defuses malicious path injection by escaping import string literal", () => {
    const maliciousPath = "./ok';\nconsole.log('PWNED');\n//";
    const out = generateTempAstroTemplateFile([
      { type: "custom-element", name: "Safe", path: maliciousPath },
    ]);

    // JSON.stringify 会把真实换行转成 \n，避免生成文件出现新的语句行
    expect(out).toContain(`import Safe from ${JSON.stringify(maliciousPath)};`);
    // 不应出现真实的注入语句行（带真实换行的 console.log）
    expect(out).not.toContain("\nconsole.log('PWNED');\n");
  });

  it("ignores malicious hydration instruction (runtime validation)", () => {
    const out = generateTempAstroTemplateFile([
      {
        type: "ssr",
        platform: "astro",
        name: "NavBar",
        path: "./NavBar.svelte",
        // 绕过类型系统的注入：运行时必须忽略
        clientHydrationInstruction: "load on:click=alert(1)" as any,
      },
    ]);

    expect(out).toContain("<NavBar />");
    expect(out).not.toContain("client:load on:click");
  });
});

describe("generateTempRuntimeFile", () => {
  it("generates imports and init calls for runtime-only entries", () => {
    const out = generateTempRuntimeFile([
      { type: "runtime-only", name: "mouse-firework", path: "./mouse-firework.ts" },
    ]);

    // name 会变成 MouseFirework
    expect(out).toContain('import { init as init_MouseFirework } from "./mouse-firework.ts";');
    expect(out).toContain("init_MouseFirework();");
  });

  it("falls back to HyacineComponent{index} for invalid runtime-only names", () => {
    const out = generateTempRuntimeFile([
      { type: "runtime-only", name: "123", path: "./runtime.ts" },
    ]);

    expect(out).toContain('import { init as init_HyacineComponent0 } from "./runtime.ts";');
    expect(out).toContain("init_HyacineComponent0();");
  });

  it("supports multiple runtime-only entries (mixed valid + fallback)", () => {
    const out = generateTempRuntimeFile([
      { type: "runtime-only", name: "mouse-firework", path: "./mouse-firework.ts" },
      { type: "runtime-only", name: "你好", path: "./cn.ts" },
    ]);

    // 第 0 个：正常 pascalCase
    expect(out).toContain('import { init as init_MouseFirework } from "./mouse-firework.ts";');
    expect(out).toContain("init_MouseFirework();");

    // 第 1 个：fallback
    expect(out).toContain('import { init as init_HyacineComponent1 } from "./cn.ts";');
    expect(out).toContain("init_HyacineComponent1();");
  });

  it("dedupes repeated paths (defense against duplicate init)", () => {
    const out = generateTempRuntimeFile([
      { type: "runtime-only", name: "A", path: "./same.ts" },
      { type: "runtime-only", name: "B", path: "./same.ts" },
    ]);

    const importCount = (out.match(/\bimport\b/g) ?? []).length;
    expect(importCount).toBe(1);

    // init 调用也只应一次
    const initCallCount = (out.match(/\binit_\w+\(\);/g) ?? []).length;
    expect(initCallCount).toBe(1);
  });

  it("defuses malicious path injection in runtime file", () => {
    const maliciousPath = "./ok';\nthrow new Error('PWNED');\n//";
    const out = generateTempRuntimeFile([
      { type: "runtime-only", name: "Safe", path: maliciousPath },
    ]);

    expect(out).toContain(`from ${JSON.stringify(maliciousPath)};`);
    expect(out).not.toContain("\nthrow new Error('PWNED');\n");
  });
});
