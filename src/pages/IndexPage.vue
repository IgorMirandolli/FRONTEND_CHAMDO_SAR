<template>
  <div>
    <apexchart width="80%" type="bar" :options="options" :series="series"></apexchart>
</div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
// import VueApexCharts from 'vue3-apexcharts'
import moment from 'moment'
import { api } from 'src/boot/axios'

export default defineComponent({
  name: 'IndexPage',
  // components: { apexchart: VueApexCharts },

  setup () {
    const abertos = ref([])
    const finalizados = ref([])
    const atendimentos = ref([])
    const reabertos = ref([])
    const datas = ref([])

    onMounted(() => {
      getStats()
    })

    const getStats = async () => {
      try {
        const { data } = await api.get('stats')

        data.forEach(e => {
          abertos.value.push(e.nr_chamados_abertos)
          finalizados.value.push(e.nr_chamados_finalizados)
          atendimentos.value.push(e.nr_chamados_atendimentos)
          reabertos.value.push(e.nr_chamados_reabertos)
          datas.value.push(moment(e.dt_atualizacao).format('DD/MM/YYYY'))
        })//
      } catch (e) {
        console.error(e)
      }
    }

    const options = {
      chart: {
        id: 'vuechart-example'
      },
      xaxis: {
        categories: datas.value
      }
    }

    const series = [
      {
        name: 'Chamados abertos',
        data: abertos.value
      },
      {
        name: 'Chamados Finalizados',
        data: finalizados.value
      },
      {
        name: 'Chamados Reabetos',
        data: reabertos.value
      },
      {
        name: 'Chamados em Atendimento',
        data: atendimentos.value
      }
    ]
    return {
      options, series
    }
  }
})
</script>
