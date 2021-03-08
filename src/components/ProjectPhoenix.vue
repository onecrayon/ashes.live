<template>
  <h1 class="phg-time-power">Project Phoenix</h1>

  <p class="text-lg">Project Phoenix was a fan-driven initiative to develop Time magic expansions for the legacy version of Ashes: Rise of the Phoenixborn.</p>

  <p>When Ashes was canceled in April 2019, a group of fans decided to take up the torch and create decks for the missing seventh magic type, Time (we knew Time magic was a thing because Plaid Hat printed the power symbol on the deluxe expansion boxes, and the name got leaked by playtesters; however, Plaid Hat never announced any specific plans for Time magic prior to the game being canceled).</p>

  <p>Prior to the Reborn announcement in August 2020, Project Phoenix released four fan-made Time magic decks, a custom Time dice power, and Raven Rules (a complete replacement of the legacy FAQ that eventually informed some of the changes in Ashes Reborn). Although these decks are no longer legal, you can still download them if you wish to try some Legacy Ashes with that Project Phoenix flare.</p>

  <h2 class="phg-time-class">Available files</h2>

  <ul class="list-disc pl-4">
    <li><a :href="getCDNURL('/legacy/files/pnp/time-dice-reference.png')">Time dice power reference</a></li>
    <li><a :href="getCDNURL('/legacy/files/ashes-raven-rules.pnf')">Raven Rules</a></li>
    <li><a :href="getCDNURL('/legacy/files/pnp/jill-the_treasures_of_the_ages.zip')">Jill Traversack: The Treasures of the Ages</a> (mono-Time)</li>
    <li><a :href="getCDNURL('/legacy/files/pnp/tolliver-the_young_ruler.zip')">Tolliver I: The Young Ruler</a> (Charm + Time)</li>
    <li><a :href="getCDNURL('/legacy/files/pnp/mpc-expansions-1-2.zip')">Full bleed images for Jill and Tolliver</a> (for easier printing via online services)</li>
    <li><a :href="getCDNURL('/legacy/files/pnp/devlin-the_scoundrels_of_the_sea.zip')">Devlin Longbow: The Scoundrels of the Sea</a> (Natural + Time); also available as <a :href="getCDNURL('/legacy/files/pnp/devlin-the_scoundrels_of_the_sea-sheets.zip')">PDF sheets</a> or <a :href="getCDNURL('/legacy/files/pnp/devlin-the_scoundrels_of_the_sea-sheets-jpg.zip')">JPG sheets</a></li>
    <li><a :href="getCDNURL('/legacy/files/pnp/plutarch-the_mad_doctor.zip')">Plutarch Eastgate: The Mad Doctor</a> (Ceremonial + Time); also available as <a :href="getCDNURL('/legacy/files/pnp/plutarch-the_mad_doctor-sheets.zip')">PDF sheets</a> or <a :href="getCDNURL('/legacy/files/pnp/plutarch-the_mad_doctor-sheets-jpg.zip')">JPG sheets</a></li>
  </ul>
</template>

<script>
export default {
  name: 'ProjectPhoenix',
  computed: {
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
