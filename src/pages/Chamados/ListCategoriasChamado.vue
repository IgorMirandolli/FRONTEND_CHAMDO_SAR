<template>
  <q-page padding>

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
                    :src="props.row.IMG_URL"
                    :ratio="5/3"
                    @click="abrirChamado(props.row)"
                  >
                    <div
                      class="absolute-bottom text-subtitle2 text-center"
                      style="background-color: rgba(0, 0, 0, 0.6); color: white;"
                    >
                      {{ props.row.DS_CATEGORIA }}
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
      <q-card class="q-mx-auto q-mt-md" style="min-width: 700px; border-radius: 20px">
        <div class="container q-mx-auto q-mt-md" style="max-width: 500px;">

          <h4 class="text-h6 text-primary text-center q-my-none">
            {{ nameCategoria }}
          </h4>

          <q-form @submit.prevent="onSubmit">
            <div class="q-mx-auto q-pa-md q-gutter-y-sm">

              <!-- USUÁRIOS -->
              <q-select
                rounded outlined dense
                color="amber-9"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="colaboradores"
                v-model="idColaborador"
                :label="$t('employee')"
                @filter="filterFn"
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
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
                v-model="selectedCategory"
                :options="categorias"
                option-label="DS_CATEGORIA"
                option-value="ID_CATEGORIA"
                emit-value
                map-options
                :label="$t('category')"
                dense
                rounded outlined
                color="amber-9"
                @update:model-value="handleCategotyChange"
              />

              <q-select
                v-if="subCategorias.length"
                v-model="selectedSubCategory"
                :options="subCategorias"
                option-label="DS_CATEGORIA"
                option-value="ID_CATEGORIA"
                emit-value
                map-options
                :label="$t('sub_category')"
                dense
                rounded outlined
                color="amber-9"
              />

              <q-editor
                v-model="form.editor"
                rounded
                outlined
                dense
                min-height="10rem"
                color="amber-9"
                class="q-mb-sm bg-blue-grey-2"
              />

              <q-file
                color="amber-9"
                v-model="files"
                :label="$t('attachments')"
                rounded outlined dense
                multiple
                append
                use-chips
              />

              <q-btn
                :label="$t('save')"
                type="submit"
                color="primary"
                class="full-width"
                rounded
              />

              <q-btn
                :label="$t('exit')"
                color="primary"
                class="full-width"
                rounded
                flat
                v-close-popup
                @click="cleanDialog"
              />
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
import { useI18n } from 'vue-i18n'

const { notifyError, notifySuccess } = useNotify()
const { t } = useI18n()
const $q = useQuasar()

const listCategorias = ref([])
const showPreviewDialog = ref(false)
const categorias = ref([])
const subCategorias = ref([])
const selectedCategory = ref()
const selectedSubCategory = ref()

const colaboradores = ref([])
const idColaborador = ref(null)
const stringOptions = ref([])

const form = ref({ editor: '' })
const files = ref([])
const nameCategoria = ref(null)

onMounted(() => {
  getListCategorias()
})

const getListCategorias = async () => {
  try {
    const { data } = await api.get('categoria-master/')
    listCategorias.value = Array.isArray(data) ? data : []
  } catch (error) {
    notifyError(error.message)
  }
}

const abrirChamado = async (categoria) => {
  showPreviewDialog.value = true
  categorias.value = await getCategorias(categoria.ID_CATEGORIA)
  nameCategoria.value = categoria.DS_CATEGORIA
  getUsuarios()
}

const getUsuarios = async () => {
  try {
    const { data } = await api.get('usuario')

    const options = data.map(user => ({
      value: user.CD_USUARIO,
      label: user.NM_COMPLETO_USUARIO
    }))

    colaboradores.value = options
    stringOptions.value = options
  } catch (error) {
    notifyError(error.message)
  }
}

const filterFn = (val, update) => {
  if (!val) {
    update(() => colaboradores.value = stringOptions.value)
    return
  }

  const needle = val.toLowerCase()
  update(() => {
    colaboradores.value = stringOptions.value.filter(
      v => v.label.toLowerCase().includes(needle)
    )
  })
}

const getCategorias = async (id) => {
  try {
    const { data } = await api.get(`categoria-superior/${id}`)
    return data
  } catch (error) {
    notifyError(error.message)
    return []
  }
}

const handleCategotyChange = async (id) => {
  selectedSubCategory.value = null
  subCategorias.value = await getCategorias(id)
}

const cleanDialog = () => {
  selectedCategory.value = null
  selectedSubCategory.value = null
  subCategorias.value = []
  form.value.editor = ''
  files.value = []
}

const onSubmit = async () => {
  try {
    // 1️⃣ cria o chamado
    const chamado = {
      DS_CHAMADO: form.value.editor,
      ID_CATEGORIA: selectedSubCategory.value || selectedCategory.value,
      CD_USUARIOS_ABERTURA: idColaborador.value
    }

    const { data } = await api.post('chamados', chamado)

    const ID_CHAMADO = data.ID_CHAMADO

    // 2️⃣ envia anexos
    if (files.value && files.value.length) {
      const formData = new FormData()
      formData.append('ID_CHAMADO', ID_CHAMADO)
      formData.append('CD_USUARIO', idColaborador.value)

      files.value.forEach(file => {
        // ⚠️ TEM que ser 'files'
        formData.append('files', file)
      })

      await api.post('anexos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    notifySuccess(t('success'))
    cleanDialog()
    showPreviewDialog.value = false

  } catch (error) {
    notifyError(error.response?.data || error.message)
  }
}
</script>
