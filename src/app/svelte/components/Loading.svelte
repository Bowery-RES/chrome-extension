<style>
  .spinner {
    width: var(--spinnerWidth, 40px);
    height: var(--spinnerHeight, 40px);
    color: #2a4370;
    animation: rotate 0.75s linear infinite;
    margin: auto;
    margin-top: calc(50% - 40px);
  }

  .spinner_icon {
    display: block;
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .spinner_path {
    stroke-dasharray: 90;
    stroke-linecap: round;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="spinner">
  <svg class="spinner_icon" viewBox="25 25 50 50">
    <circle
      class="spinner_path"
      cx="50"
      cy="50"
      r="20"
      fill="none"
      stroke="currentColor"
      stroke-width="5"
      stroke-miterlimit="10" />
  </svg>
</div>
