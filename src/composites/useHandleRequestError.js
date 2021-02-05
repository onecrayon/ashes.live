/**
 * usehandleRequestError()
 *
 * Composition API provider for standardized Toast request error handling.
 * Returns { handleRequestError, toast }
 */
import { useToast } from 'vue-toastification'
import ValidityErrors from '../components/shared/ValidityErrors.vue'

export default function () {
  const toast = useToast()
  const handleRequestError = function (error) {
    if (typeof error === 'string') {
      toast.error(error)
      return
    }
    // Handle validation failure objects
    toast.error({
      component: ValidityErrors,
      props: {
        errors: error
      }
    })
  }
  return {
    handleRequestError,
    toast,
  }
}
