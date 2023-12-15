<script>
  import AlertError from 'svelte-icons/md/MdErrorOutline.svelte'
</script>

<div class="error-callout">
  <div class="icon">
    <AlertError />
  </div>
  <div class="message">
    <slot name="message" />
  </div>
</div>

<style>
  .error-callout {
    display: flex;
    background-color: #f8ecec;
    color: #4d1e1c;
    border-radius: 4px;
    padding: 6px 16px;
    margin-bottom: 24px;
    box-shadow: none;
    line-height: 143%;
    letter-spacing: 0.15px;
  }

  .icon {
    color: #d34141;
    margin-right: 12px;
    padding: 7px 0px;
    display: flex;
    font-size: 22px;
    opacity: 0.9;
  }

  .icon > :global(svg) {
    user-select: none;
    width: 1em;
    height: 1em;
  }

  .message {
    display: flex;
    align-items: center;
    padding: 8px 0px;
    min-width: 0px;
  }
</style>
