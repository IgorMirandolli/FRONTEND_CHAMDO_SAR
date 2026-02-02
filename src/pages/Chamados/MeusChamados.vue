<template>
  <q-page padding class="bg-grey-1">
    <!-- TÍTULO -->
    <div class="text-center q-mb-lg">
      <div class="text-h5 text-primary">Chamados</div>
    </div>

    <q-card
      class="q-mx-auto q-pa-md"
      style="max-width: 1200px; border-radius: 18px"
    >
      <!-- STATUS + BUSCA -->
      <div class="row items-center q-mb-md">
        <q-tabs
          v-model="filtroStatus"
          dense
          active-color="primary"
          indicator-color="primary"
          class="text-grey"
        >
          <q-tab name="A" label="Abertos" />
          <q-tab name="T" label="Em andamento" />
          <q-tab name="F" label="Finalizados" />
        </q-tabs>

        <q-space />

        <q-input
          v-model="filter"
          dense
          outlined
          debounce="300"
          placeholder="Pesquisar chamado"
          style="max-width: 250px"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- TABELA -->
      <q-table
        :rows="chamadosFiltrados"
        :columns="columns"
        row-key="ID_CHAMADO"
        flat
        bordered
        hide-pagination
        :rows-per-page-options="[0]"
        no-data-label="Nenhum chamado encontrado"
        :filter="filter"
      >
        <!-- STATUS -->
        <template #body-cell-DS_STATUS="props">
          <q-td align="center">
            <q-chip
              v-if="props.row.ST_CHAMADO === 'A'"
              dense
              color="primary"
              text-color="white"
            >
              {{ props.row.DS_STATUS || "Aberto" }}
            </q-chip>

            <q-chip
              v-else-if="props.row.ST_CHAMADO === 'T'"
              dense
              color="orange"
              text-color="white"
            >
              {{ props.row.DS_STATUS || "Em andamento" }}
            </q-chip>

            <q-chip
              v-else-if="props.row.ST_CHAMADO === 'F'"
              dense
              color="green"
              text-color="white"
            >
              {{ props.row.DS_STATUS || "Finalizado" }}
            </q-chip>

            <q-chip v-else dense color="red" text-color="white">
              {{ props.row.DS_STATUS || "Cancelado" }}
            </q-chip>
          </q-td>
        </template>

        <!-- AÇÕES -->
        <template #body-cell-actions="props">
          <q-td align="right" class="q-gutter-xs">
            <q-btn
              icon="visibility"
              color="primary"
              round
              dense
              flat
              @click="abrirChamado(props.row)"
            >
              <q-tooltip>Visualizar chamado</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <!-- RODAPÉ -->
      <div class="row justify-end text-caption text-grey q-mt-sm">
        Total de chamados: <b>{{ chamadosFiltrados.length }}</b>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { formatDt } from "src/util/format";
import useNotify from "src/composables/UseNotify";

const { notifyError, notifySuccess } = useNotify();
const $q = useQuasar();
const router = useRouter();

const filtroStatus = ref("A");
const filter = ref("");
const chamados = ref([]);
const idColaborador = ref(null);

onMounted(() => {
  idColaborador.value = $q.localStorage.getItem("CD_USUARIO");
  getChamados();
});

const chamadosFiltrados = computed(() => {
  if (!idColaborador.value) return [];

  return chamados.value.filter(
    (c) =>
      c.ST_CHAMADO === filtroStatus.value &&
      c.CD_USUARIOS_ABERTURA === idColaborador.value,
  );
});

const getChamados = async () => {
  try {
    const { data } = await api.get(
      `/chamados/colaborador/${idColaborador.value}`,
    );
    chamados.value = data;
  } catch {
    notifyError("Erro ao carregar chamados");
  }
};

const abrirChamado = (row) => {
  router.push({
    name: "detalheChamado",
    params: { id: row.ID_CHAMADO },
  });
};

const aceitarChamado = (row) => {
  $q.dialog({
    title: "Assumir chamado",
    message: "Deseja assumir este chamado?",
    cancel: true,
    persistent: true,
    ok: { label: "Assumir", color: "primary" },
    cancel: { label: "Cancelar", color: "grey" },
  }).onOk(async () => {
    await api.put(`chamados/${row.ID_CHAMADO}`, {
      ST_CHAMADO: "T",
      CD_USUARIOS_RESPONSAVEL: idColaborador.value,
    });
    notifySuccess("Chamado assumido com sucesso");
    getChamados();
  });
};

const updatingRent = (row) => {
  $q.dialog({
    title: "Finalizar chamado",
    message: "Deseja finalizar este chamado?",
    cancel: true,
    persistent: true,
    ok: { label: "Finalizar", color: "primary" },
    cancel: { label: "Cancelar", color: "grey" },
  }).onOk(async () => {
    await api.put(`chamados/${row.ID_CHAMADO}`, {
      ST_CHAMADO: "F",
    });
    notifySuccess("Chamado finalizado com sucesso");
    getChamados();
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case "A":
      return "primary";
    case "T":
      return "orange";
    case "F":
      return "green";
    case "C":
      return "red";
    default:
      return "grey";
  }
};

const columns = [
  {
    name: "ID_CHAMADO",
    label: "Nº",
    field: "ID_CHAMADO",
    align: "left",
  },
  {
    name: "DT_ABERTURA",
    label: "Abertura",
    field: "DT_ABERTURA",
    format: (val) => formatDt(val),
  },
  {
    name: "DS_TITULO",
    label: "Título",
    field: "DS_TITULO",
    align: "left",
  },
  {
    name: "DS_STATUS",
    label: "Status",
    field: "DS_STATUS",
    align: "center",
  },
  {
    name: "actions",
    label: "Ações",
    align: "right",
  },
];
</script>
