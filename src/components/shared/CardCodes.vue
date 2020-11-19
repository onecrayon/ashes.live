<script>
import { compile } from 'vue'
import { parseCardText, parseEffectText } from '/src/utils.js'

export default {
  name: 'CardCodes',
  props: {
    content: {
      type: String,
      required: true,
    },
    isCardEffect: {
      type: Boolean,
      default: false,
    },
  },
  setup (props) {
    // Setup accepts a reactive `props` object and can return a render function, so this
    // functionally allows us to compile arbitrary HTML into Vue components
    return compile(
      props.isCardEffect ? parseEffectText(props.content) : parseCardText(props.content)
    )
  },
}
</script>
