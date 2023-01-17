<template>
  <q-page class="container">

        <div class="q-pa-md row items-start q-gutter-md">

          <q-card class="my-card">
            <q-img src="../assets/images/equipamentos_softwares.png">
              <div class="absolute-bottom">
                <div class="text-h6">Equipamentos/Softwares</div>
              </div>
            </q-img>
          </q-card>

          <q-card class="my-card">
            <q-img src="../assets/images/infra_redes.png">
              <div class="absolute-bottom">
                <div class="text-h6">Infraestretura/Redes</div>
              </div>
            </q-img>
          </q-card>
          <q-card class="my-card">
            <q-img src="../assets/images/sistemas.png">
              <div class="absolute-bottom">
                <div class="text-h6">Sistemas</div>
              </div>
            </q-img>
          </q-card>
          <q-card class="my-card">
            <q-img src="../assets/images/serviços_gerais.png">
              <div class="absolute-bottom">
                <div class="text-h6">Serviçoes Gerais</div>
              </div>
            </q-img>
          </q-card>
        </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  setup () {

  }
})
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 300px
</style>
