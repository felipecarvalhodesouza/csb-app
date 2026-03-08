import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { YStack, XStack, Text, Input, Button, Separator, Theme } from "tamagui";
import { ChevronLeft, Save } from "@tamagui/lucide-icons";
import { Tela } from "../../componente/layout/tela";
import { API_BASE_URL } from "../../../utils/config";
import Parcial from "../../domain/parcial";
import { apiFetch, apiPut } from "../../utils/api";
import Dialog from "../../componente/dialog-error";

export default function EditarParciais() {
  const { jogoId } = useLocalSearchParams<{ jogoId: string }>();
  const [parciais, setParciais] = useState<ParcialTela[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [error, setError] = useState<boolean | null>(null)

  type ParcialTela = Parcial & { naoExiste?: boolean; salvando?: boolean };

  const handleCloseDialog = () => {
    setShowDialog(false)
    setMessage(null)
    setError(null)
  }

  useEffect(() => {
    if (jogoId) carregarParciais();
  }, [jogoId]);

  async function carregarParciais() {
    setLoading(true);
    try {
      const data = await apiFetch<ParcialTela[]>(`${API_BASE_URL}/jogos/${jogoId}/parciais`);

      const lista: ParcialTela[] = [];
      for (let i = 1; i <= Math.max(4, data.length); i++) {
        const parcial = data.find(p => (p.periodo - 1) === i);
        if (parcial) lista.push(parcial);
        else
          lista.push({
            id: "",
            periodo: i,
            placarMandante: 0,
            placarVisitante: 0,
            faltasMandante: 0,
            faltasVisitante: 0,
            naoExiste: true,
          });
      }
      setParciais(lista);
    } catch(error: any) {
      setError(true)
      setMessage(error.message || 'Erro ao carregar parciais.')
      setShowDialog(true)
    } finally {
      setLoading(false);
    }
  }

  function atualizar(
    index: number,
    campo: "placarMandante" | "placarVisitante",
    valor: string | number
  ) {
    const num = typeof valor === "string" ? parseInt(valor, 10) : valor;
    if (isNaN(num) || num < 0) return;

    const copia = [...parciais];
    copia[index][campo] = num;
    setParciais(copia);
  }

  async function salvarParcial(index: number) {
    const parcial = parciais[index];
    if (!parcial.id) return;

    const copia = [...parciais];
    copia[index].salvando = true;
    setParciais(copia);

    try {
      await apiPut(`${API_BASE_URL}/jogos/${jogoId}/parciais`, {
        id: parcial.id,
        placarMandante: parcial.placarMandante,
        placarVisitante: parcial.placarVisitante,
      });


      setMessage(`Parcial ${parcial.periodo} salva com sucesso!`)
      setShowDialog(true)
    } catch(error: any) {
      setError(true)
      setMessage(error.message || `Erro ao salvar parcial ${parcial.periodo}`)
      setShowDialog(true)
    } finally {
      copia[index].salvando = false;
      setParciais(copia);
    }
  }

  const totalMandante = parciais.reduce((s, p) => s + (p.placarMandante || 0), 0);
  const totalVisitante = parciais.reduce((s, p) => s + (p.placarVisitante || 0), 0);

  const voltar = <Button icon={ChevronLeft} chromeless onPress={() => router.back()} />;

  return (
    <Tela title="Editar Parciais" button={voltar}>
            {loading ? (
              <Text color="$gray10" fontSize={16} ta="center" mt={50}>
                Carregando...
              </Text>
            ) : (
              <>
                {parciais.map((p, i) => (
                  <XStack
                    key={i}
                    ai="center"
                    jc="space-between"
                    mb="$2"
                    p="$3"
                    br="$3"
                    bg={p.naoExiste ? "$gray4" : "$backgroundStrong"}
                  >
                    <Text fontWeight="700" color={p.naoExiste ? "$gray10" : "$white"}>
                      {p.periodo}º Período
                    </Text>

                    {!p.naoExiste ? (
                      <XStack space="$2" ai="center">
                        <Input
                          width={60}
                          value={String(p.placarMandante)}
                          keyboardType="numeric"
                          onChangeText={(v) => atualizar(i, "placarMandante", Number(v))}
                          color="$white"
                          backgroundColor="$backgroundStrong"
                          textAlign="center"
                        />
                        <Text color="$white" fontWeight="700">
                          x
                        </Text>
                        <Input
                          width={60}
                          value={String(p.placarVisitante)}
                          keyboardType="numeric"
                          onChangeText={(v) => atualizar(i, "placarVisitante", Number(v))}
                          color="$white"
                          backgroundColor="$backgroundStrong"
                          textAlign="center"
                        />

                        <Button
                          icon={Save}
                          chromeless
                          onPress={() => salvarParcial(i)}
                          disabled={p.salvando}
                        />
                      </XStack>
                    ) : (
                      <Text color="$gray10" fontStyle="italic">
                        Ainda não finalizado
                      </Text>
                    )}
                  </XStack>
                ))}

                <XStack ai="center" jc="center" mt="$4">
                  <Text fontWeight="700" fontSize={18} mr="$2" color="$white">
                    Total
                  </Text>
                  <Text fontWeight="700" fontSize={24} mr="$1" color="$white">
                    {totalMandante}
                  </Text>
                  <Text fontWeight="700" fontSize={18} color="$white">
                    x
                  </Text>
                  <Text fontWeight="700" fontSize={24} ml="$1" color="$white">
                    {totalVisitante}
                  </Text>
                </XStack>
              </>
            )}
          <Dialog
            open={showDialog}
            onClose={handleCloseDialog}
            message={message}
            type={error ? 'error' : 'success'}
            />
    </Tela>
  );
}