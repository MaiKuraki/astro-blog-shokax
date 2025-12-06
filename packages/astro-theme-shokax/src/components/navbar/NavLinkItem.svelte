<script lang='ts'>
  import NavItem from './NavItem.svelte'

  export let href: string = '#'
  export let text: string | undefined
  export let icon: string | null = null
  export let className: string = ''
  let mergedClass = ''
  let restProps: Record<string, any> = {}
  let iconClasses = ''

  $: iconClasses = icon ? `${icon} icon-nav text-xl vertical-text-bottom inline-block` : ''

  $: {
    const { class: incomingClass = '', ...others } = $$restProps
    restProps = others
    mergedClass = [className, incomingClass].filter(Boolean).join(' ')
  }
</script>

<NavItem className={mergedClass} {...restProps}>
  <a href={href}>
    {#if icon}
      <div class={iconClasses}></div>
    {/if}
    {text}
  </a>
</NavItem>
