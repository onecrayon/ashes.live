<script>
import { compile } from 'vue'
import { parseFormattedText, parseEffectText } from '/src/utils.js'

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
    },
    needsParagraphs: {
      type: Boolean,
      default: false,
    },
  },
  setup (props) {
    // Setup accepts a reactive `props` object and can return a render function, so this
    // functionally allows us to compile arbitrary HTML into Vue components
    let cardText = props.isCardEffect ? parseEffectText(props.content, props.isLegacy) : parseFormattedText(props.content, props.needsParagraphs, props.isLegacy)
    if (props.needsParagraphs && !props.isCardEffect) {
      cardText = `<div class="parsed-text">${cardText}</div>`
    }
    return compile(
      cardText
    )
  },
}
</script>
