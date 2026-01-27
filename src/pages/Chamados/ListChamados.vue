<template>
  <q-page padding>
    <h4 class="text-h6 text-primary text-center q-my-none">
      {{ $t("my_callings") }}
    </h4>

    <div class="q-pa-md">
      <q-card
        class="q-mx-auto q-mt-md"
        style="max-width: 1480px; border-radius: 20px"
      >
        <div
          class="shadow-7 row q-gutter-y-sm justify-center q-mt-md q-pa-sm rounded-borders bg-blue-grey-2"
          style="background-color: transparent; border-radius: 20px"
        >
          <q-table
            flat
            bordered
            :rows="chamadosFiltrados"
            :columns="columns"
            row-key="ID_CHAMADO"
            style="border-radius: 20px"
            :filter="filter"
            :rows-per-page-options="[5, 10, 15, 20, 25, 50, 0]"
          >
            <!-- Pesquisa -->
            <template v-slot:top-right>
              <q-input
                class="bg-blue-grey-2"
                rounded
                outlined
                dense
                color="amber-9"
                v-model="filter"
                placeholder="Pesquisar"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <!-- Filtros -->
            <template v-slot:top-left>
              <div class="q-gutter-sm">
                <q-checkbox
                  v-model="st_chamado_aberto"
                  label="Aberto"
                  color="cyan"
                />
                <q-checkbox
                  v-model="st_chamado_andamento"
                  label="Andamento"
                  color="orange"
                />
                <q-checkbox
                  v-model="st_chamado_finalizado"
                  label="Finalizado"
                  color="teal"
                />
                <q-checkbox
                  v-model="st_chamado_cancelado"
                  label="Cancelado"
                  color="red"
                />
              </div>
            </template>

            <!-- Cabeçalho -->
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
                <q-th auto-width>{{ $t("actions") }}</q-th>
              </q-tr>
            </template>

            <!-- Corpo -->
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td auto-width>
                  <q-btn
                    size="sm"
                    color="primary"
                    round
                    dense
                    icon="visibility"
                    @click="abrirChamado(props.row)"
                  />
                </q-td>

                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>

                <q-td auto-width>
                  <q-btn
                    v-if="props.row.ST_CHAMADO === 'A'"
                    icon="check_circle"
                    color="green"
                    dense
                    size="sm"
                    @click="aceitarChamado(props.row)"
                  >
                    <q-tooltip>Aceitar chamado</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-else
                    icon="edit"
                    color="blue-grey-5"
                    dense
                    size="sm"
                    @click="updatingRent(props.row)"
                  >
                    <q-tooltip>{{ $t("edit") }}</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import useNotify from "src/composables/UseNotify";
import { formatDt } from "src/util/format";
import { useRouter } from "vue-router";

const { t } = useI18n();
const { notifyError, notifySuccess } = useNotify();
const $q = useQuasar();
const router = useRouter();

const st_chamado_aberto = ref(true);
const st_chamado_andamento = ref(false);
const st_chamado_finalizado = ref(false);
const st_chamado_cancelado = ref(false);
const filter = ref("");

const idColaborador = ref(null);
const idSetor = ref(null);
const chamados = ref([]);

const chamadosFiltrados = computed(() => {
  const statusSelecionados = [];
  if (st_chamado_aberto.value) statusSelecionados.push("A");
  if (st_chamado_andamento.value) statusSelecionados.push("T");
  if (st_chamado_finalizado.value) statusSelecionados.push("F");
  if (st_chamado_cancelado.value) statusSelecionados.push("C");

  return chamados.value.filter((c) =>
    statusSelecionados.includes(c.ST_CHAMADO)
  );
});

onMounted(() => {
  idColaborador.value = $q.localStorage.getItem("CD_USUARIO");
  idSetor.value = $q.localStorage.getItem("ID_SETOR");
  getChamados();
});

const getChamados = async () => {
  try {
    if (!idColaborador.value) {
      notifyError("Usuário não identificado");
      return;
    }

    $q.loading.show();

    const { data } = await api.get(
      `/chamados/colaborador/${idColaborador.value}`
    );

    chamados.value = data;
  } catch (error) {
    notifyError(error.response?.data || error.message);
  } finally {
    $q.loading.hide();
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
    title: "Aceitar chamado",
    message: "Deseja assumir este chamado?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      $q.loading.show();
      await api.put(`chamados/${row.ID_CHAMADO}`, {
        ST_CHAMADO: "T",
        CD_USUARIOS_RESPONSAVEL: idColaborador.value,
      });
      notifySuccess("Chamado assumido com sucesso");
      getChamados();
    } finally {
      $q.loading.hide();
    }
  });
};

const columns = [
  {
    name: "chamado",
    label: "Nº",
    field: "ID_CHAMADO",
    align: "center",
  },
  {
    name: "abertura",
    label: "DT. Abertura",
    field: "DT_ABERTURA",
    format: formatDt,
  },
  {
    name: "categoria",
    label: "Categoria",
    field: "DS_CATEGORIA",
  },
  {
    name: "status",
    label: "Situação",
    field: "DS_STATUS",
  },
];

const updatingRent = (row) => {
  $q.dialog({
    title: "Alterar status",
    options: {
      type: "radio",
      model: row.ST_CHAMADO,
      items: [
        { label: "Andamento", value: "T" },
        { label: "Finalizado", value: "F" },
      ],
    },
    cancel: true,
    persistent: true,
  }).onOk(async (novoStatus) => {
    try {
      $q.loading.show();
      await api.put(`chamados/${row.ID_CHAMADO}`, {
        ST_CHAMADO: novoStatus,
      });
      notifySuccess("Status atualizado");
      getChamados();
    } finally {
      $q.loading.hide();
    }
  });
};
</script>
