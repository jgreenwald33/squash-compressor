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
    onChangeEvent:(param:number)=>void;
}

export default function NumberSlider({max,min,effectName,units,defaultValue,onChangeEvent}:Props) {
    
    const [value,setValue] = useState(defaultValue);
    const { ref } = useMove(({ x }) => {
        const scaled:number = x * (max - min) + min;
        setValue(Number(scaled.toFixed(1)));
        if (onChangeEvent) {
            onChangeEvent(Number(scaled.toFixed(1)));
        }
    })
    return (
        <Stack gap={0} miw={"250px"}>
            <Text size="md" lts={"0.3rem"} c="oklch(55.6% 0 0)">
                {effectName.toLowerCase()}
            </Text>
            <Group gap={2} align="end">
                <Text   size="3.5rem"
                        ref={ref}
                        color="violet.4"
                        fw={"500"} 
                >
                    {value}
                </Text>
                <Text size="2rem" c="oklch(37.1% 0 0)" fw={"500"}>
                    {units}
                </Text>
            </Group>
            <Box className="track" style={{minWidth:"100%", height:"20px", borderRadius:"5px"}} bg={"gray.1"} mt={5} ref={ref}>
                <Box className="fill number-slider" style={{maxWidth: `${(value - min) / (max - min) * 100}%`,
                    position:"relative", 
                    height:"100%", 
                    borderRadius: value !== max ? "5px 0px 0px 5px" : "5px"}}
                    bg={"violet.2"}   
                >
                </Box>

            </Box>

        </Stack>
    )
}