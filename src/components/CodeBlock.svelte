<script lang="ts">
import { onMount } from 'svelte';
import { css } from '@/assets/fonts/JetBrainsMono-VF.ttf'

interface Props {
  content: string;
}

const { content }:Props = $props();

let codeblock: HTMLElement | null = $state(null);
let copied = $state(false);
let codeLanguage = $state('');
let isDark = $state(false);

async function copyCode() {
  if (!codeblock) return;

  const code = codeblock.textContent ?? '';

  try {
    await navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 3000);
  } catch (err) {
    copied = false;
    throw new Error(`Failed to copy code: ${err}`);
  }
}

function getCodeLanguage() {
  const codeElement = codeblock?.firstElementChild?.firstElementChild;

  if (!codeElement) return '';

  const classList = Array.from(codeElement.classList);
  for (const cls of classList) {
    if (cls.startsWith('language-')) {
      return cls.replace('language-', '');
    }
  }
  return '';
}

onMount(() => {
  isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  codeLanguage = getCodeLanguage();
});
</script>

<template>
  <div class="codeblock {isDark ? 'dark' : ''}" style="font-family: {css.family};">
    <div class="header min-h-6 pb-2">
      <div class="float-left flex flex-row gap-2.5">
        <div class="ml-3.25 mt-2.25 h-3.75 w-3.75 rounded-50% bg-[rgb(252,_98,_93)]" />
        <div class="mt-2.25 h-3.75 w-3.75 rounded-50% bg-[rgb(253,_188,_64)]" />
        <div class="mt-2.25 h-3.75 w-3.75 rounded-50% bg-[rgb(53,_205,_75)]" />
        <span class="ml-3 mt-1.75 text-4 color-[var(--grey-4)]">{codeLanguage}</span>
      </div>
      <div class="float-right flex flex-row pr-6 pt-2 color-[var(--grey-5)]">
        <button
          class="cursor-pointer {copied ? 'i-ri-check-fill' : 'i-ri-file-copy-fill'}"
          on:click={copyCode}
        />
      </div>
    </div>

    <div bind:this={codeblock}>
      {@html content}
    </div>
  </div>
</template>

<style>
.header {
  background-color: var(--grey-2);
  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
}

.codeblock {
  box-shadow: 0.5rem 0.5rem 1rem var(--grey-3);
}

:global(*) {
  font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
  font-size: 0.925rem;
  line-height: 1.25rem;
  line-break: anywhere;
  white-space: break-spaces;
}

:global(pre) {
  padding: 0.925rem;
  margin: 0;
  border-bottom-right-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  background-color: var(--grey-3) !important;
}

:global(.line) {
  text-indent: -2.5rem;
  padding-left: 2.5rem;
}

:global(.line):hover {
  background-color: var(--grey-2);
}

:global(code) {
  counter-reset: step;
  counter-increment: step 0;
  display: flex;
  flex-direction: column;
}

:global(code .line::before) {
  content: counter(step);
  counter-increment: step;
  width: 1rem;
  margin-right: 1.5rem;
  display: inline-block;
  text-align: right;
  color: var(--grey-5);
}

:global(.diff .remove) {
  background-color: var(--color-red);
  opacity: 0.7;
}

:global(.diff .remove)::before {
  content: '-';
  color: var(--color-red);
  font-weight: bold;
}

:global(.diff .add) {
  background-color: var(--color-green);
}

:global(.diff .add)::before {
  content: '+';
  color: var(--color-green);
  font-weight: bold;
}

:global(.diff .highlighted) {
  background-color: var(--grey-4);
}

.dark {
  box-shadow: none;
}

:global(html[data-theme='dark'] .codeblock) {
  box-shadow: none;
}

:global(html[data-theme='dark'] .shiki),
:global(html[data-theme='dark'] .shiki span) {
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}

:global(.dark .shiki),
:global(.dark .shiki span) {
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
</style>