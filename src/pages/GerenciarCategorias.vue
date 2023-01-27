<template>
  <q-page padding>
    <q-table
      title="Categorias"
      rows-per-page-label="Categoria por página"
      :rows-per-page-options="[10, 20]"
      :rows="categorias"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="delete" color="negative" dense size="sm" @click="handleDeleteCategorias(props.row.id_categoria)"/>
        </q-td>
      </template>
  </q-table>
</q-page>
</template>

<script>

import { defineComponent, ref, onMounted } from 'vue'
import categoriasService from 'src/services/categorias'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'GerenciarCategorias',

  setup () {
    const { list, remove } = categoriasService()
    const $q = useQuasar()
    const categorias = ref([])
    const columns = [
      { name: 'id_categoria', field: 'id_categoria', label: 'Id. Categoria', sortable: true, align: 'left' },
      { name: 'id_categoria_superior', field: 'id_categoria_superior', label: 'Id. Categoria Superior', sortable: true, align: 'left' },
      { name: 'ds_categoria', field: 'ds_categoria', label: 'Categoria', sortable: true, align: 'left' },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'right' }
    ]

    onMounted(() => {
      getCategorias()
    })

    const getCategorias = async () => {
      try {
        const data = await list()
        categorias.value = data
      } catch (e) {
        console.error(e)
      }
    }

    const handleDeleteCategorias = async (id) => {
      try {
        await remove(id)
        $q.notify({ message: 'Categoria excluída com sucesso.', icon: 'check', color: 'positive' })
        await getCategorias()
      } catch (e) {
        alert(e)
      }
    }

    return {
      categorias,
      columns,
      handleDeleteCategorias
    }
  }

})
</script>

<style>

</style>
