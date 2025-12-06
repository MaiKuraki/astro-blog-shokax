<script lang='ts'>
  export let clickCallback: (state: boolean) => void = () => {}

  let currentState = false

  const toggleState = () => {
    currentState = !currentState
    clickCallback?.(currentState)
  }
</script>

<div class='flex flex-col cursor-pointer items-center justify-center max-lg:hidden' on:click={toggleState}>
  <div class='line-height-0 p-5 w-5.5 box-unset'>
    <span class={`line ${currentState ? 'line-1' : ''}`} />
    <span class={`line mt-0.75 ${currentState ? 'line-2' : ''}`} />
    <span class={`line mt-0.75 ${currentState ? 'line-3' : ''}`} />
  </div>
</div>

<style>
  .line-1 {
    top: 0.3125rem;
    transform: rotate(-45deg);
  }

  .line-2 {
    opacity: 0;
  }

  .line-3 {
    top: -0.3125rem;
    transform: rotate(45deg);
    margin-top: 0.1875rem;
  }

  .line {
    background-color: var(--header-text-color);
    vertical-align: top;
    border-radius: 0.0625rem;
    width: 100%;
    height: 0.125rem;
    transition: all 0.4s;
    display: inline-block;
    position: relative;
    left: 0;
    box-shadow: 0 0 0.5rem #00000080;
  }
</style>
