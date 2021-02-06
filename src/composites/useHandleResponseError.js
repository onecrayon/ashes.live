/**
 * usehandleResponseError()
 *
 * Composition API provider for standardized Toast request error handling.
 * Returns { handleResponseError, toast }
 */
import { useToast } from 'vue-toastification'
import ValidityErrors from '../components/shared/ValidityErrors.vue'

export default function () {
  const toast = useToast()
  const handleResponseError = function (error) {
    if (!error || !error.response || !error.response.data || !error.response.data.detail) {
      toast.error('Unknown server error: please report this!')
      return
    }
    const response = error.response
    // Parse validation errors, if one comes down the pipe
    if (response.status === 422) {
      let errors = []
      for (const failure of response.data.detail) {
        // TODO: figure out a better way to handle the location data, because this won't cut it for decks
        errors.push({
          loc: failure.loc[failure.loc.length - 1],
          msg: failure.msg
        })
      }
      toast.error({
        component: ValidityErrors,
        props: {
          errors: errors
        }
      })
      return
    }
    // Default to just returning the details
    toast.error(response.data.detail)
  }
  return {
    handleResponseError,
    toast,
  }
}
