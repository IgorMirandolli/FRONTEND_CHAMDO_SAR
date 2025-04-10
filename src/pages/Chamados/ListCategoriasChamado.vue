<template>
    <q-page padding >
      <div class="row justify-center">

      <q-table
        :rows="categorias"
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
                  :src="props.row.img_url"
                  :ratio="5/3"
                  @click="abrirChamado(props.row.id_categoria)"
                >
                  <div class="absolute-bottom text-subtitle2 text-center">
                    {{ props.row.ds_categoria }}
                  </div>
                </q-img>
              </q-card>
            </div>
          </div>
        </transition>
      </template>

    </q-table>

      </div>
      <br>

    </q-page>

</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import useNotify from 'src/composables/UseNotify'
import { columnsCategorias } from 'src/composables/UseTable'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const { notifyError } = useNotify()
const categorias = ref([])
const $q = useQuasar()
const router = useRouter()

onMounted(async () => {
  const validacao = {
    token: '111352535829370743381207707859',
    cd_colaborador: '15948'
    // token: route.query.dsTokenAppUsuario,
    // cd_colaborador: route.query.cdUsuario
  }
  try {    
    const response = await api.post('validateToken/', validacao)    
    if (response.data.msg === 'Não autorizado') {
      window.location = response.data.url
    } else {
      getCategorias()
      const { data } = await api.get('colaborador/'+ validacao.cd_colaborador )          
      $q.localStorage.set('cd_colaborador', data[0].cd_colaborador)
      $q.localStorage.set('cd_unorg', data[0].cd_unorg)
    }
  } catch (error) {
    console.log(error)
  }
})

const getCategorias = async (id) => {
  try {
    $q.loading.show()
    const { data } = await api.get('categoria-master/')
    categorias.value = data    
    $q.loading.hide()
  } catch (error) {
    notifyError(error.message)
    $q.loading.hide()
  }
}

const abrirChamado = (id) => {  
  router.push({ name: 'abrirChamado', params: { id: id } })
}

</script>
