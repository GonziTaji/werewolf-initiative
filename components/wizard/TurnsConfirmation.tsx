import { useMemo } from 'react';
import { SimpleCharacterFormData } from '../../interfaces';

interface TurnsConfirmationProps {
    forms?: SimpleCharacterFormData[];
}

interface CharacterInfo {
    characterName: string;
    initiative: number;
    actions: number;
}

export default function TurnsConfirmation({
    forms = [],
}: TurnsConfirmationProps) {
    const sortedCharacterInfo: CharacterInfo[] = useMemo(() => {
        return [...forms]
            .sort((a, b) => (a.initiative.value < b.initiative.value ? 1 : -1))
            .map((form) => ({
                characterName: form.characterName.value,
                initiative: form.initiative.value,
                actions: form.actions.value,
            }));
    }, [forms]);

    return (
        <>
            <div className="text-center block my-5">
                <h1 className="text-3xl">
                    Revise los turnos antes de comenzar
                </h1>
            </div>

            <div className="space-y-2">
                {sortedCharacterInfo.map(
                    ({ actions, characterName, initiative }, i) => (
                        <div
                            key={i}
                            className="px-1 shadow py-2 border border-black"
                        >
                            <div className="flex gap-3 items-center">
                                <span>{i + 1}.</span>
                                <span className="text-lg font-bold grow overflow-hidden overflow-ellipsis whitespace-nowrap">
                                    {characterName.toUpperCase()}
                                </span>
                            </div>

                            <div className="flex justify-between px-4">
                                <span>Iniciativa: {initiative}</span>

                                <span>Acciones: {actions}</span>
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    );
}
