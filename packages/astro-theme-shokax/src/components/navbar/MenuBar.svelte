<script lang='ts'>
  import type { NavItemType } from './NavTypes'
  import { onMount } from 'svelte'
  import DropBox from './DropBox.svelte'
  import NavLinkItem from './NavLinkItem.svelte'

  export let navLinks: NavItemType[] = []
  export let name: string

  let width = 0

  onMount(() => {
    const updateWidth = () => {
      width = window.innerWidth
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  })

  $: isDesktop = width > 820
</script>

<ul class='m-0 pb-2.5 pt-2.5 p-is-0 w-full'>
  <NavLinkItem class={isDesktop ? 'inline-block' : 'block'} href='/' text={name} />
  {#if isDesktop}
    {#each navLinks as { href, text, icon, dropbox, dropboxItems } (href)}
      {#if !dropbox}
        <NavLinkItem
          href={href}
          text={text}
          icon={icon}
          className='before:transition-all before:transition-duration-400 before:transition-ease-in-out inline-block before:rounded-0.5 before:bg-current before:h-0.75 before:w-0 before:content-empty before:transform-translate-x--50% before:bottom-0 before:left-50% before:absolute hover:before:w-60%'
        />
      {:else}
        <DropBox navLinks={dropboxItems ?? []} icon={icon} rootText={text} class='inline-block' />
      {/if}
    {/each}
  {/if}
</ul>
