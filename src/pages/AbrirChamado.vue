<template>
  <q-page class="container">

        <div class="q-pa-md row items-start q-gutter-md">
          <q-card class="my-card">
            <q-img style="cursor: pointer;" @click="escolha('equip')" src="../assets/images/equipamentos_softwares.png">
              <div class="absolute-bottom">
                <div class="text-h6">Equipamentos/Softwares</div>
              </div>
            </q-img>
          </q-card>
          <q-card class="my-card">
            <q-img style="cursor: pointer;" @click="escolha('infra')" src="../assets/images/infra_redes.png">
              <div class="absolute-bottom">
                <div class="text-h6">Infraestretura/Redes</div>
              </div>
            </q-img>
          </q-card>
          <q-card class="my-card">
            <q-img style="cursor: pointer;" @click="escolha('sistemas')" src="../assets/images/sistemas.png">
              <div class="absolute-bottom">
                <div class="text-h6">Sistemas</div>
              </div>
            </q-img>
          </q-card>
          <q-card class="my-card">
            <q-img style="cursor: pointer;" @click="escolha('gerais')"  src="../assets/images/serviços_gerais.png">
              <div class="absolute-bottom">
                <div class="text-h6">Serviços Gerais</div>
              </div>
            </q-img>
          </q-card>
        </div>

        <q-form action="https://some-url.com" method="post" @submit.prevent="onSubmit">

          <div class="q-pa-md doc-container">

            <div class="row q-pb-sm">
              <div class="col-3">
                <q-card class="my-card_1 text-white"
                  style=" text-align: center; background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
                  <q-card-section>
                    <div class="text-h6">{{ abertura }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3">
                <q-input standout="bg-blue text-white" autogrow label="Pra quem é o chamado?"/>
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3">
                <q-select standout="bg-blue  text-white" transition-show="flip-up" transition-hide="flip-down"
                filled @update:model-value="escolha('subcategoria')" v-model="idCategorias" :options="supCategorias" :label="categoria" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3">
                <q-select standout="bg-blue text-white" v-model="idSubCategorias" :options="subCategorias" label="Sub-Categoria" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3">
                <!-- <q-input standout="bg-blue text-white" autogrow label="Descrição do chamado"/> -->
                <q-editor v-model="editor" min-height="5rem" />

              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3">
                <q-file
                  v-model="files"
                  label="Anexos"
                  outlined
                  use-chips
                  multiple
                  append
                />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3">
                <div>
                  <q-btn label="Submit" type="submit" color="primary"/>
                  <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
              </div>
            </div>

          </div>
        </q-form>

  </q-page>

</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import categoriasService from 'src/services/categorias'

export default defineComponent({
  name: 'IndexPage',
  // components: { Abertura },

  setup () {
    const { list } = categoriasService()
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

    const escolha = (escolha) => {
      if (escolha === 'sistemas') {
        abertura.value = 'Sistemas'
        categoria.value = 'Selecione o Sistema'
        // supCategorias = categorias.filter(superior => categorias.id_categoria_superior = null)
      } else if (escolha === 'equip') {
        abertura.value = 'Equipamentos/Softwares'
        categoria.value = 'Selecione o Equip/Soft'
      } else if (escolha === 'infra') {
        abertura.value = 'Infraestrutura/Redes'
        categoria.value = 'Selecione uma opção'
      } else if (escolha === 'gerais') {
        abertura.value = 'Serviços Gerais'
        categoria.value = 'Selecione uma opção'
      } else if (escolha === 'subcategoria') { /* empty */ }
    }
    return {
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

</style>
