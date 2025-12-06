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
<ul class={`inline-flex cursor-pointer items-center justify-center ${mergedClass}`.trim()} {...restProps}>
  <slot />
</ul>
