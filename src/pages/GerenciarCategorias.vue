<template>
  <q-page padding>
    <q-table
    title="Categorias"
    rows-per-page-label="Categoria por página"
    :rows-per-page-options="[10, 20]"
    :rows="categorias"
    :columns="columns"
    row-key="name"
    :filter="filter"
      >
      <template v-slot:top>
        <span class="text-h5">Categorias</span>
        <q-space />
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Pesquisa">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <q-btn color="primary" label="Nova Categoria" @click="prompt = true" />
      </template>
      <template v-slot:body-cell-actions="props">
          <q-td
            :props="props"
            :class="(props.row.st_categoria=='Inativa')?'bg-accent text-white':'bg-white text-black'"
            class="wrapper"
          >
            <q-btn icon="delete" color="negative" dense size="sm" @click="handleSituacaoCategorias(props.row.id_categoria, 'I')">
              <q-tooltip anchor="bottom middle" self="top middle">Inativar</q-tooltip>
            </q-btn>
            <q-btn icon="done" color="positive" dense size="sm" @click="handleSituacaoCategorias(props.row.id_categoria, 'A')">
              <q-tooltip anchor="bottom middle" self="top middle">Ativar</q-tooltip>
            </q-btn>
          </q-td>
      </template>
    </q-table>

    <q-dialog v-model="prompt" no-backdrop-dismiss>
      <q-card style="min-width: 350px">
        <q-form
        @submit="onSubmit"
        @reset="onReset"
        >
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
            :rules="[val =>val && val.length >= 3 || 'Subcategoria deve ter pelo menos 3 caracteres' ]"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
              label="Cancelar"
              icon="cancel"
              type="reset"
              v-close-popup
              />
            <q-btn
              label="Salvar"
              color="primary"
              icon="save"
              type="submit"
              v-close-popup
            />
          </q-card-actions>
        </q-form>
        </q-card>
      </q-dialog>

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
    const { list, remove } = categoriasService()
    const idCategoriaSuperior = ref(null)
    const filter = ref('')
    const loading = ref(false)
    const dsCategoria = ref(null)
    const idCategorias = ref(null)
    const $q = useQuasar()
    const categorias = ref([])
    const categoria = ref({})
    const options = ref([])
    const columns = [
      { name: 'id_categoria', field: 'id_categoria', label: 'Id. Categoria', sortable: true, align: 'left' },
      { name: 'ds_categoria', field: 'ds_categoria', label: 'Categoria', sortable: true, align: 'left' },
      { name: 'id_categoria_superior', field: 'id_categoria_superior', label: 'Id. Categoria Superior', sortable: true, align: 'left' },
      { name: 'ds_categoria_superior', field: 'ds_categoria_superior', label: 'Categoria Superior', sortable: true, align: 'left' },
      { name: 'situacao', field: 'situacao', label: 'Situação', sortable: true, align: 'left' },
      { name: 'actions', field: 'actions', label: 'Ações', align: 'center' }
    ]

    onMounted(() => {
      getCategorias()
    })

    const getCategorias = async () => {
      try {
        const response = await list()
        categorias.value = response
        const { data } = await api.get('categorias/master')
        // console.log(categorias.value)
        options.value = data.map(categorias => {
          return { value: categorias.id_categoria, label: categorias.ds_categoria }
        })
      } catch (e) {
        // console.error(e)
      }
    }

    const handleSituacaoCategorias = (id, sit) => {
      $q.dialog({
        title: sit === 'A' ? 'ATIVAÇÃO' : 'INATIVAÇÃO',
        message: 'Deseja alterar a situação da categoria?',
        cancel: true,
        persistent: false
      }).onOk(async () => {
        // await api.remove('categorias', id)
        if (sit === 'I') {
          // console.log('Inativação')
          await remove(id)
            .then(() => {
              $q.notify({ message: 'Categoria alterada com sucesso.', icon: 'check', color: 'positive', position: 'top-right' })
            })
            .catch(() => {
              $q.notify({ message: 'Categoria possui subcategorias.', icon: 'warning', color: 'negative', position: 'top-right' })
            })
        } else {
          // console.log('Ativação > ' + id)
          categoria.value.st_categoria = 'Ativa'
          await api.put(`categorias/${id}`, categoria.value)
            .then(() => {
              $q.notify({ message: 'Categoria alterada com sucesso.', icon: 'check', color: 'positive', position: 'top-right' })
            })
            .catch(() => {
              $q.notify({ message: 'Categoria possui subcategorias.', icon: 'warning', color: 'negative', position: 'top-right' })
            })
        }
        // .catch(err => {
        //   console.log(err.response)
        //   $q.notify({ message: err.response.data.msg, icon: 'warning', color: 'negative', position: 'top-right' })
        // })
        await getCategorias()
      })
    }

    const onSubmit = async () => {
      loading.value = true
      categoria.value = {
        st_categoria: 'Ativa',
        id_categoria_superior: idCategoriaSuperior.value,
        ds_categoria: dsCategoria.value
      }
      // await post(categoria.value)
      try {
        await api.post('categorias', categoria.value)
          .then(() => {
            $q.notify({
              color: 'positive',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Categoria Salva',
              position: 'top-right'
            })
          })
        onReset()
      } catch (error) {
        $q.notify({ message: error.response.data, icon: 'times', color: 'negative', position: 'top-right' })
      }

      onReset()
      await getCategorias()
      loading.value = false
    }

    const onReset = () => {
      categoria.value = null
      idCategoriaSuperior.value = null
      dsCategoria.value = null
    }

    return {
      categorias,
      columns,
      handleSituacaoCategorias,
      prompt: ref(false),
      address: ref(''),
      text: ref(''),
      filter,
      idCategorias,
      options,
      categoria,
      onReset,
      onSubmit,
      idCategoriaSuperior,
      dsCategoria,
      loading
    }
  }

})
</script>

<style>
.wrapper {
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   grid-column-gap: 3px;
   grid-row-gap: 1em;
}
</style>
