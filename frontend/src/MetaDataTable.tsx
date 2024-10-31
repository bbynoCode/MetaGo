import React from 'react';

type MetaDataTableProps = {
    metadata: { [key: string]: string };
};

const MetaDataTable: React.FC<MetaDataTableProps> = ({ metadata }) => {
    return (
        <>
            {Object.entries(metadata).map(([key, value]) => (
                <tr key={key} className="border-b">
                    <td className="py-2 px-4 font-medium">{key}</td>
                    <td className="py-2 px-4">{value}</td>
                </tr>
            ))}
        </>
    );
};

export default MetaDataTable;