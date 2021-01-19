<script>
import { compile } from 'vue'
import { parseCardText } from '/src/utils.js'

export default {
  name: 'DeckDescription',
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  setup (props) {
    // Setup accepts a reactive `props` object and can return a render function, so this
    // functionally allows us to compile arbitrary HTML into Vue components
    return compile(
      `<div class="deckDescription">` +
        parseCardText(props.content) +
        '</div>'
    )
  },
}
</script>
<style>

.deckDescription ul {
  list-style-type: disc;
  padding-left: 40px;
}

</style>