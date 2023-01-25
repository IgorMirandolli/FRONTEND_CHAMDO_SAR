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
                filled v-model="idCategorias" :options="categorias" :label="categoria" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3">
                <q-select standout="bg-blue text-white" v-model="idSubCategorias" :options="subCategorias" label="Sub-Categoria" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3">
                <q-input standout="bg-blue text-white" autogrow label="Descrição do chamado"/>
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
import { defineComponent, ref } from 'vue'
import { api } from 'src/boot/axios'
// import Abertura from 'src/layouts/Abertura.vue'

export default defineComponent({
  name: 'IndexPage',
  // components: { Abertura },

  // data () {
  //   return {
  //     idCategorias: ref(null)
  //   }
  // },

  watch: {
    idCategorias (idCategorias) {
      console.log(idCategorias.value)
    }
  },

  setup () {
    const files = null
    const model = null
    const categoria = ref('Selecione a categoria')
    const idCategorias = ref(null)
    const categorias = ref([])

    const subCategorias = ref([])
    const abertura = ref('Abrindo chamado para:')

    const getCategoria = async (opcao) => {
      try {
        const { data } = await api.get('categorias/superior/' + opcao)
        categorias.value = data.map(e => {
          return {
            value: e.id_categoria,
            label: e.ds_categoria
          }
        })
      } catch (e) {
        console.error(e)
      }
    }

    const escolha = (escolha) => {
      if (escolha === 'sistemas') {
        abertura.value = 'Sistemas'
        categoria.value = 'Selecione o Sistema'
        getCategoria(1)
      } else if (escolha === 'equip') {
        abertura.value = 'Equipamentos/Softwares'
        categoria.value = 'Selecione o Equip/Soft'
      } else if (escolha === 'infra') {
        abertura.value = 'Infraestrutura/Redes'
        categoria.value = 'Selecione uma opção'
      } else if (escolha === 'gerais') {
        abertura.value = 'Serviços Gerais'
        categoria.value = 'Selecione uma opção'
      }
    }
    return {
      categoria, categorias, abertura, escolha, subCategorias, files, model, idCategorias
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
