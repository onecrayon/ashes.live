<template>
  <nav class="bg-inexhaustible">
    <!-- Referencing the style directly through an injected $style element is necessary for modular styles to function; otherwise, the template style name doesn't get rewritten -->
    <div :class="$style.banner">
      <ul class="grid items-center gap-2 grid-cols-3 grid-rows-2 md:grid-rows-1 lg:container lg:mx-auto text-center py-2 px-4 lg:py-4">
        <li class="row-start-1 col-start-1 col-span-3 md:col-start-2 md:col-span-1">
          <a href="/" :class="$style['home-link']">Ashes.live</a>
        </li>
        <li class="row-start-1 col-start-1 row-start-2 md:row-start-1 text-gray">(upcoming)</li>
        <li class="row-start-1 col-start-3 row-start-2 md:row-start-1 text-gray">(upcoming)</li>
      </ul>
    </div>
  </nav>
  <article class="p-4 lg:container lg:mx-auto lg:pt-8">
    <h1 class="text-3xl font-bold">Work in progress</h1>

    <p class="my-4">Thank you for your interest in the next generation Ashes.live site! I am currently hard at work building out an even better experience for Ashes Reborn.</p>

    <p class="my-4">If you are interested in contributing, please <a href="https://github.com/onecrayon/ashes.live">visit the GitHub repo</a>.</p>
  </article>
</template>

<script>
export default {
  name: 'App',
}
</script>

<!-- Specifying the lang as "postcss" isn't strictly necessary, but makes VS Code syntax highlighting work properly -->
<style lang="postcss" module>
.banner {
  position: relative;

  /* This creates the bottom "border" of the main header */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 0;
    width: 100%;
    border-top: 1px solid var(--color-white);
    border-bottom: 3px solid var(--color-gray);
  }
}

.home-link {
  background: url('./assets/ashes-live-small.png') left top no-repeat;
  display: inline-block;
  height: 0px;
  width: 266px;
  padding-top: 30px;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .home-link {
    background-image: url('./assets/ashes-live.png');
    width: 366px;
    padding-top: 107px;
    /* Adjust it downward so that we overlap the border; this equates to 45px at base 16 */
    margin-bottom: -2.8125rem;
    position: relative;
    z-index: 10;
  }
}
</style>
