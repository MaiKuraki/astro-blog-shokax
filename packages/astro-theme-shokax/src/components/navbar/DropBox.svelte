<script lang='ts'>
  import type { NavItemType } from './NavTypes'
  import { fly } from 'svelte/transition'
  import DropBoxItem from './DropBoxItem.svelte'
  import NavItem from './NavItem.svelte'

  export let icon: string | undefined
  export let navLinks: NavItemType[] = []
  export let rootText: string
  export let className: string = ''

  let mergedClass = ''
  let restProps: Record<string, any> = {}

  let linkHover = false
  let submenuHover = false
  let linkTimer: ReturnType<typeof setTimeout> | undefined
  let submenuTimer: ReturnType<typeof setTimeout> | undefined

  const setLinkHover = (value: boolean) => {
    if (linkTimer)
      clearTimeout(linkTimer)

    linkTimer = undefined
    if (value) {
      linkHover = true
    }
    else {
      linkTimer = setTimeout(() => {
        linkHover = false
      }, 300)
    }
  }

  const setSubHover = (value: boolean) => {
    if (submenuTimer)
      clearTimeout(submenuTimer)

    submenuTimer = undefined
    if (value) {
      submenuHover = true
    }
    else {
      submenuTimer = setTimeout(() => {
        submenuHover = false
      }, 100)
    }
  }

  $: hovering = linkHover || submenuHover
  const iconClasses = icon ? `${icon} text-xl vertical-text-bottom inline-block` : ''

  $: {
    const { class: incomingClass = '', ...others } = $$restProps
    restProps = others
    mergedClass = [className, incomingClass].filter(Boolean).join(' ')
  }
</script>

<NavItem className={mergedClass} {...restProps}>
  <a
    href='javascript:void(0)'
    aria-haspopup='true'
    aria-expanded={hovering}
    on:click|preventDefault
    on:mouseenter={() => setLinkHover(true)}
    on:mouseleave={() => setLinkHover(false)}
  >
    {#if icon}
      <div class={iconClasses} />
    {/if}
    {rootText}
    <div class='i-ri-arrow-drop-down-fill text-xl vertical-text-bottom inline-block' />
  </a>
  {#if hovering}
    <div
      class='relative z-10'
      on:mouseenter={() => setSubHover(true)}
      on:mouseleave={() => setSubHover(false)}
      transition:fly|local={{ y: 12, duration: 300 }}
    >
      <DropBoxItem navLinks={navLinks} />
    </div>
  {/if}
</NavItem>

<style>
  a {
    display: inline-block;
  }
</style>
