"use client"
import {type UseTRPCQueryResult} from '@trpc/react-query/shared';
import React, {createContext, useEffect, useState} from 'react';
import {type inferRouterOutputs} from "@trpc/server";
import {type TRPCClientErrorLike} from '@trpc/react-query';
import {api} from "@/trpc/react";
import {AppRouter} from "@/trpc/root";
import {toast} from "sonner";


export type UnhydratedHouse = {
    stAddress: string,
    zipCode: string,
    city: string,
    state: string,
    id: string,
    generations?: { id: string, prompt: string, model: string, text: string }[]
    expertise: string | null
    lat: null
    nearbyPlaces: null
    investment: null
    recentlySold: null
    claimed: number | null
}

export type House =
    UseTRPCQueryResult<inferRouterOutputs<AppRouter>['house']['getHouseDetails'], TRPCClientErrorLike<AppRouter>>['data']

interface AdvOptions {
    temperature: number;
    max_tokens: number;
    top_p: number;
    modelName: ModelName
    modelId: ModelId
}

export type ModelName =
    "gpt-4-turbo-preview"
    | "anthropic.claude-v2:1"
    | "amazon.titan-text-lite-v1"
    | "amazon.titan-text-express-v1"
    | "anthropic.claude-3-sonnet-20240229-v1:0";

export type ModelId =
    "gpt-4-turbo-preview"
    | "anthropic.claude-v2:1"
    | "amazon.titan-text-lite-v1"
    | "amazon.titan-text-express-v1"
    | "anthropic.claude-3-sonnet-20240229-v1:0";


export const CurrentPromptContext = createContext({
    prompt: "",
    name: "",
    promptId: "",
    updateExpertise: (newExpertise: string, houseId: string) => {
        return
    },
    removePrompt: () => {
        return
    },
    changePrompt: (newPrompt: string, promptId: string, name: string) => {
        return
    },
    claimSelectedHouse: (houseToUpdateId: string) => {
        return
    },
    selectedHouses: [] as (House | UnhydratedHouse)[],
    addHouse: (newHouse: House | UnhydratedHouse) => {
        return
    },
    removeHouse: (house: House | UnhydratedHouse) => {
        return
    },
    advOptions: {
        temperature: 0.7,
        max_tokens: 750,
        top_p: 0.7,
        modelId: "amazon.titan-text-lite-v1",
        modelName: "amazon.titan-text-lite-v1"
    },
    setTopP: (value: number) => {
        return
    },
    setTemperature: (value: number) => {
        return
    },
    setMaxTokens: (value: number) => {
        return
    },
    setModelId: (value: ModelId) => {
        return
    },
    setModelName: (value: ModelName) => {
        return
    },
    setDataset: (value: "interior" | "exterior" | "investment" | undefined) => {
        return
    },
    dataset: undefined as "interior" | "exterior" | "investment" | undefined
})


