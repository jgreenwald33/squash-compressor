import { Box, Group, Progress, Stack,Text } from "@mantine/core"
import { useMove } from "@mantine/hooks"
import { useEffect, useState } from "react"

interface Props {
    max:number,
    min:number,
    effectName:string,
    units?:string,
    step?:number,
    defaultValue:number,
    onChangeEvent:(param:number)=>void,
    callBackFunc?:(param:number)=>void
}

export default function NumberSlider({max,min,effectName,units,defaultValue,onChangeEvent, callBackFunc}:Props) {
    
    const [value,setValue] = useState(defaultValue);
    const { ref } = useMove(({ x }) => {
        const scaled:number = x * (max - min) + min;
        setValue(Number(scaled.toFixed(1)));
        if (onChangeEvent) {
            onChangeEvent(Number(scaled.toFixed(1)));
        }
        if (callBackFunc) {
            callBackFunc(Number(scaled.toFixed(1)));
        }
    })
    return (
        <Stack gap={0} miw={"250px"}>
            <Text size="md"  c="#e0e0e0">
                {effectName.toLowerCase()}
            </Text>
            <Group gap={2} align="end">
                <Text   size="3.5rem"
                        ref={ref}
                        c="red.3"
                        fw={"500"} 
                >
                    {units === "ms" && value / 1000 >= 1  ? (value / 1000).toFixed(2) : value}
                </Text>
                <Text size="2rem" c="#e0e0e0" fw={"500"}>
                    {units === "ms" && value / 1000 >= 1 ? "s" :units}
                </Text>
            </Group>
            <Box className="track" style={{minWidth:"100%", height:"20px", borderRadius:"5px"}} bg={"gray.9"} mt={5} ref={ref}>
                <Box className="fill" style={{maxWidth: `${(value - min) / (max - min) * 100}%`,
                    position:"relative", 
                    height:"100%", 
                    borderRadius: value !== max ? "5px 0px 0px 5px" : "5px"}}   
                >
                </Box>

            </Box>

        </Stack>
    )
}