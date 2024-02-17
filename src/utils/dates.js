import moment from 'moment'

/**
 * Given a timestamp in the past, return a human-readable string describing the relative
 * time that the comment happened
 *
 *
 * @param {str} timestamp
 */
export function getRelativeDateString (timestamp) {
  return moment(timestamp).fromNow()
}
