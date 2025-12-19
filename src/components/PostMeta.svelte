<script lang='ts'>
  interface Props {
    date: Date
    showLabel?: boolean
    wordCount?: number
    readTime?: number
  }

  const { date, showLabel = false, wordCount, readTime }: Props = $props()

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatReadTime = (minutes: number) => {
    return `${minutes} 分钟`
  }
</script>

<div class='post-meta' class:full={showLabel}>
  <span class='meta-item' title={`发布于：${date.toLocaleString()}`}>
    <span class='icon'>
      <i class='i-ri-calendar-line'></i>
    </span>
    {#if showLabel}
      <span class='text'>发布于</span>
    {/if}
    <time datetime={date.toISOString()}>
      {formatDate(date)}
    </time>
  </span>

  {#if wordCount}
    <span class='meta-item' title='字数统计'>
      <span class='icon'>
        <i class='i-ri-pencil-line'></i>
      </span>
      {#if showLabel}
        <span class='text'>字数</span>
      {/if}
      <span>{wordCount} 字</span>
    </span>
  {/if}

  {#if readTime}
    <span class='meta-item' title='阅读时长'>
      <span class='icon'>
        <i class='i-ri-time-line'></i>
      </span>
      {#if showLabel}
        <span class='text'>需要</span>
      {/if}
      <span>{formatReadTime(readTime)}</span>
    </span>
  {/if}
</div>

<style>
  .post-meta {
    display: flex;
    font-size: 0.875rem;
    color: var(--grey-5);
    gap: 0.625rem;
    align-items: center;
  }

  .post-meta.full {
    justify-content: flex-end;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.125rem;
  }

  .icon {
    display: inline-flex;
    align-items: center;
  }

  .icon i {
    margin-right: 0.0625rem;
  }

  .text {
    margin-right: 0.25rem;
  }

  time {
    font-family: inherit;
  }

  @media (max-width: 820px) {
    .post-meta .meta-item:not(:first-child) {
      display: none;
    }
  }
</style>
