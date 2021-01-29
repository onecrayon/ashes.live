import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import NotFound from './components/NotFound.vue'
import CardListing from './components/cards/CardListing.vue'
import CardDetails from './components/cards/CardDetails.vue'
import PublicDecks from './components/decks/PublicDecks.vue'
import DeckDetails from './components/decks/DeckDetails.vue'
import PlayerAccount from './components/players/PlayerAccount.vue'
import PlayerDecks from './components/decks/PlayerDecks.vue'
import PlayerPublicProfile from './components/players/PlayerPublicProfile.vue'
import NewPlayer from './components/players/NewPlayer.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/cards/',
      name: 'Cards',
      component: CardListing,
      meta: { title: 'Browse Cards' },
    },
    {
      path: '/cards/legacy/',
      name: 'LegacyCards',
      component: CardListing,
      meta: {
        title: 'Browse Legacy Cards',
        showLegacy: true,
      },
    },
    {
      path: '/cards/:stub/',
      name: 'CardDetails',
      component: CardDetails,
      props: true,
    },
    {
      path: '/cards/legacy/:stub/',
      name: 'CardDetailsLegacy',
      component: CardDetails,
      props: true,
      meta: {
        showLegacy: true,
      }
    },
    {
      path: '/decks/',
      name: 'Decks',
      component: PublicDecks,
      meta: { title: 'Decks' },
    },
    {
      path: '/decks/legacy/',
      name: 'LegacyDecks',
      component: PublicDecks,
      meta: {
        title: 'Browse Legacy Decks',
        showLegacy: true,
      },
    },
    {
      path: '/decks/mine/',
      name: 'PlayerDecks',
      component: PlayerDecks,
      meta: { title: 'My Decks' },
    },
    {
      path: '/decks/:id',
      name: 'DeckDetails',
      component: DeckDetails,
      props: true,
    },
    {
      path: '/players/new/',
      name: 'NewPlayer',
      component: NewPlayer,
      meta: { title: 'Sign Up' },
    },
    {
      path: '/players/me/',
      name: 'PlayerAccount',
      component: PlayerAccount,
      meta: { title: 'My Account' },
    },
    {
      path: '/players/:badge/',
      name: 'PlayerPublicProfile',
      component: PlayerPublicProfile,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { title: 'Not Found' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Mimic browser behavior (resume saved position on back/forward)
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      // If we have an anchor link, navigate to it (smooth scrolling, if supported)
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else {
      // Otherwise just jump back to the page top when navigating
      return { top: 0 }
    }
  },
})
