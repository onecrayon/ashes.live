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
    <!-- Keying to the route path is necessary, because legacy routes tend to share the same components, and without keying against the path they won't receive standard router lifecycle calls -->
    <router-view :key="$route.path"></router-view>
  </div>
  <footer class="container mx-auto p-4 pt-10 text-center text-xs">
    <p>All images, graphics, textual and game contents &copy; 2015-{{ thisYear }} Plaid Hat Games. All rights reserved.</p>
    <p>Web developer? Contribute to the <a href="https://github.com/onecrayon/ashes.live" rel="external" target="_blank">Javascript app</a> or <a href="https://github.com/onecrayon/api.ashes.live" rel="external" target="_blank">Python API</a> on GitHub!</p>
  </footer>
</template>

<script>
import axios from 'axios'
import qs from 'qs'

// Set up sensible Axios defaults for query string array handling
// (it uses bracketed property names, which the backend doesn't support)
axios.defaults.paramsSerializer = params => qs.stringify(params, {arrayFormat: 'repeat'})

function siteTitle(routeObject) {
  // Returns the title that should be used based on the $route object
  return routeObject.meta && routeObject.meta.title && `${routeObject.meta.title} - Ashes.live` || 'Ashes.live'
}

export default {
  name: 'App',
  created () {
    // Set the page title when the app is loaded for the first time
    document.title = siteTitle(this.$route)
  },
  computed: {
    useFullHeader () {
      return this.$route.name === 'Home' || this.$route.name === 'NotFound'
    },
    thisYear () {
      return (new Date()).getFullYear()
    },
  },
  watch: {
    $route(to, from) {
      // Set the page title when we navigate to a new page
      document.title = siteTitle(to)
    },
  },
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
