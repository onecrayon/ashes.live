<template>
  <div class="sm:flex">
    <div class="sm:pr-8 pb-8 sm:w-2/3">
      <h1 class="phg-time-class">Ongoing migration</h1>

      <p>To support Ashes Reborn and make it possible for me to keep the site maintained long-term, I am rewriting everything from the ground up. I will be implementing the majority of the original site's functionality over the coming months, but do please let me know if you have any requests or run into any problems!</p>

      <p>You can find me on <a href="https://discord.gg/UU5bduq">Discord</a> (<span class="font-mono text-red">Skaak<span class="text-gray-dark">#0007</span></span>) or <a href="https://www.boardgamegeek.com/user/Skaak">BoardGameGeek</a> if you need to contact me about anything related to Ashes.live, your account, or whatever else!</p>

      <h2>Resources</h2>

      <h3 class="my-4">Play Online</h3>

      <ul class="list-disc pl-4">
        <li><a href="https://ashteki.com">Ashteki</a> <span class="text-gray">(Play Ashes in your browser! Under active development, so there may be rough edges)</span></li>
        <li><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2386753960">Ashes Reborn for Tabletop Simulator</a> <span class="text-gray">(requires Tabletop Simulator on Steam)</span></li>
        <li><a href="https://felttable.com/ashes">Felt Table</a> <span class="text-gray">(Play against an AI bot in your browser)</span></li>
      </ul>

      <h3 class="font-bold my-4">Community</h3>

      <ul class="list-disc pl-4">
        <li><a href="https://discord.gg/UU5bduq">Community Discord</a> <span class="text-gray">(TTS, Ashteki, or webcam matchmaking + general discussion)</span></li>
        <li><a href="https://boardgamegeek.com/boardgame/167400/ashes-rise-phoenixborn/forums/0">Ashes on BoardGameGeek</a></li>
      </ul>

       <h3 class="font-bold my-4">Media</h3>

      <ul class="list-disc pl-4">
        <li><a href="https://wiki.ashes.live">Ashes Community Wiki</a></li>
        <li><a href="https://www.youtube.com/watch?v=zvvX1HQgwNU&list=PLmHifZPFC_JtixhVcpyDwXv4y6vKN0BUr">Team Covenant</a> <span class="text-gray">(YouTube)</span></li>
        <li><a href="https://www.plaidhatgames.com/plaid-hat-podcast/">The Plaid Hat Podcast</a></li>
      </ul>

      <h3 class="font-bold my-4">Files</h3>

      <ul class="list-disc pl-4">
        <li><a :href="getCDNURL('/files/ashes-reborn-rules.pdf')">Ashes Reborn Rules</a> <span class="text-gray">(PDF)</span></li>
        <li><a :href="getCDNURL('/files/ashes-reborn-faq.pdf')">Ashes Reborn FAQ</a> <span class="text-gray">(PDF)</span></li>
        <li><a :href="getCDNURL('/files/ashes-red-rains-rules.pdf')">Ashes Red Rains Rules</a> or <a :href="getCDNURL('/files/ashes-red-rains-combined-rules.pdf')">Exhaustive Red Rains Rules</a> <span class="text-gray">(PDF)</span></li>
        <li>Dice reference cards:
          <div class="text-2xl mt-1">
            <a class="die ceremonial phg-ceremonial-power py-1 px-2" :href="getCDNURL('/images/cards/ceremonial-magic.jpg')" target="_blank"><span class="alt-text">Ceremonial Magic</span></a>
            <a class="die charm phg-charm-power py-1 px-2" :href="getCDNURL('/images/cards/charm-magic.jpg')" target="_blank"><span class="alt-text">Charm Magic</span></a>
            <a class="die illusion phg-illusion-power py-1 px-2" :href="getCDNURL('/images/cards/illusion-magic.jpg')" target="_blank"><span class="alt-text">Illusion Magic</span></a>
            <a class="die natural phg-natural-power py-1 px-2" :href="getCDNURL('/images/cards/natural-magic.jpg')" target="_blank"><span class="alt-text">Natural Magic</span></a>
            <a class="die divine phg-divine-power py-1 px-2" :href="getCDNURL('/images/cards/divine-magic.jpg')" target="_blank"><span class="alt-text">Divine Magic</span></a>
            <a class="die sympathy phg-sympathy-power py-1 px-2" :href="getCDNURL('/images/cards/sympathy-magic.jpg')" target="_blank"><span class="alt-text">Sympathy Magic</span></a>
            <a class="die time phg-time-power py-1 px-2" :href="getCDNURL('/images/cards/time-magic.jpg')" target="_blank"><span class="alt-text">Time Magic</span></a>
          </div>
        </li>
      </ul>

      <hr class="border-gray-light mt-6 mb-4">

      <h3 class="font-bold my-4">Legacy 1.0 content</h3>

      <ul class="list-disc pl-4">
        <li><a :href="getCDNURL('/legacy/files/ashes-core-rules.pdf')">Legacy Rules</a> <span class="text-gray">(PDF)</span></li>
        <li><a :href="getCDNURL('/legacy/files/ashes-raven-rules.pdf')">Raven Rules</a> <span class="text-gray">(PDF; fan-made replacement for official FAQ)</span></li>
        <li><a :href="getCDNURL('/legacy/files/ashes-rules-reference.pdf')">Legacy Rules Reference</a> <span class="text-gray">(PDF; all official rules, one document)</span></li>
        <li><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=1717839303">Tabletop Simulator: Ashes Custom Workshop</a> <span class="text-gray">(legacy TTS mod; includes Project Phoenix fan-made content)</span></li>
      </ul>
    </div>
    <div class="sm:w-1/3">
      <h2>Resources for new players</h2>

      <p>Welcome to Ashes Reborn! In addition to the resources below, we would love to have you come say "hello" in the <a href="https://discord.gg/UU5bduq">Community Discord</a>!</p>

      <ul class="list-disc pl-4">
        <li><a href="https://wiki.ashes.live">Ashes Community Wiki</a> (text; most up-to-date collection of learning material!)</li>
        <li><a href="https://jaysonsethlindley.medium.com/phoenix-rising-a-new-player-guide-to-ashes-reborn-c93c9d5d981e">Phoenix Rising: A New Player Guide to Ashes Reborn</a> (text; some overlap with the links below)</li>
        <li><a href="https://beckism.com/2021/04/a-beginners-guide-to-ashes-reborn/">A beginner's guide to Ashes Reborn</a> (text)</li>
        <li><a href="https://beckism.com/2021/04/archetypal-strategies-in-ashes-reborn/">Archetypal strategies in Ashes Reborn</a> (text; best after you've played a few games)</li>
        <li><a href="https://jaysonsethlindley.medium.com/colorful-cubes-foundations-of-deckbuilding-in-ashes-reborn-c49cd1abbe29">Colorful Cubes: Foundations of Deckbuilding in Ashes Reborn</a> (text)</li>
      </ul>

      <hr class="border-gray-light mt-8 mb-4">

      <h2>Current site progress</h2>

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
            <i class="far fa-check-square"></i>
          </span>
          <span>
            Private deck building
          </span>
        </li>
        <li class="flex flex-nowrap">
          <span class="pr-2">
            <i class="far fa-check-square"></i>
          </span>
          <span>
            Publishing decks; TTS &amp; Ashteki integration
          </span>
        </li>
        <li class="flex flex-nowrap">
          <span class="pr-2">
            <i class="far fa-square"></i>
          </span>
          <span class="text-gray-dark">
            Private snapshots; deckbuilding improvements
          </span>
        </li>
        <li class="flex flex-nowrap">
          <span class="pr-2">
            <i class="far fa-square"></i>
          </span>
          <span class="text-gray-dark">
            Comments (on decks and cards)
          </span>
        </li>
        <li class="flex flex-nowrap">
          <span class="pr-2">
            <i class="far fa-square"></i>
          </span>
          <span class="text-gray-dark">
            Posts
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
