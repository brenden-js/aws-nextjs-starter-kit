import React, {useState, useEffect} from 'react';
import * as Slider from '@radix-ui/react-slider';
import {ArrowRightIcon} from "@radix-ui/react-icons";
import {api} from "../../../trpc/react";
import {defaultChatData} from "./default-chats";

export const ResetChatSlider = ({houseId, topic}: {
    houseId: string,
    topic: "Property" | "Location" | "Financial" | "Main"
}) => {
    const [value, setValue] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [answered, setAnswered] = useState(false);

    const deleteChat = api.house.deleteChat.useMutation()

    const utils = api.useUtils()

    const handleResetChat = async () => {
        await deleteChat.mutateAsync({houseId: houseId, topic: topic})
        setValue(0)
        utils.house.getHouseDetails.setData(houseId, (old) => {
            if (!old) return old
            const expertiseField = `${topic.toLowerCase()}Expertise`
            return {
                ...old,
                [expertiseField]: JSON.stringify(defaultChatData[topic]),
            }
        })
    }

useEffect(() => {
    if (!isDragging && value < 100) {
        const timer = setTimeout(() => {
            setValue(0);
        }, 100);
        return () => clearTimeout(timer);
    }
}, [isDragging, value]);

const handleSliderChange = async (newValue: number[]) => {
    setValue(newValue[0]);
    if (newValue[0] === 100) {
        setAnswered(true);
        await handleResetChat()
    }
};

useEffect(() => {
    if (deleteChat.isSuccess) {
        setValue(0)
    }
}, [deleteChat.isSuccess])

if (answered && !deleteChat.isSuccess) {
    return (
        <div
            className="flex items-center justify-center h-9 w-full max-w-[300px] rounded-md bg-secondary text-black text-gray-600 font-semibold text-sm">
            Resetting chat...
        </div>
    );
}

// Calculate text opacity based on slider value
const textOpacity = Math.max(0, Math.min(1, (100 - value) / 80));

return (
    <div
        className="relative h-9 w-full max-w-[300px] bg-secondary shadow-sm hover:bg-secondary/80 border rounded-md overflow-hidden">
        <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-full"
            value={[value]}
            onValueChange={handleSliderChange}
            max={100}
            step={1}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
        >
            <Slider.Track className=" bg-secondary hover:bg-secondary/80 grow h-full">
                <div
                    className="z-1 absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{opacity: textOpacity}}
                >
                    <span className="text-gray-600 font-semibold text-sm mx-auto">Slide to reset</span>

                </div>
                <Slider.Range className="absolute bg-gray-300 h-full"/>
            </Slider.Track>
            <Slider.Thumb
                className="block h-9 w-9 bg-white hover:cursor-pointer shadow-lg">
                <div className={"flex items-center justify-center h-full w-full"}>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400 hover:text-gray-900 transition-colors"/>
                </div>
            </Slider.Thumb>
        </Slider.Root>

    </div>
);
}
;