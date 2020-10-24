<template>
  <nav class="bg-inexhaustible" :class="[useFullHeader ? $style['full-header'] : '']">
    <!-- Referencing the style directly through an injected $style element is necessary for modular styles to function; otherwise, the template style name doesn't get rewritten -->
    <div :class="$style.banner">
      <ul
        class="container mx-auto grid items-center text-center py-2 px-4 gap-x-10 grid-rows-2 md:grid-rows-1"
        :class="[$style['header-cols'], useFullHeader ? 'lg:py-4' : '']">
        <li class="col-start-1 col-span-3 row-start-1 md:col-start-2 md:col-span-1">
          <router-link to="/" :class="$style['home-link']">Ashes.live</router-link>
        </li>
        <li
          class="col-start-1 row-start-2 justify-self-start md:row-start-1"
          :class="[useFullHeader ? 'lg:justify-self-end' : '']">
          <router-link to="/decks" class="inline-block text-black leading-tight">
            <i
              class="phg-main-action phg-standalone text-2xl pr-2 inline-block"
              :class="[useFullHeader ? 'lg:block lg:pr-0' : '']"></i>
            <span class="text-lg">Decks</span>
          </router-link>
        </li>
        <li
          class="col-start-3 row-start-2 justify-self-end md:row-start-1"
          :class="[useFullHeader ? 'lg:justify-self-start' : '']">
          <router-link to="/cards" class="inline-block text-black leading-tight">
            <i
              class="phg-side-action phg-standalone text-2xl pr-2 inline-block"
              :class="[useFullHeader ? 'lg:block lg:pr-0' : '']"></i>
            <span class="text-lg">Cards</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
  <div class="p-4 container mx-auto lg:pt-8">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    useFullHeader () {
      return this.$route.name === 'Home' || this.$route.name === 'NotFound'
    }
  }
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

.header-cols {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
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
  .full-header .home-link {
    background-image: url('./assets/ashes-live.png');
    width: 366px;
    padding-top: 107px;
    margin-top: 8px;
    /* Adjust it downward so that we overlap the border; this equates to 45px at base 16 */
    margin-bottom: -2.8125rem;
    position: relative;
    z-index: 10;
  }

  .header-cols {
    grid-template-columns: minmax(0, 1fr) 366px minmax(0, 1fr);
  }
}
</style>
