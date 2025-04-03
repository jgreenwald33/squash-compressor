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
        console.log("Within updateValue")
        if (!changingSlider) {
            let convertedValue:number = (value + 180) % 360;
            setValue(convertedValue)
        }

    }

    const [value,setValue] = useState<string | number>(min);
    const [changingSlider, setChangingSlider] = useState<boolean>(false);
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
                        onMouseDown={() => setChangingSlider(true)}
                        onMouseUp={() => setChangingSlider(false)}
                        onChange={(e) => {
                            updateValue(Number(e));
                        }}
                        withLabel={false}
                        style={{border:"1px solid #e9e9e9", background: "linear-gradient(195deg, rgba(255,255,255,1) 50%, rgba(229,229,229,1) 100%)"}}
                    />
                </Paper>


            <NumberInput
                w={"100px"} 
                value={value}
                min={min}
                max={max}
                onChange={(e) => {
                    setValue(e);
                }}
                hideControls
                rightSection= {units ? units : ""}/>
        </Stack>
    )
}