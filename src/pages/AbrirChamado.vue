<template>
    <q-page padding>
      <div class="row justify-center">

              <q-table
                :rows="categories"
                :columns="columnsCategories"
                row-key="id"
                :loading="loading"
                grid
                hide-pagination
              >

                <template v-slot:item="props">
                  <transition-group
                    appear
                    enter-active-class="animated fadeInLeft"
                    leave-active-class="animated fadeOutRight"
                  >
                    <div class="example-item q-pa-xs col-xs-12 col-sm-6 col-md-3" key="card">
                      <q-card class="cursor-pointer" >
                        <q-img :src="props.row.img_url" :ratio="4/3" @click="escolha(props.row)">
                          <div class="absolute-bottom text-subtitle2 text-center">
                            {{ props.row.ds_categoria }}
                          </div>
                        </q-img >
                      </q-card>
                    </div>
                  </transition-group>
                </template>

            </q-table>

      </div>
      <br>

    <!-- <q-form class="row justify-center" @submit.prevent="onSubmit"> -->
    <q-form class="row justify-center">

      <div class="col-md-5 col-sm-6 col-xs-10 q-gutter-y-md">

        <q-card class="my-card_1 text-white"
          style=" text-align: center; background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
          <q-card-section>
            <div class="text-h6">{{ abertura }}</div>
          </q-card-section>
        </q-card>

        <q-input standout="bg-blue text-white" autogrow label="Responsável"/>

        <q-select standout="bg-blue  text-white" transition-show="flip-up" transition-hide="flip-down"
        filled @update:model-value="escolha('subcategoria')" v-model="idCategorias" :options="categorias" :label="categoria" />

        <q-select standout="bg-blue text-white" v-model="idSubCategorias" :options="subCategorias" label="Sub-Categoria" />

        <q-editor v-model="editor" min-height="5rem" />

        <q-file
          v-model="files"
          label="Anexos"
          outlined
          use-chips
          multiple
          append
        />

        <q-btn label="Limpar" color="primary" class="full-width" rounded flat />

        <q-btn label="Salvar" type="submit"  color="primary" class="full-width"  rounded />

      </div>

      </q-form>

    </q-page>

</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import useNotify from 'src/composables/UseNotify'
import { api } from 'boot/axios'
import { columnsCategories } from 'src/composables/UseTable'

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const { notifyError } = useNotify()
    const categories = ref()
    const loading = ref(true)

    const files = null
    const model = null
    const categoria = ref('Selecione a categoria')
    const abertura = ref('Abrindo chamado para:')
    const idCategorias = ref(null)
    const idSubCategorias = ref(null)
    const categorias = ref([])
    const supCategorias = ref([])
    const subCategorias = ref([])
    const editor = ref('What you see is <b>what</b> you get.')

    const getCategorias = async () => {
      try {
        loading.value = true
        const { data } = await api.get('categorias/master')
        categories.value = data
        console.log(categories.value)
        // categorias.value = categories.value.map(categorias => {
        //   return { value: categorias.id_categoria, label: categorias.ds_categoria }
        // })
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    onMounted(() => {
      getCategorias()
    })

    const getCategoriasSuperior = async (id) => {
      try {
        const { data } = await api.get('categorias/superior/' + id)
        console.log(data)
        categorias.value = data.map(categorias => {
          return { value: categorias.id_categoria, label: categorias.ds_categoria }
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const escolha = (escolha) => {
      console.log(escolha)
      getCategoriasSuperior(escolha.id_categoria)
      abertura.value = escolha.ds_categoria
    }
    return {
      categories,
      loading,
      columnsCategories,

      categoria,
      categorias,
      supCategorias,
      abertura,
      escolha,
      subCategorias,
      files,
      model,
      idCategorias,
      idSubCategorias,
      editor
    }
  }
})

</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 300px
.titulo
  font-weight: bold
  font-size: 18px
  color: blue
.example-item
  width: 160px
</style>
