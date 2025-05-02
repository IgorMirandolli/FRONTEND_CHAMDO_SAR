<template>
  <q-page padding>

    <h4 class="text-h6 text-primary text-center q-my-none">{{ $t('my_callings') }}</h4>


    <div class="q-pa-md">
      
      <q-card class="q-mx-auto q-mt-md" style="max-width: 1480px; border-radius: 20px">
        
        <div class="shadow-7 row q-gutter-y-sm justify-center q-mt-md q-pa-sm rounded-borders bg-blue-grey-2" 
             style="background-color: transparent; border-radius: 20px">

             <q-table
              flat bordered
              title="Treats"
              :rows="chamadosFiltrados"
              :columns="columns"
              row-key="ID_CHAMADO"
              style="border-radius: 20px"
              :filter="filter"
              :rows-per-page-options="[ 5, 10, 15, 20, 25, 50, 0 ]"
            >           

              <template v-slot:top-right>
                <q-input 
                  style="border-radius: 20px"
                  class="bg-blue-grey-2"
                  rounded outlined dense
                  color="amber-9" v-model="filter" placeholder="Pesquisar">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:top-left>                
                <div class="q-gutter-sm">
                  <q-checkbox v-model="st_chamado_aberto" label="Aberto" color="cyan" />
                  <q-checkbox v-model="st_chamado_andamento" label="Andamento" color="orange" />
                  <q-checkbox v-model="st_chamado_finalizado" label="Finalizado" color="teal" />
                  <q-checkbox v-model="st_chamado_cancelado" label="Cancelado" color="red" />
                </div>                
              </template>

              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th auto-width />
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" >
                    {{ col.label }}
                  </q-th>
                  <q-th auto-width>{{ $t('actions')}}</q-th>
                </q-tr>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width>
                    <q-btn size="sm" color="light-blue-10" round dense @click="locacoes(props.row.id)" :icon="props.expand ? 'remove' : 'add'" />
                  </q-td>
                  <q-td v-for="col in props.cols" :key="col.name" :props="props" >
                    {{ col.value }}
                  </q-td>

                  <q-td auto-width>
                    <q-btn class="q-mr-xs" icon="edit" color="blue-grey-5" dense size="sm" @click="updatingRent(props.row)">
                      <q-tooltip anchor="bottom middle" self="top middle">{{ $t('edit') }}</q-tooltip>
                    </q-btn>

                    <q-btn icon="delete" color="red-7" dense size="sm" @click="deleteRent(props.row)">
                        <q-tooltip anchor="bottom middle" self="top middle">{{$t('delete')}}</q-tooltip>
                      </q-btn>

                  </q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                  <q-td colspan="100%">
                    <q-table
                      :rows="locations"
                      :columns="columnsLocation"
                      row-key="id"
                      class="my-sticky-header-table"
                      rows-per-page-label=" "
                      :rows-per-page-options="[15, 25, 30]"
                      :pagination="{}"
                      style="background-color: transparent;"
                    >

                      <template v-slot:body="props">
                        <q-tr :props="props">
                          <q-td v-for="col in props.cols" :key="col.name" :props="props" >
                            {{ col.value }}
                          </q-td>
                        </q-tr>
                      </template>

                    </q-table>
                  </q-td>
                </q-tr>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-sm">
                  <q-btn class="q-mr-xs" icon="edit" color="blue-grey-5" dense size="sm">
                    <q-tooltip anchor="bottom middle" self="top middle">{{ $t('edit') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="delete" color="red-7" dense size="sm" >
                    <q-tooltip anchor="bottom middle" self="top middle">{{$t('delete')}}</q-tooltip>
                  </q-btn>
                </q-td>                
              </template>

            </q-table>
        
        </div>
             
      </q-card>

    </div>  

  </q-page>
</template>

<script setup>
import { onMounted, ref, computed  } from 'vue'
import { useI18n} from 'vue-i18n'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import useNotify from 'src/composables/UseNotify'
import { formatDt } from 'src/util/format'

const st_chamado_aberto = ref(false)
const st_chamado_andamento = ref(true)
const st_chamado_finalizado= ref(false)
const st_chamado_cancelado = ref(false)
const filter =  ref('')
const { notifyError } = useNotify()
const $q = useQuasar()
const idColaborador = ref(null)
const chamados = ref([{}]) 
const { t } = useI18n()

const chamadosFiltrados = computed(() => {
  const statusSelecionados = []
  if (st_chamado_aberto.value) statusSelecionados.push('A')
  if (st_chamado_andamento.value) statusSelecionados.push('T')
  if (st_chamado_finalizado.value) statusSelecionados.push('F')
  if (st_chamado_cancelado.value) statusSelecionados.push('C')

  return chamados.value.filter(c => statusSelecionados.includes(c.ST_CHAMADO))
})

onMounted(async() => {  
  idColaborador.value = $q.localStorage.getItem('cd_colaborador')  
  getChamados()      
})

const getChamados = async () => {
  try {    
    $q.loading.show()
    const {data } = await api.get('chamados-responsavel/'+idColaborador.value)        
    chamados.value = data    
    $q.loading.hide()
  } catch (error) {
    notifyError(error.message)
    $q.loading.hide()
  }
}

const columns = [
  { name: 'chamado', align: 'center', label: 'Nº', field: 'ID_CHAMADO', sortable: true },
  { name: 'abertura', required: true, label: 'DT. Abertura', align: 'left', field: 'DT_ABERTURA',format: (val) => formatDt(val), sortable: true },  
  { name: 'encerramento', required: true, label: 'DT. Término', align: 'left', field: 'DT_TERMINO',format: (val) => formatDt(val), sortable: true },  
  { name: 'categoria', align: 'left', label: 'Categoria', field: 'DS_CATEGORIA', sortable: true },
  { name: 'status', align: 'left', label: 'Situação', field: 'DS_STATUS', sortable: true },
  // { name: 'actions', align: 'right', label: t('actions'), field: 'actions', sortable: false, style: "font-size: smaller" }
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',    calories: 452,    fat: 25.0,    carbs: 51,    protein: 4.9,    sodium: 326,    calcium: '2%',    iron: '22%'  },
  {
    name: 'KitKat',    calories: 518,    fat: 26.0,    carbs: 65,    protein: 7,    sodium: 54,    calcium: '12%',    iron: '6%'  }
]


</script>
