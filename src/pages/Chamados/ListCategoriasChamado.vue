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
                <q-card
                  class="q-my-sm"
                  style="border-radius: 20px; width: 250px"
                >
                  <q-img
                    class="cursor-pointer"
                    :src="props.row.IMG_URL"
                    :ratio="5 / 3"
                    @click="abrirChamado(props.row)"
                  >
                    <div
                      class="absolute-bottom text-subtitle2 text-center"
                      style="background-color: rgba(0, 0, 0, 0.6); color: white"
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
      <q-card
        class="q-mx-auto q-mt-md"
        style="min-width: 700px; border-radius: 20px"
      >
        <div class="container q-mx-auto q-mt-md" style="max-width: 500px">
          <h4 class="text-h6 text-primary text-center q-my-none">
            {{ nameCategoria }}
          </h4>

          <q-form @submit.prevent="onSubmit">
            <div class="q-mx-auto q-pa-md q-gutter-y-sm">
              <!-- TÍTULO -->
              <q-input
                v-model="form.titulo"
                label="Título do chamado"
                outlined
                dense
                rounded
                color="amber-9"
                maxlength="40"
                counter
              >
                <template v-slot:prepend>
                  <q-icon name="title" />
                </template>
              </q-input>

              <!-- CATEGORIA -->
              <q-select
                v-model="selectedCategory"
                :options="categorias"
                option-label="DS_CATEGORIA"
                option-value="ID_CATEGORIA"
                emit-value
                map-options
                label="Setor / Categoria"
                dense
                rounded
                outlined
                color="amber-9"
                @update:model-value="handleCategotyChange"
              />

              <!-- SUBCATEGORIA -->
              <q-select
                v-if="subCategorias.length"
                v-model="selectedSubCategory"
                :options="subCategorias"
                option-label="DS_CATEGORIA"
                option-value="ID_CATEGORIA"
                emit-value
                map-options
                label="Subcategoria"
                dense
                rounded
                outlined
                color="amber-9"
              />

              <!-- DESCRIÇÃO -->
              <q-editor
                v-model="form.editor"
                rounded
                outlined
                dense
                min-height="10rem"
                color="amber-9"
                class="q-mb-sm bg-blue-grey-2"
                placeholder="Descreva detalhadamente o chamado"
              />

              <!-- ANEXOS -->
              <q-file
                color="amber-9"
                v-model="files"
                label="Anexos"
                rounded
                outlined
                dense
                multiple
                append
                use-chips
              />

              <q-btn
                label="Fazer chamado"
                type="submit"
                color="primary"
                class="full-width"
                rounded
              />

              <q-btn
                label="Cancelar"
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
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import useNotify from "src/composables/UseNotify";
import { columnsCategorias } from "src/composables/UseTable";
import { api } from "boot/axios";

const { notifyError, notifySuccess } = useNotify();
const $q = useQuasar();

const listCategorias = ref([]);
const showPreviewDialog = ref(false);
const categorias = ref([]);
const subCategorias = ref([]);
const selectedCategory = ref();
const selectedSubCategory = ref();

const idColaborador = ref(null);

const form = ref({
  titulo: "",
  editor: "",
});

const files = ref([]);
const nameCategoria = ref(null);

onMounted(() => {
  idColaborador.value = $q.localStorage.getItem("CD_USUARIO");
  getListCategorias();
});

const getListCategorias = async () => {
  try {
    const { data } = await api.get("categoria-master/");
    listCategorias.value = Array.isArray(data) ? data : [];
  } catch (error) {
    notifyError(error.message);
  }
};

const abrirChamado = async (categoria) => {
  showPreviewDialog.value = true;
  categorias.value = await getCategorias(categoria.ID_CATEGORIA);
  nameCategoria.value = categoria.DS_CATEGORIA;
};

const getCategorias = async (id) => {
  try {
    const { data } = await api.get(`categoria-superior/${id}`);
    return data;
  } catch (error) {
    notifyError(error.message);
    return [];
  }
};

const handleCategotyChange = async (id) => {
  selectedSubCategory.value = null;
  subCategorias.value = await getCategorias(id);
};

const cleanDialog = () => {
  selectedCategory.value = null;
  selectedSubCategory.value = null;
  subCategorias.value = [];
  form.value.titulo = "";
  form.value.editor = "";
  files.value = [];
};

const onSubmit = async () => {
  try {
    // ✅ AGORA CORRETO COM BACKEND
    const chamado = {
      DS_TITULO: form.value.titulo,
      DS_CHAMADO: form.value.editor,
      ID_CATEGORIA: selectedSubCategory.value || selectedCategory.value,
      CD_USUARIOS_ABERTURA: idColaborador.value,
    };

    const { data } = await api.post("chamados", chamado);
    const ID_CHAMADO = data.ID_CHAMADO;

    if (files.value.length) {
      const formData = new FormData();
      formData.append("ID_CHAMADO", ID_CHAMADO);
      formData.append("CD_USUARIO", idColaborador.value);

      files.value.forEach((file) => {
        formData.append("files", file);
      });

      await api.post("anexos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    notifySuccess("Chamado criado com sucesso");
    cleanDialog();
    showPreviewDialog.value = false;
  } catch (error) {
    notifyError(error.response?.data || error.message);
  }
};
</script>
