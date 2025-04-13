import { Group, Stack,Text } from "@mantine/core"
import { useMove } from "@mantine/hooks"
import { useEffect, useState } from "react"

interface Props {
    max:number,
    min:number,
    effectName:string,
    units?:string,
    step?:number,
    onChangeEvent?:(param:number)=>void;
}

export default function NumberSlider({max,min,effectName,units,step,onChangeEvent}:Props) {
    const [value,setValue] = useState(min)
    const { ref } = useMove(({ x }) => {
        const scaled:number = x * (max - min) + min;
        setValue(Number(scaled.toFixed(1)));
        if (onChangeEvent) {
            onChangeEvent(Number(scaled.toFixed(1)));
        }
    })
    useEffect(()=> {
        console.log(max)
        console.log(min)
        console.log(effectName)
        console.log(units)
        console.log(step)
    },[])
    return (
        <Stack gap={0} miw={"250px"}>
            <Text size="md" lts={"0.3rem"} c="oklch(55.6% 0 0)">
                {effectName.toLowerCase()}
            </Text>
            <Group gap={2} align="end">
                <Text   size="4.5rem"
                        variant="gradient" 
                        gradient={{ from: '#fccf31', to: '#f55555', deg: 206 }} 
                        fw={"500"} 
                        className="number-slider"
                        ref={ref}
                >
                    {value}
                </Text>
                <Text size="3rem" c="oklch(37.1% 0 0)" fw={"500"}>
                    {units}
                </Text>
            </Group>

        </Stack>
    )
}