<template>
  <div class="sm:flex">
    <div class="sm:pr-8 pb-8 sm:w-2/3">
      <h1 class="phg-time-class">Ongoing migration</h1>

      <p><strong class="text-lg">Don't worry! Your account and decks are safe!</strong> To support Ashes Reborn and make it possible for me to keep the site maintained long-term, I am rewriting everything from the ground up. Your account and all your decks are still saved, and I am hard at work writing the code to make them available once again!</p>

      <p>In the short term you can find me on <a href="https://discord.gg/UU5bduq">Discord</a> (<span class="font-mono text-red">Skaak<span class="text-gray-dark">#0007</span></span>) or <a href="https://www.boardgamegeek.com/user/Skaak">BoardGameGeek</a> if you need to contact me about anything related to Ashes.live, your account, or whatever else!</p>

      <h2>Resources</h2>

      <h3 class="font-bold my-4">Community</h3>

      <ul class="list-disc pl-4">
        <li><a href="https://discord.gg/UU5bduq">Community Discord</a> <span class="text-gray">(TTS matchmaking + general discussion)</span></li>
        <li><a href="https://www.reddit.com/r/AshesGame/">Ashes on reddit</a></li>
        <li><a href="https://boardgamegeek.com/boardgame/167400/ashes-rise-phoenixborn/forums/0">Ashes on BoardGameGeek</a></li>
      </ul>

      <h3 class="font-bold my-4">Files</h3>

      <ul class="list-disc pl-4">
        <li><a href="https://cdn.ashes.live/files/ashes-reborn-rules.pdf">Ashes Reborn Rules</a> <span class="text-gray">(PDF)</span></li>
      </ul>

      <hr class="border-gray-light my-2">

      <ul class="list-disc pl-4">
        <li><a href="https://cdn.ashes.live/legacy/files/ashes-core-rules.pdf">Legacy Rules</a> <span class="text-gray">(PDF)</span></li>
        <li><a href="https://cdn.ashes.live/legacy/files/ashes-raven-rules.pdf">Raven Rules</a> <span class="text-gray">(PDF; fan-made replacement for official FAQ)</span></li>
        <li><a href="https://cdn.ashes.live/legacy/files/ashes-rules-reference.pdf">Legacy Rules Reference</a> <span class="text-gray">(PDF; all official rules, one document)</span></li>
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
  },
}
</script>
