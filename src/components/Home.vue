<template>
  <div class="sm:flex">
    <div class="sm:pr-8 pb-8 sm:w-2/3">
      <h1 class="phg-time-class">Welcome to Ashes.live!</h1>

      <p class="text-lg">Ashes.live is a deck-building tool for the card game <a href="https://www.plaidhatgames.com/board-games/ashes-rise-phoenixborn/">Ashes Reborn: Rise of the Phoenixborn</a>. Use this site to build decks with every card available! However, if you want to print copies of your decks and don't mind being unable to build with the most recent release, you should try <a href="https://ashesdb.plaidhatgames.com/">Plaid Hat's AshesDB website</a> instead!</p>

      <p>If you need to contact me about anything related to Ashes.live, your account, or whatever else you can find me on <a href="https://discord.gg/UU5bduq">Discord</a> (<span class="font-mono text-red">Skaak</span>) or <a href="https://www.boardgamegeek.com/user/Skaak">BoardGameGeek</a>!</p>

      <h2>Versions of Ashes</h2>

      <p>Ashes was originally released in 2015 and distributed with white packaging under the title <strong>Ashes: Rise of the Phoenixborn</strong>. After its cancellation in 2019, it was re-released in 2021 as <strong>Ashes Reborn</strong> with an updated ruleset, significant changes to cards, and new red packaging. Original Ashes and Ashes Reborn are not compatible, but if you own original white box content Plaid Hat <a href="https://www.plaidhatgames.com/product/ashes-reborn-15-upgrade-kit/">sells an upgrade kit</a> to bring it into the Reborn era.</p>

      <p>The first new content released for Ashes Reborn were the decks that added Time dice to the pool, but following that Plaid Hat released a cycle of expansions called <strong>Red Rains</strong> in which players can battle either one another or against automated opponents called Chimera.</p>

      <p>In 2025, Plaid Hat announced the next cycle: <strong>Ashes Ascendancy</strong>. Ashes Ascendancy is fully backwards compatible with Ashes Reborn but introduces a new automated opponent called the Dragonborn (with slightly different rules than Red Rains Chimera) and two new dice types: astral and artifice dice. Additionally, Ashes Ascendancy has a new distribution method: new expansions will initially go to normal retail but once they are out of print, they will join all other Ashes cards available as "print on demand" through <a href="https://ashesdb.plaidhatgames.com/">Plaid Hat's AshesDB website</a>.</p>

      <h2>Resources</h2>

      <h3 class="my-4">Play Online</h3>

      <ul class="list-disc pl-4">
        <li><a href="https://ashteki.com">Ashteki</a> <span class="text-gray">(Play Ashes in your browser!)</span></li>
        <li><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2386753960">Ashes Reborn for Tabletop Simulator</a> <span class="text-gray">(requires Tabletop Simulator on Steam; <strong>no longer maintained!</strong>)</span></li>
        <li><a href="https://felttable.com/ashes">Felt Table</a> <span class="text-gray">(Play against an AI bot in your browser; <strong>no longer maintained!</strong>)</span></li>
      </ul>

      <h3 class="font-bold my-4">Community</h3>

      <ul class="list-disc pl-4">
        <li><a href="https://discord.gg/UU5bduq">Community Discord</a> <span class="text-gray">(matchmaking + general discussion)</span></li>
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
        <li><a :href="getCDNURL('/files/ashes-ascendancy-rules.pdf')">Ashes Ascendancy Rules</a> <span class="text-gray">(PDF)</span></li>
        <li><a :href="getCDNURL('/files/ashes-reborn-rules.pdf')">Ashes Reborn Rules</a> <span class="text-gray">(PDF)</span></li>
        <li><a :href="getCDNURL('/files/ashes-reborn-faq.pdf')">Ashes Reborn FAQ</a> <span class="text-gray">(PDF)</span></li>
        <li><a :href="getCDNURL('/files/ashes-reborn-op-rules.pdf')">Ashes Reborn Organized Play Rules</a> <span class="text-gray">(PDF)</span></li>
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

      <p><strong>Please note:</strong> these resources are only useful if you <em>only</em> own original Ashes "white box" content. If you have purchased the upgrade kit, or only own "red box" Reborn content, then these resources are out of date.</p>

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

      <hr class="border-gray-light mt-6 mb-4">

      <p>If you are a web developer interested in contributing to Ashes.live, please <a href="https://github.com/onecrayon/ashes.live">visit the GitHub repo</a>.</p>
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
