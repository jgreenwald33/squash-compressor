import { AngleSlider, Stack, Text, NumberInput } from "@mantine/core"
import { useState } from "react"

interface Props {
    max:number,
    min:number,
    effectName:string,
    units?:string
}


export default function SliderGroup({max,min,effectName,units}:Props) {

    const updateValue = (value:number) => {
        let convertedValue:number = Math.round((value - 20) * ((max + 20) / 360))
        setValue(convertedValue)
    }

    const [value,setValue] = useState<string | number>(min);
    const markRange = Array.from({ length: 361 }, (_, i) => i)
                    .filter(i => i >= 20 && i <= 340)
                    .map(i => ({ value: i, }));
    return (
        <Stack align="center">
            <Text>
                {effectName}
            </Text>
            <AngleSlider className={"flip"}
                style={{transform:"rotate(180deg)"}}
                marks={markRange}
                  onChange={(e) => {
                    updateValue(Number(e));
                }}
                  restrictToMarks
                  withLabel={false}
                  defaultValue={20}
            />
            <NumberInput
                w={"100px"} 
                value={value}
                min={min}
                max={max}
                onChange={setValue}
                hideControls
                rightSection= {units ? units : ""}/>
        </Stack>
    )
}