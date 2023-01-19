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

        <div v-if="sistemas">
          <Sistemas />
        </div>

  </q-page>

</template>

<script>
import { defineComponent, ref } from 'vue'
import Sistemas from 'layouts/Sistemas.vue'

export default defineComponent({
  name: 'IndexPage',
  components: { Sistemas },
  setup () {
    return {
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],
      model: ref(null),
      files: ref(null),
      sistemas: ref(false),
      escolha (escolha) {
        if (escolha === 'sistemas') {
          this.sistemas = true
        } else if (escolha === 'equip') {
          this.sistemas = false
        } else if (escolha === 'infra') {
          this.sistemas = false
        } else if (escolha === 'gerais') {
          this.sistemas = false
        }
      }
    }
  }
})
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 260px
</style>
