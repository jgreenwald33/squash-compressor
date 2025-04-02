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
                    style={{
                        borderRadius:"9999px",
                        justifyContent:"center",
                        alignItems:"center",
                        boxShadow:"0 8px 8px -1px gray", 
                        background: "radial-gradient(circle, rgba(255,255,255,1) 20%, rgba(229,229,229,1) 80%)"
                    }} 
                    p={"15px"} 
                    display={"flex"}
                    
                >
                    <AngleSlider className={"flip"}
                        onChange={(e) => {
                            updateValue(Number(e));
                        }}
                        withLabel={false}
                        defaultValue={20}
                        style={{border:"1px solid #e9e9e9", background: "linear-gradient(195deg, rgba(255,255,255,1) 50%, rgba(229,229,229,1) 100%)"}}
                    />
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