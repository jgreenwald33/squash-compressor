import { AngleSlider, Stack, Text, NumberInput } from "@mantine/core"
import { useState } from "react"

interface Props {
    max:number,
    min:number,
    effectName:string,
    units?:string
}

export default function SliderGroup({max,min,effectName,units}:Props) {
    const [value,setValue] = useState<string | number>(min);
    return (
        <Stack align="center" w={"fit-content"} >
            <Text>
                {effectName}
            </Text>
            <AngleSlider
                marks={[
                    { value: max },
                    { value: min },
                  ]}
                  onChange={(e) => setValue(e)}
                  value={Number(value)}
            />
            <NumberInput
                w={"100px"} 
                value={value}
                min={min}
                max={max}
                onChange={setValue} 
                rightSection= {units ? units : ""}/>
        </Stack>
    )
}