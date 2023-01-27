import useApi from 'src/composables/UseApi'

export default function categoriasService () {
  const { list, post, put, remove } = useApi('categorias')

  return {
    list, post, put, remove
  }
}
