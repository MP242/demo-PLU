'use client'

interface selectProps {
    Value?: string;
    size: string;
    DefaultValue: string;
    options: string[];
    onChange: (value: string) => void;
    Description?: string;
}

const MySelect = ({Value, DefaultValue, options, onChange, Description, size }: selectProps) => {
    return (
        <select
            value={Value}
            data-cy="select"
            className={`select select-primary select-bordered select-sm text-base-100 bg-primary`}
            defaultValue={DefaultValue}
            onChange={(e) => onChange(e.target.value)}>
            <option disabled
            className="text-black"
            >{Description}</option>

            {options.map((option, index) => (
                <option
                    key={index}
                    value={option}>
                    {option}
                </option>
            ))}
        </select>
    )

}

export default MySelect;
