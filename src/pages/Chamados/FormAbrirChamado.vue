<template>
  <q-page padding>

    <h4 class="text-h6 text-white text-center q-my-none">Abrir Chamado</h4>

    <q-card class="q-mx-auto q-mt-md bg-blue-grey-2" style="max-width: 900px; border-radius: 20px"> 
      <div class="container q-mx-auto q-mt-md" style="max-width: 600px;">
        
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
              min-height="5rem"
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
              label="$t('images_property')"
              rounded outlined
              dense
              multiple
              append
              use-chips
              accept="*"
              >
              <template v-slot:prepend>
                <q-icon name="crop_original" />
              </template>
  
            </q-file>              
    
            <q-btn label="Salvar" type="submit"  color="primary" class="full-width"  rounded />
  
            <q-btn label="Voltar" color="primary" class="full-width" rounded flat :to="{ name: 'chamados'}" />
    
          </div>
    
        </q-form>
      </div>
    </q-card>    
    

  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import useNotify from 'src/composables/UseNotify'

const { notifyError } = useNotify()
const categorias = ref([])
const subCategorias = ref([])
const selectedCategory = ref()
const selectedSubCategory = ref()
const $q = useQuasar()
const form = ref({
  editor: '',
})
const route = useRoute()
const colaboradores = ref([])
const idColaborador = ref(null)
const colaborador = ref(null)
const stringOptions = ref([]) 
const files= ref([])


onMounted(async() => {
  categorias.value = await getCategorias(route.params.id)  
  getColaboradores()    
  idColaborador.value = $q.localStorage.getItem('cd_colaborador')  
})

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

const onSubmit = async() => {
  try {
    
  } catch (error) {
    
  }
}



</script>
