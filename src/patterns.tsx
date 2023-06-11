import { useMemo } from 'react';
import { useTable, Column } from 'react-table';
import './index.css';
import type { ShotPattern } from './types';

function Patterns({ shotPatterns }: { shotPatterns: ShotPattern[] | null }) {
    const columns: Column<ShotPattern>[] = useMemo(
        () => [
            {
                Header: 'Shot Pattern',
                accessor: 'shotPattern',
                Cell: ({ value }: { value: string[] }) => <div>{value.join(', ')}</div>
            },
            {
                Header: 'Total Weight',
                accessor: 'totalWeightGrams',
                Cell: ({ value }: { value: number }) => <div>{value}g</div>
            },
            {
                Header: 'Offset Weight',
                accessor: 'offsetWeightGrams',
                Cell: ({ value }: { value: number }) => {
                    if (value > 0) {
                        return <div>+{value}g</div>;
                    } else if (value < 0) {
                        return <div>{value}g</div>;
                    } else {
                        return <div>-</div>;
                    }
                }
            },
            {
                Header: 'Variation',
                accessor: 'variation'
            }
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data: shotPatterns ?? []
    });

    if (!shotPatterns) {
        return null;
    }

    return (
        <table {...getTableProps()} style={{ width: '100%' }}>
            <thead>
                {headerGroups.map((headerGroup, index) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                        {headerGroup.headers.map((column, index) => (
                            <th {...column.getHeaderProps()} key={index}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>

            <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} key={index}>
                            {row.cells.map((cell, index) => (
                                <td {...cell.getCellProps()} key={index}>
                                    {' '}
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default Patterns;
