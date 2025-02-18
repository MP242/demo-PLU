interface TableErrorProps {
    data: any[] | null;
}

const TableError = ({ data }: TableErrorProps) => {
    return (
        <div className="overflow-x-auto p-2">
            <table className="table table-zebra">
                <thead>
                    <tr className="text-xl">
                        <td>Error</td>
                        <td>Ligne</td>
                        <td>Data</td>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {data?.map((error, index) => (
                        <tr key={index}>
                            <td>
                                {error.message}
                            </td>
                            <td>{error.row}</td>
                            <td>
                                <pre className=" text-[15px]">
                                    {JSON.stringify(error.data, null, 2)}
                                </pre>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    )
}

export default TableError;
