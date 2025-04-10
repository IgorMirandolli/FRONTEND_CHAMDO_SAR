<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import moment from 'moment'

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const dataAtual = moment(Date.now()).format('DD/MM/YYYY')
    const linksList = [
      {
        title: 'Situação de Chamados',
        caption: '',
        icon: 'task',
        routeName: 'situacaoChamado'
      },
      {
        title: 'Gerenciar fila',
        caption: '',
        icon: 'manage_accounts',
        routeName: 'gerenciarFila'
      },
      {
        title: 'Priorizar Chamados',
        caption: '',
        icon: 'upload',
        routeName: 'priorizarChamado'
      },
      {
        title: 'Relatórios',
        caption: '',
        icon: 'file_copy',
        routeName: 'relatorios'
      },
      {
        title: 'Gerenciar Categorias',
        caption: '',
        icon: 'file_copy',
        routeName: 'categorias'
      }
    ]
    return {
      essentialLinks: linksList,
      dataAtual,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
