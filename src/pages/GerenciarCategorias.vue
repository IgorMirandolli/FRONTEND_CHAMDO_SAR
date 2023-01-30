<template>
  <q-page padding>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
    >
      <q-table
        title="Categorias"
        rows-per-page-label="Categoria por página"
        :rows-per-page-options="[10, 20]"
        :rows="categorias"
        :columns="columns"
        row-key="name"
      >
      <template v-slot:top>
        <span class="text-h5">Categorias</span>
        <q-space />
          <q-btn color="primary" label="Nova Categoria" @click="prompt = true" />
      </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn icon="delete" color="negative" dense size="sm" @click="handleDeleteCategorias(props.row.id_categoria)"/>
          </q-td>
        </template>
    </q-table>

    <q-dialog v-model="prompt" >
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Adicionar Categoria</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
            outlined
            v-model="idCategoriaSuperior"
            :options="options"
            emit-value
            :rules="[val => val || 'Escolha uma categoria superior' ]"
            map-options label="Categorias" />
            <br>
            <q-input
            outlined
            v-model="dsCategoria"
            label="Subcategoria"
            :rules="[val =>val && val.length >= 3 || 'Preencha a subcategoria' ]"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
              label="Cancelar"
              v-close-popup
              icon="cancel"
              type="reset"
              />
            <q-btn
              label="Salvar"
              color="primary"
              icon="save"
              type="submit"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-form>
  </q-page>
</template>

<script>

import { defineComponent, ref, onMounted } from 'vue'
import categoriasService from 'src/services/categorias'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'GerenciarCategorias',

  setup () {
    const { list, remove, post } = categoriasService()
    const idCategoriaSuperior = ref(null)
    const dsCategoria = ref(null)
    const idCategorias = ref(null)
    const $q = useQuasar()
    const categorias = ref([])
    const categoria = ref([])
    const options = ref([])
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
        const response = await list()
        categorias.value = response
        const { data } = await api.get('categorias/master')
        options.value = data.map(categorias => {
          return { value: categorias.id_categoria, label: categorias.ds_categoria }
        })
      } catch (e) {
        console.error(e)
      }
    }

    const handleDeleteCategorias = (id) => {
      try {
        $q.dialog({
          title: 'EXCLUSÃO',
          message: 'Deseja realmente excluir esta categoria?',
          cancel: true,
          persistent: false
        }).onOk(async () => {
          await remove(id)
          $q.notify({ message: 'Categoria excluída com sucesso.', icon: 'check', color: 'positive', position: 'top-right' })
          await getCategorias()
        })
      } catch (e) {
        $q.notify({ message: 'Erro ao excluir categoria.', icon: 'times', color: 'negative', position: 'top-right' })
      }
    }

    const onSubmit = async () => {
      console.log('entrou')
      try {
        this.categotia.st_categoria = 'A'
        this.categotia.id_categoria_superior = idCategoriaSuperior
        this.categotia.ds_categoria = dsCategoria
        console.log(categoria)
        await post(categoria)
        await getCategorias()
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Categoria Salva'
        })
      } catch (error) {

      }
    }

    const onReset = () => {
      this.categoria.value = null
      this.idCategoriaSuperior = null
      this.dsCategoria = null
    }

    return {
      categorias,
      columns,
      handleDeleteCategorias,
      prompt: ref(false),
      address: ref(''),
      text: ref(''),
      idCategorias,
      options,
      onSubmit,
      categoria,
      onReset,
      idCategoriaSuperior,
      dsCategoria
    }
  }

})
</script>

<style>

</style>
