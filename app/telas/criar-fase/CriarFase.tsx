import React, { useState } from "react";
import Dialog from "../../componente/dialog-error";
import { YStack, XStack, Text, Input, Button, Checkbox } from "tamagui";
import { API_BASE_URL } from "../../../utils/config";
import { Tela } from "../../componente/layout/tela";
import { apiPost } from "../../utils/api";
import { GenericPicker } from "../../componente/GenericPicker";
import { useLocalSearchParams } from "expo-router";
import { Check } from '@tamagui/lucide-icons'


type TipoFase = "CLASSIFICACAO" | "PLAYOFF";
type TipoSerie = "PRINCIPAL" | "OURO" | "PRATA" | "BRONZE";

export default function CriarFase() {
    const { torneioId, categoriaId } = useLocalSearchParams<{ torneioId: string; categoriaId: string }>();
    const [tipoFase, setTipoFase] = useState<TipoFase>("CLASSIFICACAO");
    const [serie, setSerie] = useState<TipoSerie>("PRINCIPAL");
    const [numeroClassificados, setNumeroClassificados] = useState("8");
    const [idaVolta, setIdaVolta] = useState(true);
    const [numeroChaves, setNumeroChaves] = useState("2");
    const [ordem, setOrdem] = useState("1");
    const [melhorDe, setMelhorDe] = useState(null);

    const [message, setMessage] = useState<string | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const [error, setError] = useState<boolean | null>(null)

    const tiposFaseOptions = [
        { value: "CLASSIFICACAO", nome: "Classificação" },
        { value: "PLAYOFF", nome: "Playoff" },
    ];

    const serieOptions = [
        { value: "PRINCIPAL", nome: "Principal" },
        { value: "OURO", nome: "Ouro" },
        { value: "PRATA", nome: "Prata" },
        { value: "BRONZE", nome: "Bronze" },
    ];

    const numeroChavesOptions = [
        { value: "1", nome: "1" },
        { value: "2", nome: "2" }
    ];

    if(tipoFase === "PLAYOFF") {
        numeroChavesOptions.push({ value: "4", nome: "4" })
        numeroChavesOptions.push({ value: "8", nome: "8" })
    }

    const melhorDeOptions = [
        { value: "1", nome: "Melhor de 1" },
        { value: "3", nome: "Melhor de 3" },
        { value: "5", nome: "Melhor de 5" },
    ];

    const handleCloseDialog = () => {
        setShowDialog(false)
        setMessage(null)
        setError(null)
    }

    const handleSubmit = async () => {
        const configuracaoEstruturaDTO = {
            tipoFase,
            serie,
            numeroClassificados: parseInt(numeroClassificados),
            idaVolta,
            numeroChaves: parseInt(numeroChaves),
            ordem: parseInt(ordem),
            melhorDe: parseInt(melhorDe),
        };

        try {
            await apiPost(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/fases/estrutura/manual`, configuracaoEstruturaDTO)
            setMessage(`Fase criada com sucesso!`)
            setShowDialog(true)
        } catch (error: any) {
            setError(true)
            setMessage(error.message || `Erro ao criar fase`)
            setShowDialog(true)
        }
    };

    return (
        <>
            <Tela title="Criar Fase">
                <YStack p="$4" space="$4">

                    {/* Tipo de Fase */}
                    <YStack space="$1">
                        <Text fontSize={14} color="$gray10">Tipo de Fase</Text>
                        <GenericPicker
                            items={(tiposFaseOptions)}
                            value={tipoFase}
                            onChange={setTipoFase}
                            getLabel={(f) => f.nome}
                            getValue={(f) => f.value}
                        />
                    </YStack>

                    {/* Série */}
                    <YStack space="$1">
                        <Text fontSize={14} color="$gray10">Série</Text>
                        <GenericPicker
                            items={(serieOptions)}
                            value={serie}
                            onChange={setSerie}
                            getLabel={(s) => s.nome}
                            getValue={(s) => s.value}
                        />
                    </YStack>

                    {/* Número de classificados */}
                    <XStack ai="center" space="$2">
                        <Text width={120}>Número de classificados:</Text>
                        <Input
                            value={numeroClassificados}
                            onChangeText={setNumeroClassificados}
                            keyboardType="numeric"
                        />
                    </XStack>

                    {/* Turno ou ida e volta */}
                    <YStack space="$2" mt="$3">
                        <Text>Ida e volta</Text>
                        <Checkbox
                            size="$5"
                            checked={idaVolta}
                            onCheckedChange={() => setIdaVolta(!idaVolta)} >


                            <Checkbox.Indicator>
                                <Check size={12} />
                            </Checkbox.Indicator>
                        </Checkbox>

                    </YStack>

                    {/* Número de chaves */}
                    <YStack space="$1">
                        <Text fontSize={14} color="$gray10">Número de chaves</Text>
                        <GenericPicker
                            items={(numeroChavesOptions)}
                            value={numeroChaves}
                            onChange={setNumeroChaves}
                            getLabel={(n) => n.nome}
                            getValue={(n) => n.value}
                        />
                    </YStack>

                    {/* Ordem da fase */}
                    <XStack ai="center" space="$2">
                        <Text width={120}>Ordem:</Text>
                        <Input value={ordem} onChangeText={setOrdem} keyboardType="numeric" />
                    </XStack>

                    {/* Melhor de (somente para playoffs) */}
                    {tipoFase === "PLAYOFF" && (
                    <YStack space="$1">
                        <Text fontSize={14} color="$gray10">Melhor de:</Text>
                        <GenericPicker
                            items={(melhorDeOptions)}
                            value={melhorDe}
                            onChange={setMelhorDe}
                            getLabel={(n) => n.nome}
                            getValue={(n) => n.value}
                        />
                    </YStack>
                    )}

                    {/* Botão enviar */}
                    <Button onPress={handleSubmit}>Criar Fase</Button>
                </YStack>
            </Tela>
            <Dialog
                open={showDialog}
                onClose={handleCloseDialog}
                message={message}
                type={error ? 'error' : 'success'}
            />
        </>
    );
}