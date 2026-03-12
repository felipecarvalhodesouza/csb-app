import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { YStack, XStack, Text, Spinner, Button, Card, Separator, View, ScrollView } from 'tamagui';
import { GenericPicker } from '../../componente/GenericPicker';
import { API_BASE_URL } from '../../../utils/config';
import { Tela } from '../../componente/layout/tela';
import { apiFetch, apiPost } from '../../utils/api';
import Fase from '../../domain/fase';

interface Chave {
    id: number;
    nome: string;
}
interface Equipe {
    id: number;
    nome: string;
}

export default function VincularEquipesScreen() {
    const { torneioId, categoriaId, faseId } = useLocalSearchParams<{ torneioId: string, categoriaId: string, faseId: string }>();
    const router = useRouter();
    const [chaves, setChaves] = useState<Chave[]>([]);
    const [equipes, setEquipes] = useState<Equipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [vinculos, setVinculos] = useState<Record<number, number[]>>({}); // chaveId -> equipeIds
    const [selectedEquipe, setSelectedEquipe] = useState<Record<number, number | null>>({}); // equipeId -> chaveId
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const fase = await apiFetch<Fase>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/fases/${faseId}`);
                const equipesData = await apiFetch<Equipe[]>(`${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/equipes`);
                setChaves(fase.chaves || []);
                setEquipes(equipesData);
                // Inicializa vinculos
                const initialVinculos: Record<number, number[]> = {};
                (fase.chaves || []).forEach(chave => { initialVinculos[chave.id] = []; });
                setVinculos(initialVinculos);
                // Inicializa seleção
                const initialSelected: Record<number, number | null> = {};
                equipesData.forEach(eq => { initialSelected[eq.id] = null; });
                setSelectedEquipe(initialSelected);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if (faseId && categoriaId && torneioId) fetchData();
    }, [faseId, categoriaId, torneioId]);

    // Handler para selecionar chave para equipe
    const handleSelectChave = (equipeId: number, chaveId: number) => {
        // Remove equipe de todas as chaves
        const newVinculos: Record<number, number[]> = { ...vinculos };
        Object.keys(newVinculos).forEach(cid => {
            newVinculos[Number(cid)] = newVinculos[Number(cid)].filter(eid => eid !== equipeId);
        });
        // Adiciona equipe à nova chave
        newVinculos[chaveId] = [...newVinculos[chaveId], equipeId];
        setVinculos(newVinculos);
        setSelectedEquipe({ ...selectedEquipe, [equipeId]: chaveId });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = chaves.map(chave => ({
                chaveId: chave.id,
                equipeIds: vinculos[chave.id] || []
            }));
            await apiPost(`${API_BASE_URL}/chaves/vincular-equipes`, payload);
            router.back();
        } catch (error) {
            alert('Erro ao vincular equipes');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Tela title="Vincular Equipes às Chaves" >
            {loading ? (
                <YStack f={1} jc="center" ai="center">
                    <Spinner size="large" color="$gray10" />
                </YStack>
            ) : (

                <YStack f={1} bg="$background" pt="$6" pb="$3" jc="space-between">
                    <Text fontSize={16} fontWeight="700" color="$gray12" mb="$2">Equipes disponíveis</Text>
                    {equipes.map(equipe => (
                        <Card key={equipe.id} bg="$gray2" br="$6" p="$3"  fd="column" mb="$2">
                            <Text fontSize={15} color="$gray12" fontWeight="600" mb="$2">{equipe.nome}</Text>
                            <GenericPicker
                                items={chaves}
                                value={selectedEquipe[equipe.id] ?? null}
                                onChange={chaveId => {
                                    if (chaveId) handleSelectChave(equipe.id, chaveId);
                                }}
                                getLabel={item => item.nome}
                                getValue={item => item.id}
                                placeholder="Selecione a chave"
                            />
                        </Card>
                    ))}
                </YStack>
            )}
            <Button
                onPress={handleSubmit}
                disabled={submitting}
                bg="$gray12"
                color="white"
                fontWeight="700"
            >
                Vincular Equipes
            </Button>
        </Tela>
    );
}
