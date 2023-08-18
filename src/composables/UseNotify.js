import { useQuasar } from 'quasar'
export default function useNotify () {
  const $q = useQuasar()

  const notifySuccess = (message) => {
    $q.notify({
      type: 'positive',
      message: message || 'All right !',
      position: 'top-right'
    })
  }

  const notifyWarnig = (message) => {
    $q.notify({
      type: 'warning',
      message: message || 'Warning!',
      position: 'top-right'
    })
  }

  const notifyError = (message) => {
    $q.notify({
      type: 'negative',
      message: message || 'Failed !',
      position: 'top-right'
    })
  }

  return {
    notifySuccess,
    notifyError,
    notifyWarnig
  }
}
