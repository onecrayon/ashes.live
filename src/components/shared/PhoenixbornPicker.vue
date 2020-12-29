<template>
  <div class="flex flex-no-wrap">
    <select name="Phoenixborn" id="phoenixborn" @change="$emit('update:filter', $event.target.value)">
      <option value="">All phoenixborn</option>
      <option value="james-endersight">Aradel Summergaard</option>
      <option value="astrea">Astrea</option>
      <option value="brennen-blackcloud">Brennen Blackcloud</option>
      <option value="coal-roarkwin">Coal Roarkwin</option>
      <option value="echo-greystorm">Echo Greystorm</option>
      <option value="fiona-mercywind">Fiona Mercywind</option>
      <option value="harold-westraven">Harold Westraven</option>
      <option value="james-endersight">James Endersight</option>
      <option value="jessa-na-ni">Jessa Na Ni</option>
      <option value="koji-wolfcub">Koji Wolfcub</option>
      <option value="leo-sunshadow">Leo Sunshadow</option>
      <option value="maeoni-viper">Maeoni Viper</option>
      <option value="namine-hymntide">Namine Hymntide</option>
      <option value="noah-redmoon">Noah Redmoon</option>
      <option value="odette-diamondcrest">Odette Diamondcrest</option>
      <option value="rimea-careworn">Rimea Careworn</option>
      <option value="rin-northfell">Rin Northfell</option>
      <option value="saria-guideman">Saria Guideman</option>
      <option value="sembali-grimtongue">Sembali Grimtongue</option>
      <option value="victoria-glassfire">Victoria Glassfire</option>
      <option value="xander-heartsblood">Xander Heartsblood</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'PhoenixbornPicker',
  props: {
	},
  emits: ['update:filter'],
}
</script>
