<template>
  <q-page padding >
    
    <div class="row justify-center">

      <q-table
        :rows="listCategorias"
        :columns="columnsCategorias"
        row-key="id_categoria"
        grid
        hide-pagination
        hide-no-data
        rows-per-page-label=" "
        :rows-per-page-options="[0]"
      >

      <template v-slot:item="props">
        <transition
          appear
          enter-active-class="animated fadeInLeft"
          leave-active-class="animated fadeOutRight"
        >
          <div class="q-gutter-md row justify-center">
            <div class="q-px-sm col-xs-12">
              <q-card class="q-my-sm" style="border-radius: 20px; width: 250px;">
                <q-img
                  class="cursor-pointer"
                  :src="props.row.img_url"
                  :ratio="5/3"
                  @click="abrirChamado(props.row)"
                >
                  <div class="absolute-bottom text-subtitle2 text-center">
                    {{ props.row.ds_categoria }}
                  </div>
                </q-img>
              </q-card>
            </div>
          </div>
        </transition>
      </template>

      </q-table>

    </div>

    <q-dialog v-model="showPreviewDialog" persistent>      

      <q-card class="q-mx-auto q-mt-md " style="min-width: 700px; border-radius: 20px"> 
        <div class="container q-mx-auto q-mt-md" style="max-width: 500px;">

          <h4 class="text-h6 text-primary text-center q-my-none">{{ nameCategoria }}</h4>
          
          <q-form @submit.prevent="onSubmit">
            <div class="q-mx-auto q-pa-md q-gutter-y-sm ">          

              <q-select
                  class="q-pb-none"
                  rounded outlined
                  dense
                  color="amber-9"
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  :options="colaboradores"
                  v-model="idColaborador"
                  label="Colaborador"
                  @filter="filterFn"
                  emit-value
                  map-options                
              >
                <template v-slot:prepend>
                  <q-icon name="map" />
                </template>
    
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Nenhuma opção encontrada
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>    

              <q-select        
                class="q-pb-sm"      
                v-model="selectedCategory"
                :options="categorias"
                option-label="ds_categoria"
                option-value="id_categoria"
                emit-value
                map-options
                label="Categoria"  
                dense      
                rounded outlined
                color="amber-9"
                @update:model-value="handleCategotyChange"
              >
                <template v-slot:prepend>
                    <q-icon name="mdi-checkbox-marked-outline" />
                  </template>
              </q-select>

              <!-- SELECT DINÂMICO DE SUBCATEGORIAS -->
              <q-select
                v-if="subCategorias.length"
                v-model="selectedSubCategory"
                :options="subCategorias"
                option-label="ds_categoria"
                option-value="id_categoria"
                emit-value
                map-options
                label="Subcategoria"
                dense
                rounded
                outlined
                color="amber-9"
                class="q-mt-sm"
              >
                <template v-slot:prepend>
                  <q-icon name="subdirectory_arrow_right" />
                </template>
              </q-select>

              <q-editor
                v-model="form.editor"
                rounded
                outlined
                dense
                color="amber-9"
                class="q-mb-md bg-blue-grey-2"
                min-height="10rem"
                :content-style="{
                  backgroundColor: 'transparent',
                  padding: '8px',
                  fontSize: '14px'
                }"
                :toolbar="[
                  ['bold', 'italic', 'underline'],
                  ['unordered', 'ordered'],
                  ['link']
                ]"
              />
      
              <q-file              
                color="amber-9"
                v-model="files"
                label="Anexos"
                rounded outlined
                dense
                multiple
                append
                use-chips
                accept="*"
                >
                <template v-slot:prepend>
                  <q-icon name="mdi-attachment" />
                </template>
    
              </q-file>              
      
              <q-btn label="Salvar" type="submit"  color="primary" class="full-width" v-close-popup rounded />
    
              <q-btn label="Sair" color="primary" class="full-width" rounded flat v-close-popup @click="cleanDialog" />
      
            </div>
      
          </q-form>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import useNotify from 'src/composables/UseNotify'
import { columnsCategorias } from 'src/composables/UseTable'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const { notifyError } = useNotify()
const listCategorias = ref([])
const $q = useQuasar()
const router = useRouter()

///////////////////////////////////
const showPreviewDialog = ref(false)
const categorias = ref([])
const subCategorias = ref([])
const selectedCategory = ref()
const selectedSubCategory = ref()
const form = ref({
  editor: '',
})

const colaboradores = ref([])
const idColaborador = ref(null)
const nameCategoria = ref(null)
const colaborador = ref(null)
const stringOptions = ref([]) 
const files= ref([])


onMounted(async () => {
  $q.loading.show()
  const validacao = {
    token: '28211958347828700123580312950',
    cd_colaborador: '15948'
    // token: route.query.dsTokenAppUsuario,
    // cd_colaborador: route.query.cdUsuario
  }
  try {        
    const response = await api.post('validateToken/', validacao)    
    if (response.data.msg === 'Não autorizado') {
      window.location = response.data.url
    } else {
      getListCategorias()
      const { data } = await api.get('colaborador/'+ validacao.cd_colaborador )                
      $q.localStorage.set('cd_colaborador', data[0].CD_COLABORADOR)
      $q.localStorage.set('nm_completo_colab', data[0].NM_COMPLETO_COLAB)
      $q.localStorage.set('cd_unorg', data[0].CD_UNORG)
    }
  } catch (error) {
    $q.loading.hide()
    console.log(error)
  }
  $q.loading.hide()
})

const getListCategorias = async (id) => {
  try {
    $q.loading.show()
    const { data } = await api.get('categoria-master/')
    listCategorias.value = data    
    $q.loading.hide()
  } catch (error) {
    notifyError(error.message)
    $q.loading.hide()
  }
}

const abrirChamado = async (props) => {    
  showPreviewDialog.value = true
  categorias.value = await getCategorias(props.id_categoria)    
  nameCategoria.value = props.ds_categoria
  getColaboradores()    
  idColaborador.value = $q.localStorage.getItem('cd_colaborador')  
}

const filterFn = (val, update, abort) => {
  if (!val) {
    update(() => {
      colaboradores.value = stringOptions.value
    })
    return
  }

  const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  update(() => {
    const needle = normalize(val)
    colaboradores.value = stringOptions.value.filter(v =>
      normalize(v.label).includes(needle)
    )
  })
}

const getColaboradores = async () => {
  try {
    const { data } = await api.get('colaboradores/')

    const options = data.map(colab => ({
      value: colab.CD_COLABORADOR,
      label: colab.NM_COMPLETO_COLAB
    }))

    colaboradores.value = options
    stringOptions.value = options
  } catch (error) {
    notifyError(error.message)
  }
}

const handleCategotyChange = async (id_categoria) => {
  selectedSubCategory.value = null
  subCategorias.value = await getCategorias(id_categoria)
}

const getCategorias = async (id) => {
  try {
    $q.loading.show()
    const { data } = await api.get('categoria-superior/'+ id)
    $q.loading.hide()
    return data    
  } catch (error) {
    notifyError(error.message)
    $q.loading.hide()
  }
}

const cleanDialog = async() => {
  selectedCategory.value = null
  subCategorias.value.length = 0
  files.value = null
  form.value.editor = ''
}

const onSubmit = async() => {
  try {
    
  } catch (error) {
    
  }
}

</script>
