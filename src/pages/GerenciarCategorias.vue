<template>
  <q-page padding>
    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </q-page>
</template>

<script>

import { defineComponent, ref } from 'vue'
import { api } from 'src/boot/axios'

export default defineComponent({
  name: 'GerenciarCategorias',

  setup () {
    const categorias = ref([])
    const columns = [
      { name: 'id_categoria', field: 'calories', label: 'Id. Categoria', sortable: true, align: 'left' },
      { name: 'id_categoria_superior', field: 'id_categoria_superior', label: 'Id. Categoria Superior', sortable: true, align: 'left' },
      { name: 'ds_categoria', field: 'ds_categoria', label: 'Categoria', sortable: true, align: 'left' }
    ]

    const getCategorias = async () => {
      try {
        const { data } = await api.get('categorias')
        console.log(data)
      } catch (e) {
        console.error(e)
      }
    }

    return {
      categorias, columns
    }
  }

})
</script>

<style>

</style>
