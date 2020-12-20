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
    isLegacy: {
      type: Boolean,
      default: false,
    }
  },
  setup (props) {
    // Setup accepts a reactive `props` object and can return a render function, so this
    // functionally allows us to compile arbitrary HTML into Vue components
    const cardText = props.isCardEffect ? parseEffectText(props.content, props.isLegacy) : parseCardText(props.content, false, props.isLegacy)
    return compile(
      cardText
    )
  },
}
</script>
