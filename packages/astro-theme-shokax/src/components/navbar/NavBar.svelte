<script lang='ts'>
  import type { NavItemType } from './NavTypes'
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import { initTheme, toggleTheme } from './helpers/theme'
  import LeftNavBtn from './LeftNavBtn.svelte'
  import MenuBar from './MenuBar.svelte'
  import RightNavBar from './RightNavBar.svelte'

  export let name: string
  export let navLinks: NavItemType[] = []
  export let clickToggleCallback: (state: boolean) => void = () => {}
  // Prefer an explicit callback prop over the legacy createEventDispatcher
  export let onSearch: () => void = () => {}

  let showNav = true
  let atTop = true
  let isDark = false

  onMount(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return

    // Initialize theme based on storage or system preference
    const currentTheme = initTheme(document, window)
    isDark = currentTheme === 'dark'

    let lastScroll = window.scrollY
    atTop = lastScroll <= 0
    let ticking = false

    const handleScroll = () => {
      if (ticking)
        return

      ticking = true
      window.requestAnimationFrame(() => {
        const current = window.scrollY
        if (current > lastScroll)
          showNav = false
        else if (current < lastScroll)
          showNav = true

        lastScroll = current
        atTop = current <= 0
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  })

  const handleToggleTheme = () => {
    if (typeof document === 'undefined' || typeof window === 'undefined')
      return

    const next = toggleTheme(document, window, isDark ? 'dark' : 'light')
    isDark = next === 'dark'
  }

  const handleSearch = () => onSearch?.()
</script>

{#if showNav}
  <nav
    id='nav'
    class={`h-12.5 w-full top-0 fixed z-9 backdrop-blur-8 backdrop-saturate-180 ${!atTop ? 'nav-bg' : ''}`.trim()}
    transition:fly|local={{ y: -64, duration: 400 }}
  >
    <div class='mb-0 ml-auto mr-auto mt-0 flex flex-nowrap h-full w-[calc(100%-0.625rem)] w-85%'>
      <LeftNavBtn clickCallback={clickToggleCallback} />
      <MenuBar {name} navLinks={navLinks} />
      <RightNavBar>
        <div class='text-5 pb-2.5 pl-2 pr-2 pt-2.5 cursor-pointer' on:click={handleToggleTheme}>
          <div class={isDark ? 'i-ri-moon-line' : 'i-ri-sun-line'} />
        </div>
        <div id='search' class='text-5 pb-2.5 pl-2 pr-2 pt-2.5 cursor-pointer' on:click={handleSearch}>
          <div class='i-ri-search-line' />
        </div>
      </RightNavBar>
    </div>
  </nav>
{/if}

<style>
  .nav-bg {
    background-image: var(--nav-bg);
    box-shadow: 0.1rem 0.1rem 0.2rem var(--grey-9-a1);
    text-shadow: 0 0 0.0625rem var(--grey-9-a1);
    color: var(--text-color);
  }
</style>
