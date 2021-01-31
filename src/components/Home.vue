<template>
  <div class="sm:flex">
    <div class="sm:pr-8 pb-8 sm:w-2/3">
      <h1 class="phg-time-class">Ongoing migration</h1>

      <p><strong class="text-lg">Don't worry! Your account and decks are safe!</strong> To support Ashes Reborn and make it possible for me to keep the site maintained long-term, I am rewriting everything from the ground up. Your account and all your decks are still saved, and I am hard at work writing the code to make them available once again!</p>

      <p>In the short term you can find me on <a href="https://discord.gg/UU5bduq">Discord</a> (<span class="font-mono text-red">Skaak<span class="text-gray-dark">#0007</span></span>) or <a href="https://www.boardgamegeek.com/user/Skaak">BoardGameGeek</a> if you need to contact me about anything related to Ashes.live, your account, or whatever else!</p>

      <h2>Resources</h2>

      <h3 class="font-bold my-4">Community</h3>

      <ul class="list-disc pl-4">
        <li><a href="https://discord.gg/UU5bduq">Community Discord</a> <span class="text-gray">(TTS or Ashteki matchmaking + general discussion)</span></li>
        <li><a href="https://ashteki.com">Ashteki</a> <span class="text-gray">(Play Ashes in your browser! Under active development, so there may be bugs and not all cards are available yet.)</span></li>
        <li><a href="https://www.reddit.com/r/AshesGame/">Ashes on reddit</a></li>
        <li><a href="https://boardgamegeek.com/boardgame/167400/ashes-rise-phoenixborn/forums/0">Ashes on BoardGameGeek</a></li>
      </ul>

      <h3 class="font-bold my-4">Files</h3>

      <ul class="list-disc pl-4">
        <li><a :href="getCDNURL('/files/ashes-reborn-rules.pdf')">Ashes Reborn Rules</a> <span class="text-gray">(PDF)</span></li>
        <li>Dice reference cards:
          <div class="text-2xl">
            <a class="die ceremonial phg-ceremonial-power py-1 px-2" :href="getCDNURL('/images/cards/ceremonial-magic.jpg')" target="_blank" title="Ceremonial Magic"></a>
            <a class="die charm phg-charm-power py-1 px-2" :href="getCDNURL('/images/cards/charm-magic.jpg')" target="_blank" title="Charm Magic"></a>
            <a class="die illusion phg-illusion-power py-1 px-2" :href="getCDNURL('/images/cards/illusion-magic.jpg')" target="_blank" title="Illusion Magic"></a>
            <a class="die natural phg-natural-power py-1 px-2" :href="getCDNURL('/images/cards/natural-magic.jpg')" target="_blank" title="Natural Magic"></a>
            <a class="die divine phg-divine-power py-1 px-2" :href="getCDNURL('/images/cards/divine-magic.jpg')" target="_blank" title="Divine Magic"></a>
            <a class="die sympathy phg-sympathy-power py-1 px-2" :href="getCDNURL('/images/cards/sympathy-magic.jpg')" target="_blank" title="Sympathy Magic"></a>
          </div>
        </li>
      </ul>

      <hr class="border-gray-light mt-6 mb-4">

      <ul class="list-disc pl-4">
        <li><a :href="getCDNURL('/legacy/files/ashes-core-rules.pdf')">Legacy Rules</a> <span class="text-gray">(PDF)</span></li>
        <li><a :href="getCDNURL('/legacy/files/ashes-raven-rules.pdf')">Raven Rules</a> <span class="text-gray">(PDF; fan-made replacement for official FAQ)</span></li>
        <li><a :href="getCDNURL('/legacy/files/ashes-rules-reference.pdf')">Legacy Rules Reference</a> <span class="text-gray">(PDF; all official rules, one document)</span></li>
        <li><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=1717839303">TableTop Simulator: Ashes Custom Workshop</a> <span class="text-gray">(legacy TTS mod; includes Project Phoenix fan-made content)</span></li>
      </ul>
    </div>
    <div class="sm:w-1/3">
      <h2>Current progress</h2>

      <ul>
        <li class="flex flex-nowrap">
          <span class="pr-2">
            <i class="far fa-check-square"></i>
          </span>
          <span>
            Card browsers: <router-link to="/cards/">Reborn</router-link> and <router-link to="/cards/legacy/">legacy</router-link>
          </span>
        </li>
        <li class="flex flex-nowrap">
          <span class="pr-2">
            <i class="far fa-square"></i>
          </span>
          <span class="text-gray-dark">
            Deck builder (including deck listings for both public and private decks); <em>hopefully complete late Jan. 2021</em>
          </span>
        </li>
        <li class="flex flex-nowrap">
          <span class="pr-2">
            <i class="far fa-square"></i>
          </span>
          <span class="text-gray-dark">
            Comments (on decks and cards); <em>hopefully complete Feb. 2021</em>
          </span>
        </li>
        <li class="flex flex-nowrap">
          <span class="pr-2">
            <i class="far fa-square"></i>
          </span>
          <span class="text-gray-dark">
            Posts; <em>hopefully complete Feb. or Mar. 2021</em>
          </span>
        </li>
      </ul>

      <p>If you are a web developer interested in contributing, please <a href="https://github.com/onecrayon/ashes.live">visit the GitHub repo</a>.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    apiURL () {
      return import.meta.env.VITE_API_URL
    },
    cdnURL() {
      return import.meta.env.VITE_CDN_URL
    },
  },
  methods: {
    getCDNURL(path) {
      return this.cdnURL + path
    },
  },
}
</script>
