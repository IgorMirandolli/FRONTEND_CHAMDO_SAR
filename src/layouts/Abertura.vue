<template>
  <q-page class="container">

        <q-form action="https://some-url.com" method="post" @submit.prevent="onSubmit">
          <div class="q-pa-md doc-container">
            <div class="row q-pb-sm titulo">
              <div class="col-3">
                <div>Abrindo chamados para {{ tipoChamado }}</div>
              </div>
            </div>
            <div class="row q-pb-sm">
              <div class="col-3">
                <q-input standout="bg-blue text-white" v-model="text" autogrow label="Pra quem é o chamado?"/>
              </div>
            </div>
            <div class="row q-pb-sm">
              <div class="col-3">
                <q-select standout="bg-blue text-white" v-model="model" :options="options" label="Selecione o Sistema" />
              </div>
            </div>
            <div class="row q-pb-sm">
              <div class="col-3">
                <q-select standout="bg-blue text-white" v-model="model" :options="options" label="Módulo" />
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

export default defineComponent({
  name: 'IndexPage',
  setup () {
    return {
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],
      model: ref(null),
      files: ref(null)

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
