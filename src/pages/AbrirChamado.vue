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
                <q-input standout="bg-blue text-white" v-model="text" autogrow label="Pra quem é o chamado?"/>
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3">
                <q-select standout="bg-blue text-white" v-model="model" :options="options" :label="categoria" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3">
                <q-select standout="bg-blue text-white" v-model="model" :options="options" label="Sub-Categoria" />
              </div>
            </div>

            <div class="row q-pb-sm">
              <div class="col-3">
                <q-input standout="bg-blue text-white" v-model="text" autogrow label="Descrição do chamado"/>
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
  data () {
    return {
      abertura: ref('Abrindo chamado para:'),
      categoria: ref('Selecione a categoria'),
      options: ref(null),
      model: ref(null),
      files: ref(null)
    }
  },

  watch: {
  },

  methods: {
    getCategoria: async (opcao) => {
      try {
        const { data } = await api.get('/categorias/superior/' + opcao)
        this.options.value = data
        // data.forEach(e => {
        //   console.log(data)
        //   this.options.value.push(e.ds_categoria)
        // })
      } catch (e) {
        console.error(e)
      }
    },
    escolha (escolha) {
      if (escolha === 'sistemas') {
        this.abertura = 'Sistemas'
        this.categoria = 'Selecione o Sistema'
        this.getCategoria(1)
      } else if (escolha === 'equip') {
        this.abertura = 'Equipamentos/Softwares'
        this.categoria = 'Selecione o Equip/Soft'
      } else if (escolha === 'infra') {
        this.abertura = 'Infraestrutura/Redes'
        this.categoria = 'Selecione uma opção'
      } else if (escolha === 'gerais') {
        this.abertura = 'Serviços Gerais'
        this.categoria = 'Selecione uma opção'
      }
      // console.log(this.abertura)
    }

  },

  setup () {
    return {
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
