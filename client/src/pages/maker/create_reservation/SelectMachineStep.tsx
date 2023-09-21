import {Button} from "@mui/material";

interface SelectMachineStepProps {
    stepForwards: () => void;
}

export default function ChooseExpertStep({
     stepForwards,
}: SelectMachineStepProps) {

    return (
        <>
            Select a machine to create a reservation
            <Button onClick={stepForwards}>
                next
            </Button>
        </>
    )
}

