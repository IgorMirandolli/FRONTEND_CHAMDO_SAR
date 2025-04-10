<template>
  <q-page padding>

    <h4 class="text-h6 text-white text-center q-my-none">Abrir Chamado</h4>

    <q-card class="q-mx-auto q-mt-md bg-blue-grey-2" style="max-width: 900px; border-radius: 20px"> 
      <div class="container q-mx-auto q-mt-md" style="max-width: 600px;">
        
        <q-form @submit.prevent="onSubmit">
          <div class="q-mx-auto q-pa-md q-gutter-y-sm ">          
            <q-input
              class="q-pb-md"
              rounded outlined
              dense
              color="amber-9"
              v-model="form.name"
              label="Colaborador"
              type="text"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-account-outline" />
              </template>
            </q-input>              

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
    
    <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">??????????:</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          ????????????????
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Não" color="primary" v-close-popup :to="{ name: 'properties'}"/>
          <q-btn flat label="Sim" v-close-popup @click="rent()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    

  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import useNotify from 'src/composables/UseNotify'
// import { columnsCategorias } from 'src/composables/UseTable'
// import { api } from 'boot/axios'

const { notifyError } = useNotify()
const categorias = ref([])
const $q = useQuasar()
const form = ref({})

onMounted(() => {
  getCategorias()
})

const getCategorias = async (id) => {
  try {
    $q.loading.show()
    // const { data } = await api.get('categoria-master/')
    // categorias.value = data
    console.log(categorias.value)
    $q.loading.hide()
  } catch (error) {
    notifyError(error.message)
    $q.loading.hide()
  }
}

</script>
