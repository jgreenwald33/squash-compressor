import { AngleSlider, Stack, Text, NumberInput, Paper } from "@mantine/core"
import { useState } from "react"

interface Props {
    max:number,
    min:number,
    effectName:string,
    units?:string
}


export default function SliderGroup({max,min,effectName,units}:Props) {

    const updateValue = (value:number) => {
        let convertedValue:number = Math.round((value - 20) * ((max + 12) / 360))
        setValue(convertedValue)
    }

    const [value,setValue] = useState<string | number>(min);
    return (
        <Stack align="center">
            <Text>
                {effectName}
            </Text>
            <Paper
                bg={"#e0e0e0"}
                shadow="xl" 
                style={{borderRadius:"9999px", justifyContent:"center", alignItems:"center"}} 
                p={"10px"} 
                display={"flex"} 
            >
                <Paper
                    bg={"#fff"}
                    style={{borderRadius:"9999px", justifyContent:"center", alignItems:"center", boxShadow:"0 8px 4px -1px gray"}} 
                    p={"10px"} 
                    display={"flex"}
                    
                >
                    <AngleSlider className={"flip"}
                        bg={"#fff"}
                        onChange={(e) => {
                            updateValue(Number(e));
                        }}
                        withLabel={false}
                        defaultValue={20}
                    />
                </Paper>

            </Paper>

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