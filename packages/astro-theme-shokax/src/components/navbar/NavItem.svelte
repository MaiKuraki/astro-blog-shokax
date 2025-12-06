<script lang='ts'>
  export let className: string = ''
  let mergedClass = ''
  let restProps: Record<string, any> = {}

  $: {
    const { class: incomingClass = '', ...others } = $$restProps
    restProps = others
    mergedClass = [className, incomingClass].filter(Boolean).join(' ')
  }
</script>

<li class={`relative list-none pl-2.5 pr-2.5 text-align-center tracking-0.25 ${mergedClass}`.trim()} {...restProps}>
  <slot />
</li>