export const PromptsProvider = ({children}: { children: React.ReactNode }) => {
    const utils = api.useUtils();

    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
        if (!firstLoad) return;
        const localTemperature = localStorage.getItem('temperature');
        const localMaxTokens = localStorage.getItem('max_tokens');
        const localTopP = localStorage.getItem('top_p');
        const localModelId = localStorage.getItem('modelId') as ModelId
        const localModelName = localStorage.getItem('modelName') as ModelName;

        const newAdvOptions: AdvOptions = {
            temperature: localTemperature ? parseFloat(localTemperature) : 0.50,
            max_tokens: localMaxTokens ? parseInt(localMaxTokens) : 750,
            top_p: localTopP ? parseFloat(localTopP) : 0.9,
            modelId: localModelId ? localModelId : "amazon.titan-text-lite-v1",
            modelName: localModelName ? localModelName : "amazon.titan-text-lite-v1"
        };

        setState((prevState) => ({
            ...prevState,
            advOptions: newAdvOptions,
        }));
        setFirstLoad(false);
    }, [firstLoad]);

    const removePrompt = () => {
        setState((prevState) => {
            return {...prevState, prompt: "", promptId: "", name: ""}
        })
    }

    const changePrompt = (newPrompt: string, promptId: string, name: string) => {
        setState((prevState) => {
            return {...prevState, prompt: newPrompt, promptId, name}
        })
    }


    const addHouse = (newHouse: UnhydratedHouse | House) => {
        if (!newHouse) {
            toast.error('Could not add house.')
            return
        }
        setState((prevState) => {
            if (prevState.selectedHouses.length >= 1) {
                toast.error('Maximum number of houses reached.', {id: newHouse.id})
                return {...prevState} // return here, state update has finished and we can stop executing the function
            }

            return {...prevState, selectedHouses: [...prevState.selectedHouses, newHouse]}
        })
    }

    const removeHouse = (house: UnhydratedHouse | House) => {
        setState((prevState) => {
            return {...prevState, selectedHouses: prevState.selectedHouses.filter(h => h !== house)}
        })
    }

    const claimSelectedHouse = (houseToUpdateId: string) => {
        setState((prevState) => {
                const updatedHouses = prevState.selectedHouses.map((house) => {
                    if (house?.id === houseToUpdateId) {
                        return {...house, claimed: 1};
                    }
                    return house
                })
                return {
                    ...prevState,
                    selectedHouses: updatedHouses
                }
            }
        )
    }

    const setAdvOptions = (newOptions: Partial<AdvOptions>) => {
        setState((prevState) => {
            const updatedOptions = {
                ...prevState.advOptions,
                ...newOptions,
            };

            localStorage.setItem('temperature', updatedOptions.temperature.toString());
            localStorage.setItem('max_tokens', updatedOptions.max_tokens.toString());
            localStorage.setItem('top_p', updatedOptions.top_p.toString());
            localStorage.setItem('modelId', updatedOptions.modelId);
            localStorage.setItem('modelName', updatedOptions.modelName);

            return {
                ...prevState,
                advOptions: updatedOptions,
            };
        });
    };

    const setTemperature = (newTemperature: number) => {
        setAdvOptions({temperature: newTemperature});
    };

    const setMaxTokens = (newMaxTokens: number) => {
        setAdvOptions({max_tokens: newMaxTokens});
    };

    const setTopP = (newTopP: number) => {
        setAdvOptions({top_p: newTopP});
    };

    const setModelName = (newModelName: ModelName) => {
        setAdvOptions({modelName: newModelName});
    };

    const setModelId = (newModelId: ModelId) => {
        setAdvOptions({modelId: newModelId});
    };


    const updateExpertise = (newExpertise: string, houseId: string) => {

        setState((prevState) => {

            if (prevState.selectedHouses.length === 0) {
                toast.error('No houses selected.')
                return prevState;
            }

            const house = prevState.selectedHouses.find((house: House | UnhydratedHouse) => house?.id === houseId)

            if (house === undefined) {
                toast.error('Could not find that house.')
                console.error('House with id, houseId: ', houseId, 'could not be found in the state');
                return prevState;
            }

            const updatedHouses = prevState.selectedHouses.map((house) => {
                if (house?.id === houseId) {
                    return {...house, expertise: newExpertise};
                }
                return house
            });

            return {
                ...prevState,
                selectedHouses: updatedHouses
            };
        });

        // house was pulled from the server, is a hydrated house. house should automatically get updated
        utils.house.getHouses.setData(undefined, (oldData) => {
            if (oldData === undefined) {
                return oldData
            }
            if (oldData.length === 0) {
                return oldData;
            }
            return oldData.map((house) => {
                if (house?.id === houseId) {
                    return {...house, expertise: newExpertise};
                }
                return house;
            });
        });


        // update selected houses
        setState((prevState) => {
            console.log('Setting the prompt context...')
            const updated = prevState.selectedHouses.map((house) => {
                if (house?.id === houseId) {
                    return {...house, expertise: newExpertise};
                }
                return house
            })
            return {
                ...prevState,
                selectedHouses: updated
            }
        })
        toast.success('Succesfully updated local expertise')
    }

    const setDataset = (value: "interior" | "exterior" | "investment" | undefined) => {
        setState((prevState) => {
            return {...prevState, dataset: value}
        })
        console.log("set dataset to: ", value)
    }

    const initState = {
        prompt: "",
        promptId: "",
        name: "",
        selectedHouses: [] as (House | UnhydratedHouse)[],
        updateExpertise,
        removePrompt,
        changePrompt,
        addHouse,
        removeHouse,
        advOptions: {
            temperature: 0.7,
            max_tokens: 750,
            top_p: 0.7,
            modelId: "amazon.titan-text-lite-v1",
            modelName: "amazon.titan-text-lite-v1"
        },
        setTopP,
        setTemperature,
        setMaxTokens,
        setModelId,
        setModelName,
        setDataset,
        dataset: undefined as "interior" | "exterior" | "investment" | undefined,
        claimSelectedHouse
    }
    const [state, setState] = useState(initState);

    return (
        <CurrentPromptContext.Provider value={state}>
            {children}
        </CurrentPromptContext.Provider>
    )
}
